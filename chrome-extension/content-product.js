// Rior Systems - Shopify Product Page Content Script
// Adds mini profit widget to product detail pages

const API_BASE_URL = 'https://api.rior.systems/v1';

let isAuthenticated = false;
let accessToken = null;
let widgetInjected = false;

// Initialize
(async function init() {
  // Check if user is authenticated
  const auth = await chrome.storage.sync.get(['accessToken', 'storeConnected']);
  isAuthenticated = !!(auth.accessToken && auth.storeConnected);
  accessToken = auth.accessToken;

  if (isAuthenticated) {
    startObserving();
  } else {
    injectConnectPrompt();
  }
})();

// Listen for auth state changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.accessToken) {
    isAuthenticated = !!changes.accessToken.newValue;
    accessToken = changes.accessToken.newValue;
    if (isAuthenticated) {
      removeConnectPrompt();
      startObserving();
    } else {
      widgetInjected = false;
      injectConnectPrompt();
    }
  }
});

// Start observing DOM changes
function startObserving() {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if product details section exists
            if (node.matches('[data-testid="product-details"]') || 
                node.querySelector('[data-testid="product-details"]') ||
                node.matches('[class*="product"]') ||
                node.querySelector('[class*="product"]')) {
              injectProductWidget();
              break;
            }
          }
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Try to inject immediately if page is already loaded
  injectProductWidget();
}

// Inject profit widget on product page
async function injectProductWidget() {
  if (!isAuthenticated || widgetInjected) return;

  // Find product details section
  const productSection = document.querySelector('[data-testid="product-details"]') ||
                         document.querySelector('[class*="Polaris-Layout__Section"]:nth-child(2)') ||
                         document.querySelector('form[action*="/admin/products/"]');

  if (!productSection) return;

  // Check if already injected
  if (productSection.querySelector('.rior-product-widget')) return;

  widgetInjected = true;

  // Extract product ID from URL
  const productIdMatch = window.location.pathname.match(/\/products\/(\d+)/);
  if (!productIdMatch) return;

  const productId = productIdMatch[1];

  // Create widget
  const widget = document.createElement('div');
  widget.className = 'rior-product-widget';
  widget.innerHTML = `
    <div class="rior-product-widget-header">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
      Rior Systems Profit Intelligence
    </div>
    <div class="rior-product-metrics">
      <div class="rior-metric">
        <div class="rior-metric-label">Est. Profit/Unit</div>
        <div class="rior-metric-value rior-loading" id="rior-profit-per-unit">—</div>
      </div>
      <div class="rior-metric">
        <div class="rior-metric-label">Margin</div>
        <div class="rior-metric-value rior-loading" id="rior-margin">—</div>
      </div>
      <div class="rior-metric">
        <div class="rior-metric-label">30d Profit</div>
        <div class="rior-metric-value rior-loading" id="rior-30d-profit">—</div>
      </div>
    </div>
  `;

  // Insert widget after pricing section or at top of product details
  const pricingSection = productSection.querySelector('[class*="price"]') || 
                         productSection.querySelector('input[name*="price"]')?.closest('div[class*="Polaris-FormLayout__Item"]');
  
  if (pricingSection) {
    pricingSection.parentNode.insertBefore(widget, pricingSection.nextSibling);
  } else {
    productSection.insertBefore(widget, productSection.firstChild);
  }

  // Fetch product data
  await loadProductData(productId);
}

// Load product profit data
async function loadProductData(productId) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/metrics`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        await refreshToken();
        return loadProductData(productId);
      }
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    // Update widget with data
    updateWidget(data);

  } catch (error) {
    console.error('Failed to load product data:', error);
    document.querySelector('.rior-product-widget').innerHTML += `
      <div class="rior-error" style="margin-top: 8px; font-size: 12px;">
        Unable to load profit data. <a href="https://app.rior.systems" target="_blank" style="color: #6366f1;">View in dashboard</a>
      </div>
    `;
  }
}

// Update widget with data
function updateWidget(data) {
  const profitEl = document.getElementById('rior-profit-per-unit');
  const marginEl = document.getElementById('rior-margin');
  const profit30dEl = document.getElementById('rior-30d-profit');

  if (profitEl) {
    profitEl.textContent = formatCurrency(data.profitPerUnit);
    profitEl.className = `rior-metric-value ${data.profitPerUnit > 0 ? 'profit-positive' : data.profitPerUnit < 0 ? 'profit-negative' : ''}`;
  }

  if (marginEl) {
    marginEl.textContent = formatPercentage(data.margin);
    marginEl.classList.remove('rior-loading');
  }

  if (profit30dEl) {
    profit30dEl.textContent = formatCurrency(data.profit30d);
    profit30dEl.className = `rior-metric-value ${data.profit30d > 0 ? 'profit-positive' : data.profit30d < 0 ? 'profit-negative' : ''}`;
  }
}

// Inject connect prompt for non-authenticated users
function injectConnectPrompt() {
  const productSection = document.querySelector('[data-testid="product-details"]') ||
                         document.querySelector('[class*="Polaris-Layout__Section"]:nth-child(2)');

  if (!productSection || productSection.querySelector('.rior-connect-prompt')) return;

  const prompt = document.createElement('div');
  prompt.className = 'rior-connect-prompt';
  prompt.innerHTML = `
    <p>Connect Rior Systems to see real-time profit data for this product</p>
    <button class="rior-connect-btn" id="rior-connect-store-btn">Connect Store</button>
  `;

  productSection.insertBefore(prompt, productSection.firstChild);

  document.getElementById('rior-connect-store-btn').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'openPopup' });
  });
}

// Remove connect prompt
function removeConnectPrompt() {
  const prompt = document.querySelector('.rior-connect-prompt');
  if (prompt) {
    prompt.remove();
  }
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

// Format percentage
function formatPercentage(value) {
  if (value === null || value === undefined) return '—';
  return value.toFixed(1) + '%';
}