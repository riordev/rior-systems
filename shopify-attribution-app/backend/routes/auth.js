const express = require('express');
const crypto = require('crypto');
const querystring = require('querystring');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const db = require('../config/database');

const router = express.Router();

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET;
const APP_URL = process.env.SHOPIFY_APP_URL;
const JWT_SECRET = process.env.JWT_SECRET;

// Verify Shopify request signature
function verifyShopifyRequest(query, hmac) {
  const message = Object.keys(query)
    .filter(key => key !== 'hmac' && key !== 'signature')
    .sort()
    .map(key => `${key}=${query[key]}`)
    .join('&');
  
  const generatedHmac = crypto
    .createHmac('sha256', SHOPIFY_API_SECRET)
    .update(message)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(generatedHmac),
    Buffer.from(hmac)
  );
}

// Install/Auth route
router.get('/', async (req, res) => {
  const { shop } = req.query;
  
  if (!shop) {
    return res.status(400).send('Missing shop parameter');
  }
  
  const sanitizedShop = shop.replace('.myshopify.com', '').trim() + '.myshopify.com';
  
  const state = crypto.randomBytes(16).toString('hex');
  res.cookie('shopify_auth_state', state, { httpOnly: true, secure: true });
  
  const scopes = 'read_orders,read_customers,read_products';
  const redirectUri = `${APP_URL}/auth/callback`;
  
  const installUrl = `https://${sanitizedShop}/admin/oauth/authorize?` +
    querystring.stringify({
      client_id: SHOPIFY_API_KEY,
      scope: scopes,
      redirect_uri: redirectUri,
      state: state
    });
  
  res.redirect(installUrl);
});

// OAuth callback
router.get('/callback', async (req, res) => {
  const { shop, code, state, hmac } = req.query;
  
  if (!shop || !code || !hmac) {
    return res.status(400).send('Missing required parameters');
  }
  
  // Verify HMAC
  if (!verifyShopifyRequest(req.query, hmac)) {
    return res.status(400).send('Invalid HMAC');
  }
  
  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(
      `https://${shop}/admin/oauth/access_token`,
      {
        client_id: SHOPIFY_API_KEY,
        client_secret: SHOPIFY_API_SECRET,
        code: code
      }
    );
    
    const accessToken = tokenResponse.data.access_token;
    const scope = tokenResponse.data.scope;
    
    // Save or update shop
    const result = await db.query(
      `INSERT INTO shops (shop_domain, access_token, scope, installed_at, is_active)
       VALUES ($1, $2, $3, NOW(), true)
       ON CONFLICT (shop_domain) 
       DO UPDATE SET access_token = $2, scope = $3, updated_at = NOW(), is_active = true, uninstall_at = NULL
       RETURNING id, shop_domain`,
      [shop, accessToken, scope]
    );
    
    const shopRecord = result.rows[0];
    
    // Create default settings
    await db.query(
      `INSERT INTO shop_settings (shop_id, default_attribution_model, attribution_window_days)
       VALUES ($1, 'last_click', 30)
       ON CONFLICT (shop_id) DO NOTHING`,
      [shopRecord.id]
    );
    
    // Create JWT for session
    const token = jwt.sign(
      { shopId: shopRecord.id, shopDomain: shopRecord.shop_domain },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth?token=${token}&shop=${shop}`);
    
  } catch (error) {
    console.error('OAuth error:', error.response?.data || error.message);
    res.status(500).send('Authentication failed');
  }
});

// Verify JWT middleware
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.shopId = decoded.shopId;
    req.shopDomain = decoded.shopDomain;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { router, verifyToken };
