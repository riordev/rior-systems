// Rior Systems - Shopify Orders Page Content Script
// Injects profit column into Shopify admin orders table

const API_BASE_URL = 'https://api.rior.systems/v1';

// Store processed order IDs to avoid duplicate API calls
const processedOrders = new Set();
let isAuthenticated = false;
let accessToken = null;

// Initialize
(async function init() {
  // Check if user is authenticated
  const auth = await chrome.storage.sync.get(['accessToken', 'storeConnected']);
  isAuthenticated = !!(auth.accessToken && auth.storeConnected);
  accessToken = auth.accessToken;

  if (isAuthenticated) {
    startObserving();
    injectProfitColumn();
  }
})();

// Listen for auth state changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.accessToken) {
    isAuthenticated = !!changes.accessToken.newValue;
    accessToken = changes.accessToken.newValue;
    if (isAuthenticated) {
      startObserving();
      injectProfitColumn();
    }
  }
});

// Start observing DOM changes
function startObserving() {
  const observer = new MutationObserver((mutations) => {
    let shouldInject = false;
    
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if orders table was added or modified
            if (node.matches('[data-testid="orders-table"]') || 
                node.querySelector('[data-testid="orders-table"]') ||
                node.matches('table') ||
                node.querySelector('table')) {
              shouldInject = true;
              break;
            }
          }
        }
      }
    }

    if (shouldInject) {
      injectProfitColumn();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Inject profit column into orders table
async function injectProfitColumn() {
  if (!isAuthenticated) return;

  // Find the orders table
  const table = document.querySelector('table[data-testid="orders-table"]') || 
                document.querySelector('table tbody tr:first-child td:nth-child(3)')?.closest('table');
  
  if (!table) return;

  // Check if we already added the profit column
  if (table.querySelector('th.rior-profit-header')) return;

  // Add header cell
  const headerRow = table.querySelector('thead tr');
  if (headerRow) {
    const profitHeader = document.createElement('th');
    profitHeader.className = 'rior-profit-header';
    profitHeader.textContent = 'Profit';
    profitHeader.style.cssText = 'text-align: right; padding: 12px;';
    headerRow.appendChild(profitHeader);
  }

  // Process each order row
  const rows = table.querySelectorAll('tbody tr');
  for (const row of rows) {
    await processOrderRow(row);
  }
}

// Process individual order row
async function processOrderRow(row) {
  // Extract order ID from the row
  const orderLink = row.querySelector('a[href*="/orders/"]');
  if (!orderLink) return;

  const orderIdMatch = orderLink.href.match(/\/orders\/(\d+)/);
  if (!orderIdMatch) return;

  const orderId = orderIdMatch[1];
  
  // Skip if already processed
  if (processedOrders.has(orderId)) return;
  processedOrders.add(orderId);

  // Add profit cell
  const profitCell = document.createElement('td');
  profitCell.className = 'rior-profit-column';
  profitCell.style.cssText = 'text-align: right; padding: 12px;';
  profitCell.innerHTML = '<span class="rior-loading">—</span>';
  row.appendChild(profitCell);

  // Fetch profit data
  try {
    const profit = await fetchOrderProfit(orderId);
    
    if (profit !== null) {
      const profitClass = profit > 0 ? 'rior-profit-positive' : 
                         profit < 0 ? 'rior-profit-negative' : 'rior-profit-neutral';
      profitCell.innerHTML = `<span class="${profitClass}">${formatCurrency(profit)}</span>`;
    } else {
      profitCell.innerHTML = '<span class="rior-profit-neutral">—</span>';
    }
  } catch (error) {
    console.error('Failed to fetch profit for order', orderId, error);
    profitCell.innerHTML = '<span class="rior-error" title="Failed to load">—</span>';
  }
}

// Fetch order profit from API
async function fetchOrderProfit(orderId) {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/profit`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired, try to refresh
      await refreshToken();
      return fetchOrderProfit(orderId); // Retry
    }
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data.profit;
}

// Refresh access token
async function refreshToken() {
  const { refreshToken } = await chrome.storage.sync.get('refreshToken');
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken })
  });

  if (!response.ok) {
    throw new Error('Token refresh failed');
  }

  const data = await response.json();
  
  await chrome.storage.sync.set({
    accessToken: data.access_token,
    refreshToken: data.refresh_token || refreshToken,
    tokenExpiry: Date.now() + (data.expires_in * 1000)
  });

  accessToken = data.access_token;
}

// Format currency
function formatCurrency(value) {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}