const express = require('express');
const crypto = require('crypto');
const db = require('../config/database');
const { parseUserAgent, parseReferrer } = require('../utils/tracking');

const router = express.Router();

/**
 * Parse UTM parameters from query string
 */
function parseUTMParams(query) {
  return {
    utmSource: query.utm_source || query.utmSource || null,
    utmMedium: query.utm_medium || query.utmMedium || null,
    utmCampaign: query.utm_campaign || query.utmCampaign || null,
    utmContent: query.utm_content || query.utmContent || null,
    utmTerm: query.utm_term || query.utmTerm || null
  };
}

/**
 * Determine marketing channel from UTM parameters
 */
function determineChannel(utmSource, utmMedium, referrer) {
  const source = (utmSource || '').toLowerCase();
  const medium = (utmMedium || '').toLowerCase();
  
  // Paid social
  if (['meta', 'facebook', 'instagram', 'fb'].includes(source) || 
      (source.includes('facebook')) ||
      (medium === 'paid_social' || medium === 'paidsocial' || medium === 'cpc' && ['facebook', 'instagram'].includes(source))) {
    return 'meta';
  }
  
  // Google Ads
  if (source === 'google' && (medium === 'cpc' || medium === 'ppc' || medium === 'paid')) {
    return 'google_ads';
  }
  
  // Organic Google
  if (source === 'google' && medium === 'organic') {
    return 'organic_search';
  }
  
  // TikTok
  if (['tiktok', 'tiktokads', 'tt'].includes(source)) {
    return 'tiktok';
  }
  
  // Email
  if (['email', 'newsletter', 'mail', 'e-mail'].includes(source) || 
      medium === 'email') {
    return 'email';
  }
  
  // YouTube
  if (['youtube', 'yt'].includes(source)) {
    return 'youtube';
  }
  
  // Snapchat
  if (['snapchat', 'snap'].includes(source)) {
    return 'snapchat';
  }
  
  // Pinterest
  if (['pinterest'].includes(source)) {
    return 'pinterest';
  }
  
  // Twitter/X
  if (['twitter', 'x', 't.co'].includes(source)) {
    return 'twitter';
  }
  
  // LinkedIn
  if (['linkedin', 'li'].includes(source)) {
    return 'linkedin';
  }
  
  // Direct
  if (!source || source === 'direct' || (!source && !referrer)) {
    return 'direct';
  }
  
  // Referral (has referrer but no UTM)
  if (referrer && !source) {
    return 'referral';
  }
  
  // Other
  return 'other';
}

/**
 * Generate customer ID from fingerprint
 */
function generateCustomerId(shopId, fingerprint) {
  return crypto
    .createHash('sha256')
    .update(`${shopId}:${fingerprint}`)
    .digest('hex')
    .substring(0, 32);
}

/**
 * Tracking pixel - records pageview/events
 */
