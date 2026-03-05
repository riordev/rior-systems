# Rior Systems Chrome Extension

A Chrome extension for Shopify merchants to track real-time profit intelligence directly in their admin panel.

## Features

### 🔐 Authentication
- OAuth 2.0 flow to connect your Shopify store
- Secure token storage with auto-refresh
- Automatic session management

### 📊 Popup Dashboard
- **Glass-themed UI** with dark aesthetic
- Yesterday's key metrics: Revenue, Profit, ROAS
- Quick links to full dashboard, alerts, and booking calls
- Real-time connection status indicator

### 🛒 Shopify Admin Integration
- **Orders Page**: Profit column added to orders table
- **Product Pages**: Mini profit widget showing:
  - Estimated profit per unit
  - Profit margin percentage
  - 30-day profit summary

### 🔔 Background Notifications
- Daily 9 AM notification with yesterday's profit
- ROAS drop alerts when below threshold
- Badge counter for active alerts

## Installation

### Development Mode

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select this folder
4. The extension icon should appear in your toolbar

### Icons Setup

The extension requires PNG icons. Generate them from the provided SVGs:

```bash
cd /Users/johnbot/.openclaw/workspace/rior-systems/chrome-extension
npm install sharp
node generate-icons.js
```

Or manually convert these SVG files to PNG:
- `icons/icon16.svg` → `icons/icon16.png`
- `icons/icon32.svg` → `icons/icon32.png`
- `icons/icon48.svg` → `icons/icon48.png`
- `icons/icon128.svg` → `icons/icon128.png`

## Configuration

### API Endpoints

Update these in the code files:

**popup.js, content.js, content-product.js, background.js:**
```javascript
const API_BASE_URL = 'https://api.rior.systems/v1';
```

**manifest.json:**
```json
"oauth2": {
  "client_id": "YOUR_CLIENT_ID"
}
```

### Environment Variables (for production)

Create a `.env` file for local development:
```
API_BASE_URL=https://api.rior.systems/v1
AUTH_URL=https://app.rior.systems/auth/chrome
CLIENT_ID=your_client_id
```

## File Structure

```
chrome-extension/
├── manifest.json          # Extension manifest (v3)
├── popup.html             # Popup UI markup
├── popup.css              # Glass theme styles
├── popup.js               # Popup logic & auth
├── content.js             # Orders page injection
├── content-product.js     # Product page widget
├── content.css            # Content script styles
├── background.js          # Service worker for notifications
├── oauth-callback.html    # OAuth callback handler
├── generate-icons.js      # Icon generation script
├── icons/
│   ├── icon16.svg         # Extension icons
│   ├── icon32.svg
│   ├── icon48.svg
│   └── icon128.svg
└── README.md              # This file
```

## API Requirements

Your Rior Systems API should implement these endpoints:

### Authentication
- `POST /auth/refresh` - Refresh access token
- OAuth callback at `https://app.rior.systems/auth/chrome`

### Metrics
- `GET /metrics/yesterday` - Returns: `{ revenue, profit, roas }`
- `GET /metrics/today` - Returns: `{ revenue, profit, roas }`

### Orders
- `GET /orders/:id/profit` - Returns: `{ profit }`

### Products
- `GET /products/:id/metrics` - Returns: `{ profitPerUnit, margin, profit30d }`

### Alerts
- `GET /alerts/active` - Returns: Array of `{ id, severity, message }`

## Permissions

The extension requires these permissions:
- `storage` - Store auth tokens and settings
- `notifications` - Show profit and alert notifications
- `alarms` - Schedule daily notifications
- `identity` - OAuth authentication
- `activeTab` - Current tab access

## Browser Support

- Chrome 88+ (Manifest V3)
- Edge 88+ (Chromium-based)
- Other Chromium browsers

## Security Notes

- Tokens are stored in `chrome.storage.sync` (encrypted at rest)
- Content scripts only inject on `*.myshopify.com/admin/*` domains
- OAuth uses PKCE flow for secure token exchange
- API credentials never exposed to page context

## Development

### Testing Locally

1. Load extension in Chrome developer mode
2. Click extension icon → "Connect Store"
3. Complete OAuth flow with test credentials
4. Navigate to Shopify admin to see injected content

### Debugging

- Popup: Right-click icon → "Inspect popup"
- Background: chrome://extensions/ → "Service worker" link
- Content scripts: Regular DevTools on Shopify admin

## License

Private - Rior Systems