const express = require('express');
const db = require('../config/database');

const router = express.Router();

// Middleware to verify shop context
const verifyShop = async (req, res, next) => {
  const shopId = req.headers['x-shop-id'];
  if (!shopId) {
    return res.status(401).json({ error: 'Shop ID required' });
  }
  req.shopId = shopId;
  next();
};

router.use(verifyShop);

/**
 * Get shop settings
 */
router.get('/settings', async (req, res) => {
  try {
    const shopId = req.shopId;

    const result = await db.query(
      `SELECT 
        s.*,
        sh.shop_domain,
        sh.installed_at,
        sh.plan_name
       FROM shop_settings s
       JOIN shops sh ON sh.id = s.shop_id
       WHERE s.shop_id = $1`,
      [shopId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Settings not found' });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

/**
 * Update shop settings
 */
router.put('/settings', async (req, res) => {
  try {
    const shopId = req.shopId;
    const {
      defaultAttributionModel,
      attributionWindowDays,
      dataRetentionDays,
      enableDataDriven,
      enableEmailTracking
    } = req.body;

    const result = await db.query(
      `INSERT INTO shop_settings 
       (shop_id, default_attribution_model, attribution_window_days, data_retention_days, enable_data_driven, enable_email_tracking)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (shop_id) 
       DO UPDATE SET
         default_attribution_model = COALESCE($2, shop_settings.default_attribution_model),
         attribution_window_days = COALESCE($3, shop_settings.attribution_window_days),
         data_retention_days = COALESCE($4, shop_settings.data_retention_days),
         enable_data_driven = COALESCE($5, shop_settings.enable_data_driven),
         enable_email_tracking = COALESCE($6, shop_settings.enable_email_tracking),
         updated_at = NOW()
       RETURNING *`,
      [
        shopId,
        defaultAttributionModel,
        attributionWindowDays,
        dataRetentionDays,
        enableDataDriven,
        enableEmailTracking
      ]
    );

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

/**
 * Get shop stats
 */
router.get('/stats', async (req, res) => {
  try {
    const shopId = req.shopId;

    // Total touchpoints
    const touchpointsResult = await db.query(
      'SELECT COUNT(*) as count FROM touchpoints WHERE shop_id = $1',
      [shopId]
    );

    // Total attributed orders
    const ordersResult = await db.query(
      'SELECT COUNT(DISTINCT order_id) as count FROM attribution_results WHERE shop_id = $1',
      [shopId]
    );

    // Total customers
    const customersResult = await db.query(
      'SELECT COUNT(DISTINCT customer_id) as count FROM touchpoints WHERE shop_id = $1',
      [shopId]
    );

    // Data retention info
    const oldestDataResult = await db.query(
      'SELECT MIN(created_at) as oldest FROM touchpoints WHERE shop_id = $1',
      [shopId]
    );

    res.json({
      totalTouchpoints: parseInt(touchpointsResult.rows[0].count),
      totalAttributedOrders: parseInt(ordersResult.rows[0].count),
      totalTrackedCustomers: parseInt(customersResult.rows[0].count),
      oldestData: oldestDataResult.rows[0].oldest
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

/**
 * Get tracking script for shop
 */
router.get('/tracking-script', async (req, res) => {
  try {
    const shopId = req.shopId;

    const result = await db.query(
      'SELECT shop_domain FROM shops WHERE id = $1',
      [shopId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    const shopDomain = result.rows[0].shop_domain;
    const apiUrl = process.env.APP_URL || 'https://your-app.com';

    const script = `
<!-- Attribution Tracking Script -->
<script>
(function() {
  var ATTR = window.ATTR || {};
  ATTR.shop = '${shopDomain}';
  ATTR.apiUrl = '${apiUrl}';
  
  // Generate or retrieve customer ID
  ATTR.getCustomerId = function() {
    var cid = localStorage.getItem('attr_customer_id');
    if (!cid) {
      cid = 'attr_' + Math.random().toString(36).substring(2) + Date.now();
      localStorage.setItem('attr_customer_id', cid);
    }
    return cid;
  };
  
  // Parse UTM params from URL
  ATTR.getUTMParams = function() {
    var params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
      utm_content: params.get('utm_content'),
      utm_term: params.get('utm_term')
    };
  };
  
  // Track event
  ATTR.track = function(event, properties) {
    var data = {
      shop: ATTR.shop,
      customerId: ATTR.getCustomerId(),
      event: event,
      properties: Object.assign({
        url: window.location.href,
        referrer: document.referrer,
        title: document.title
      }, ATTR.getUTMParams(), properties)
    };
    
    fetch(ATTR.apiUrl + '/api/tracking/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(function(e) { console.error('Tracking error:', e); });
  };
  
  // Track pageview
  ATTR.track('pageview');
  
  // Expose to global
  window.ATTR = ATTR;
})();
</script>
    `.trim();

    res.json({ script, shopDomain });

  } catch (error) {
    console.error('Get tracking script error:', error);
    res.status(500).json({ error: 'Failed to generate script' });
  }
});

module.exports = router;