router.get('/pixel', async (req, res) => {
  try {
    const { 
      shop, 
      cid, // customer/session ID
      page,
      event = 'pageview',
      revenue,
      orderId
    } = req.query;

    if (!shop) {
      return res.status(400).json({ error: 'Shop required' });
    }

    // Get shop ID
    const shopResult = await db.query(
      'SELECT id FROM shops WHERE shop_domain = $1 AND is_active = true',
      [shop]
    );

    if (shopResult.rows.length === 0) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    const shopId = shopResult.rows[0].id;
    const utm = parseUTMParams(req.query);
    const referrer = req.headers.referer || req.query.referrer || null;
    const userAgent = req.headers['user-agent'];
    const ip = req.ip || req.connection.remoteAddress;

    // Determine channel
    const channel = determineChannel(utm.utmSource, utm.utmMedium, referrer);

    // Generate or use customer ID
    const customerId = cid || generateCustomerId(shopId, `${ip}:${userAgent}`);

    // Log tracking event
    await db.query(
      `INSERT INTO tracking_events 
       (shop_id, event_type, customer_id, session_id, payload, utm_data, user_agent, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        shopId,
        event,
        customerId,
        cid || customerId,
        JSON.stringify(req.query),
        JSON.stringify(utm),
        userAgent,
        ip
      ]
    );

    // If this is a purchase/conversion event with UTM data, record touchpoint
    if ((event === 'purchase' || utm.utmSource) && orderId) {
      await db.query(
        `INSERT INTO touchpoints 
         (shop_id, customer_id, session_id, order_id, source, medium, campaign, content, term,
          channel, utm_source, utm_medium, utm_campaign, utm_content, utm_term,
          landing_page, referrer, device_type, browser, revenue, attributed_revenue, touched_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, NOW())
         ON CONFLICT DO NOTHING`,
        [
          shopId,
          customerId,
          cid,
          orderId,
          utm.utmSource,
          utm.utmMedium,
          utm.utmCampaign,
          utm.utmContent,
          utm.utmTerm,
          channel,
          utm.utmSource,
          utm.utmMedium,
          utm.utmCampaign,
          utm.utmContent,
          utm.utmTerm,
          page || req.query.url,
          referrer,
          parseUserAgent(userAgent).device,
          parseUserAgent(userAgent).browser,
          revenue || 0,
          revenue || 0
        ]
      );

      // Update customer journey
      await updateCustomerJourney(shopId, customerId, revenue, orderId);
    }

    // Return 1x1 transparent pixel
    const pixel = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    );

    res.set('Content-Type', 'image/gif');
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.send(pixel);

  } catch (error) {
    console.error('Tracking pixel error:', error);
    res.status(500).end();
  }
});

/**
 * Webhook endpoint for Shopify orders
 */
router.post('/webhook/order', async (req, res) => {
  try {
    const { order } = req.body;
    const shopDomain = req.headers['x-shopify-shop-domain'];

    if (!order || !shopDomain) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    // Verify webhook signature (in production)
    // const hmac = req.headers['x-shopify-hmac-sha256'];
    // verifyWebhook(req.body, hmac);

    // Get shop
    const shopResult = await db.query(
      'SELECT id FROM shops WHERE shop_domain = $1',
      [shopDomain]
    );

    if (shopResult.rows.length === 0) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    const shopId = shopResult.rows[0].id;
    const customerId = order.customer?.id?.toString() || order.email;
    const orderId = order.id.toString();
    const revenue = parseFloat(order.total_price);

    // Check for existing touchpoints for this customer
    const touchResult = await db.query(
      `SELECT * FROM touchpoints 
       WHERE shop_id = $1 AND customer_id = $2
       ORDER BY touched_at DESC LIMIT 1`,
      [shopId, customerId]
    );

    if (touchResult.rows.length > 0) {
      // Update the most recent touchpoint with order info
      await db.query(
        `UPDATE touchpoints 
         SET order_id = $1, revenue = $2, attributed_revenue = $2
         WHERE id = $3`,
        [orderId, revenue, touchResult.rows[0].id]
      );
    }

    // Update customer journey
    await updateCustomerJourney(shopId, customerId, revenue, orderId, true);

    res.json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

/**
 * Update customer journey summary
 */
async function updateCustomerJourney(shopId, customerId, revenue, orderId, converted = true) {
  // Get all touchpoints for this customer
  const touchResult = await db.query(
    `SELECT * FROM touchpoints 
     WHERE shop_id = $1 AND customer_id = $2
     ORDER BY touched_at ASC`,
    [shopId, customerId]
  );

  if (touchResult.rows.length === 0) return;

  const firstTouch = touchResult.rows[0];
  const lastTouch = touchResult.rows[touchResult.rows.length - 1];

  await db.query(
    `INSERT INTO customer_journeys 
     (shop_id, customer_id, first_touch_at, last_touch_at, touchpoint_count, total_revenue, converted, conversion_order_id, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
     ON CONFLICT (shop_id, customer_id) 
     DO UPDATE SET
       last_touch_at = $4,
       touchpoint_count = $5,
       total_revenue = $6,
       converted = $7,
       conversion_order_id = $8,
       updated_at = NOW()`,
    [
      shopId,
      customerId,
      firstTouch.touched_at,
      lastTouch.touched_at,
      touchResult.rows.length,
      revenue || 0,
      converted,
      orderId
    ]
  );
}

/**
 * POST endpoint for JavaScript tracking
 */
router.post('/event', async (req, res) => {
  try {
    const { shop, customerId, event, properties = {} } = req.body;

    if (!shop || !event) {
      return res.status(400).json({ error: 'Shop and event required' });
    }

    const shopResult = await db.query(
      'SELECT id FROM shops WHERE shop_domain = $1 AND is_active = true',
      [shop]
    );

    if (shopResult.rows.length === 0) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    const shopId = shopResult.rows[0].id;
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Parse UTM from properties
    const utm = {
      utmSource: properties.utm_source || properties.utmSource,
      utmMedium: properties.utm_medium || properties.utmMedium,
      utmCampaign: properties.utm_campaign || properties.utmCampaign,
      utmContent: properties.utm_content || properties.utmContent,
      utmTerm: properties.utm_term || properties.utmTerm
    };

    const referrer = properties.referrer || req.headers.referer;
    const channel = determineChannel(utm.utmSource, utm.utmMedium, referrer);

    // Log event
    await db.query(
      `INSERT INTO tracking_events 
       (shop_id, event_type, customer_id, session_id, payload, utm_data, user_agent, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        shopId,
        event,
        customerId,
        properties.sessionId || customerId,
        JSON.stringify(properties),
        JSON.stringify(utm),
        userAgent,
        ip
      ]
    );

    // Record touchpoint for key events
    if (['purchase', 'checkout', 'add_to_cart'].includes(event) || utm.utmSource) {
      await db.query(
        `INSERT INTO touchpoints 
         (shop_id, customer_id, session_id, order_id, source, medium, campaign, content, term,
          channel, utm_source, utm_medium, utm_campaign, utm_content, utm_term,
          landing_page, referrer, device_type, browser, revenue, touched_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, NOW())
         ON CONFLICT DO NOTHING`,
        [
          shopId,
          customerId,
          properties.sessionId || customerId,
          properties.orderId || null,
          utm.utmSource,
          utm.utmMedium,
          utm.utmCampaign,
          utm.utmContent,
          utm.utmTerm,
          channel,
          utm.utmSource,
          utm.utmMedium,
          utm.utmCampaign,
          utm.utmContent,
          utm.utmTerm,
          properties.url || properties.page,
          referrer,
          properties.deviceType || parseUserAgent(userAgent).device,
          properties.browser || parseUserAgent(userAgent).browser,
          properties.revenue || 0
        ]
      );
    }

    res.json({ success: true, customerId, channel });

  } catch (error) {
    console.error('Event tracking error:', error);
    res.status(500).json({ error: 'Tracking failed' });
  }
});

module.exports = router;
