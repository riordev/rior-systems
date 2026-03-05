// Rior Systems Chrome Extension - Popup Script

const API_BASE_URL = 'https://api.rior.systems/v1';
const AUTH_URL = 'https://app.rior.systems/auth/chrome';

// DOM Elements
const notLoggedInView = document.getElementById('notLoggedIn');
const dashboardView = document.getElementById('dashboard');
const connectionStatus = document.getElementById('connectionStatus');
const connectBtn = document.getElementById('connectBtn');
const disconnectBtn = document.getElementById('disconnectBtn');
const refreshBtn = document.getElementById('refreshBtn');
const viewAlertsBtn = document.getElementById('viewAlertsBtn');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await checkAuthState();
  setupEventListeners();
});

function setupEventListeners() {
  connectBtn.addEventListener('click', handleConnect);
  disconnectBtn.addEventListener('click', handleDisconnect);
  refreshBtn.addEventListener('click', handleRefresh);
  viewAlertsBtn.addEventListener('click', openFullDashboard);
}

// Check authentication state
async function checkAuthState() {
  const { accessToken, storeConnected } = await chrome.storage.sync.get([
    'accessToken',
    'storeConnected'
  ]);

  if (accessToken && storeConnected) {
    showDashboard();
    await loadDashboardData();
  } else {
    showLoginPrompt();
  }
}

// Show login prompt
function showLoginPrompt() {
  notLoggedInView.classList.remove('hidden');
  dashboardView.classList.add('hidden');
  updateConnectionStatus(false);
}

// Show dashboard
function showDashboard() {
  notLoggedInView.classList.add('hidden');
  dashboardView.classList.remove('hidden');
  updateConnectionStatus(true);
}

// Update connection status indicator
function updateConnectionStatus(isConnected) {
  const dot = connectionStatus.querySelector('.dot');
  dot.className = `dot ${isConnected ? 'online' : 'offline'}`;
}

