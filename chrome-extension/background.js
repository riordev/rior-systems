// Rior Systems - Background Service Worker
// Handles notifications, alarms, and badge updates

const API_BASE_URL = 'https://api.rior.systems/v1';

// Configuration
const CONFIG = {
  DAILY_NOTIFICATION_HOUR: 9, // 9 AM
  ROAS_THRESHOLD: 2.0, // Alert when ROAS drops below this
  PROFIT_ALERT_THRESHOLD: 0, // Alert when daily profit is negative
  CHECK_INTERVAL_MINUTES: 15
};

// Initialize extension
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Rior Systems extension installed');
    
    // Set default settings
    chrome.storage.sync.set({
      notificationsEnabled: true,
      roasThreshold: CONFIG.ROAS_THRESHOLD,
      dailyReportEnabled: true
    });
  }

  // Setup alarms
  setupAlarms();
});

// Setup recurring alarms
function setupAlarms() {
  // Clear existing alarms
  chrome.alarms.clearAll();

  // Daily profit notification at 9 AM
  chrome.alarms.create('dailyProfit', {
    when: getNext9AM(),
    periodInMinutes: 24 * 60 // Daily
  });

  // Check for alerts every 15 minutes
  chrome.alarms.create('checkAlerts', {
    periodInMinutes: CONFIG.CHECK_INTERVAL_MINUTES
  });
}

// Calculate next 9 AM timestamp
function getNext9AM() {
  const now = new Date();
  const next9AM = new Date(now.getFullYear(), now.getMonth(), now.getDate(), CONFIG.DAILY_NOTIFICATION_HOUR, 0, 0);
  
  if (next9AM <= now) {
    next9AM.setDate(next9AM.getDate() + 1);
  }
  
  return next9AM.getTime();
}

// Handle alarm triggers
chrome.alarms.onAlarm.addListener(async (alarm) => {
  const { storeConnected } = await chrome.storage.sync.get('storeConnected');
  
  if (!storeConnected) return;

  switch (alarm.name) {
    case 'dailyProfit':
      await sendDailyProfitNotification();
      break;
    case 'checkAlerts':
      await checkAndSendAlerts();
      break;
  }
});

// Send daily profit notification
async function sendDailyProfitNotification() {
  try {
    const { accessToken, dailyReportEnabled } = await chrome.storage.sync.get([
      'accessToken', 
      'dailyReportEnabled'
    ]);

    if (!accessToken || !dailyReportEnabled) return;

    // Fetch yesterday's profit
    const response = await fetch(`${API_BASE_URL}/metrics/yesterday`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) return;

    const data = await response.json();

    // Format profit
    const profitFormatted = formatCurrency(data.profit);
    const isPositive = data.profit >= 0;

    // Send notification
    await chrome.notifications.create('daily-profit', {
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: `Yesterday's Profit: ${profitFormatted}`,
      message: `Revenue: ${formatCurrency(data.revenue)} | ROAS: ${data.roas?.toFixed(2) || '—'}x`,
      priority: 1,
      buttons: [
        { title: 'View Dashboard' },
        { title: 'Dismiss' }
      ]
    });

  } catch (error) {
    console.error('Failed to send daily notification:', error);
  }
}

// Check for alerts and send notifications
async function checkAndSendAlerts() {
  try {
    const { accessToken, notificationsEnabled, roasThreshold } = await chrome.storage.sync.get([
      'accessToken',
      'notificationsEnabled',
      'roasThreshold'
    ]);

    if (!accessToken || !notificationsEnabled) {
      chrome.action.setBadgeText({ text: '' });
      return;
    }

    // Fetch active alerts
    const response = await fetch(`${API_BASE_URL}/alerts/active`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) return;

    const alerts = await response.json();
    const criticalAlerts = alerts.filter(a => a.severity === 'critical');
    const warningAlerts = alerts.filter(a => a.severity === 'warning');

    // Update badge
    const alertCount = alerts.length;
    if (alertCount > 0) {
      chrome.action.setBadgeText({ text: alertCount.toString() });
      chrome.action.setBadgeBackgroundColor({ 
        color: criticalAlerts.length > 0 ? '#EF4444' : '#F59E0B' 
      });
    } else {
      chrome.action.setBadgeText({ text: '' });
    }

    // Check ROAS threshold
    const metricsResponse = await fetch(`${API_BASE_URL}/metrics/today`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (metricsResponse.ok) {
      const metrics = await metricsResponse.json();
      
      if (metrics.roas < (roasThreshold || CONFIG.ROAS_THRESHOLD)) {
        const lastRoasAlert = await chrome.storage.local.get('lastRoasAlert');
        const now = Date.now();
        
        // Don't alert more than once per hour
        if (!lastRoasAlert.lastRoasAlert || (now - lastRoasAlert.lastRoasAlert) > (60 * 60 * 1000)) {
          await chrome.notifications.create('roas-alert', {
            type: 'basic',
            iconUrl: 'icons/icon128.png',
            title: '⚠️ ROAS Alert',
            message: `Your ROAS has dropped to ${metrics.roas.toFixed(2)}x (below ${roasThreshold || CONFIG.ROAS_THRESHOLD}x threshold)`,
            priority: 2
          });
          
          await chrome.storage.local.set({ lastRoasAlert: now });
        }
      }
    }

    // Send notification for new critical alerts
    const lastAlertIds = (await chrome.storage.local.get('lastAlertIds')).lastAlertIds || [];
    const newCriticalAlerts = criticalAlerts.filter(a => !lastAlertIds.includes(a.id));

    if (newCriticalAlerts.length > 0) {
      const alert = newCriticalAlerts[0]; // Show first critical alert
      
      await chrome.notifications.create(`alert-${alert.id}`, {
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: '🚨 Critical Alert',
        message: alert.message,
        priority: 2,
        requireInteraction: true
      });

      // Store alert IDs
      await chrome.storage.local.set({
        lastAlertIds: alerts.map(a => a.id)
      });
    }

  } catch (error) {
    console.error('Failed to check alerts:', error);
  }
}

// Handle notification clicks
chrome.notifications.onClicked.addListener((notificationId) => {
  chrome.tabs.create({ url: 'https://app.rior.systems/dashboard' });
  chrome.notifications.clear(notificationId);
});

// Handle notification button clicks
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  if (buttonIndex === 0) {
    // View Dashboard
    chrome.tabs.create({ url: 'https://app.rior.systems/dashboard' });
  }
  chrome.notifications.clear(notificationId);
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openPopup') {
    chrome.action.openPopup();
  }
  sendResponse({ success: true });
  return true;
});

// Handle extension icon click
chrome.action.onClicked.addListener(() => {
  // Badge is automatically cleared when popup opens
});

// Listen for storage changes to update settings
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    if (changes.notificationsEnabled !== undefined ||
        changes.dailyReportEnabled !== undefined) {
      setupAlarms();
    }
  }
});

// Format currency helper
function formatCurrency(value) {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

// Listen for messages to open popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openAuth') {
    chrome.tabs.create({ url: 'https://app.rior.systems/auth' });
  }
  sendResponse({ success: true });
});