// Handle connect button
async function handleConnect() {
  connectBtn.disabled = true;
  connectBtn.textContent = 'Connecting...';

  try {
    // Launch OAuth flow
    const authUrl = `${AUTH_URL}?redirect_uri=${encodeURIComponent(chrome.runtime.getURL('oauth-callback.html'))}`;
    
    const result = await chrome.identity.launchWebAuthFlow({
      url: authUrl,
      interactive: true
    });

    // Parse tokens from redirect URL
    const url = new URL(result);
    const accessToken = url.searchParams.get('access_token');
    const refreshToken = url.searchParams.get('refresh_token');
    const expiresIn = url.searchParams.get('expires_in');

    if (accessToken) {
      await chrome.storage.sync.set({
        accessToken,
        refreshToken,
        tokenExpiry: Date.now() + (expiresIn * 1000),
        storeConnected: true
      });

      showDashboard();
      await loadDashboardData();
      
      // Clear badge
      chrome.action.setBadgeText({ text: '' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    alert('Connection failed. Please try again.');
  } finally {
    connectBtn.disabled = false;
    connectBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 12l2 2 4-4"/>
        <circle cx="12" cy="12" r="10"/>
      </svg>
      Connect Store
    `;
  }
}

// Handle disconnect
async function handleDisconnect() {
  if (!confirm('Disconnect your store?')) return;

  await chrome.storage.sync.remove([
    'accessToken',
    'refreshToken',
    'tokenExpiry',
    'storeConnected',
    'yesterdayMetrics',
    'alerts'
  ]);

  showLoginPrompt();
}

// Handle refresh
async function handleRefresh() {
  refreshBtn.textContent = 'Refreshing...';
  await loadDashboardData();
  refreshBtn.textContent = 'Refresh';
}

// Load dashboard data
async function loadDashboardData() {
  const { accessToken } = await chrome.storage.sync.get('accessToken');
  
  if (!accessToken) {
    showLoginPrompt();
    return;
  }

  // Set loading state
  document.getElementById('yesterdayRevenue').textContent = '...';
  document.getElementById('yesterdayProfit').textContent = '...';
  document.getElementById('yesterdayRoas').textContent = '...';

  try {
    // Check token expiry and refresh if needed
    await ensureValidToken();

    // Fetch yesterday's metrics
    const response = await fetch(`${API_BASE_URL}/metrics/yesterday`, {
      headers: {
        'Authorization': `Bearer ${(await chrome.storage.sync.get('accessToken')).accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Failed to fetch metrics');

    const data = await response.json();
    
    // Update UI
    document.getElementById('yesterdayRevenue').textContent = formatCurrency(data.revenue);
    document.getElementById('yesterdayProfit').textContent = formatCurrency(data.profit);
    document.getElementById('yesterdayRoas').textContent = formatRoas(data.roas);

    // Save to storage
    await chrome.storage.sync.set({ yesterdayMetrics: data });

    // Load alerts
    await loadAlerts();

  } catch (error) {
    console.error('Failed to load dashboard:', error);
    
    // Try to use cached data
    const { yesterdayMetrics } = await chrome.storage.sync.get('yesterdayMetrics');
    if (yesterdayMetrics) {
      document.getElementById('yesterdayRevenue').textContent = formatCurrency(yesterdayMetrics.revenue);
      document.getElementById('yesterdayProfit').textContent = formatCurrency(yesterdayMetrics.profit);
      document.getElementById('yesterdayRoas').textContent = formatRoas(yesterdayMetrics.roas);
    } else {
      document.getElementById('yesterdayRevenue').textContent = '—';
      document.getElementById('yesterdayProfit').textContent = '—';
      document.getElementById('yesterdayRoas').textContent = '—';
    }
  }
}

// Load alerts
async function loadAlerts() {
  try {
    const response = await fetch(`${API_BASE_URL}/alerts/active`, {
      headers: {
        'Authorization': `Bearer ${(await chrome.storage.sync.get('accessToken')).accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Failed to fetch alerts');

    const alerts = await response.json();
    
    // Update alerts list
    const alertsList = document.getElementById('alertsList');
    const alertCount = document.getElementById('alertCount');
    
    alertCount.textContent = alerts.length;
    
    if (alerts.length === 0) {
      alertsList.innerHTML = `
        <div class="alert-item">
          <span class="alert-dot" style="background: var(--text-muted);"></span>
          <span class="alert-text">No active alerts</span>
        </div>
      `;
    } else {
      alertsList.innerHTML = alerts.map(alert => `
        <div class="alert-item">
          <span class="alert-dot ${alert.severity === 'critical' ? 'danger' : ''}"></span>
          <span class="alert-text">${alert.message}</span>
        </div>
      `).join('');
    }

    // Save to storage
    await chrome.storage.sync.set({ alerts });

  } catch (error) {
    console.error('Failed to load alerts:', error);
  }
}

// Ensure valid token
async function ensureValidToken() {
  const { accessToken, refreshToken, tokenExpiry } = await chrome.storage.sync.get([
    'accessToken', 'refreshToken', 'tokenExpiry'
  ]);

  // If token expires in less than 5 minutes, refresh it
  if (tokenExpiry && Date.now() > tokenExpiry - (5 * 60 * 1000) && refreshToken) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken })
      });

      if (!response.ok) throw new Error('Token refresh failed');

      const data = await response.json();
      
      await chrome.storage.sync.set({
        accessToken: data.access_token,
        refreshToken: data.refresh_token || refreshToken,
        tokenExpiry: Date.now() + (data.expires_in * 1000)
      });
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Token refresh failed, user will need to reconnect
      showLoginPrompt();
    }
  }
}

// Open full dashboard
function openFullDashboard() {
  chrome.tabs.create({ url: 'https://app.rior.systems/dashboard' });
}

// Format currency
function formatCurrency(value) {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

// Format ROAS
function formatRoas(value) {
  if (value === null || value === undefined) return '—';
  return value.toFixed(2) + 'x';
}