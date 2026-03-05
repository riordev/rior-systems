const express = require('express');
const db = require('../config/database');
const AttributionEngine = require('../services/attributionEngine');

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
 * Run attribution calculation for a specific order
 */
router.post('/calculate', async (req, res) => {
  try {
    const { orderId, customerId, revenue, orderDate, model } = req.body;
    const shopId = req.shopId;

    if (!orderId || !customerId || !revenue) {
      return res.status(400).json({ 
        error: 'orderId, customerId, and revenue are required' 
      });
    }

    // Get shop settings for default model
    const settingsResult = await db.query(
      'SELECT default_attribution_model FROM shop_settings WHERE shop_id = $1',
      [shopId]
    );

    const attributionModel = model || 
      settingsResult.rows[0]?.default_attribution_model || 
      'last_click';

    // Create attribution engine
    const engine = new AttributionEngine(shopId, { 
      model: attributionModel 
    });

    // Calculate attribution
    const result = await engine.calculateAttribution(
      orderId,
      customerId,
      parseFloat(revenue),
      orderDate || new Date()
    );

    res.json(result);

  } catch (error) {
    console.error('Attribution calculation error:', error);
    res.status(500).json({ error: 'Attribution calculation failed' });
  }
});

/**
 * Batch calculate attribution for multiple orders
 */
router.post('/batch-calculate', async (req, res) => {
  try {
    const { orders, model } = req.body;
    const shopId = req.shopId;

    if (!Array.isArray(orders) || orders.length === 0) {
      return res.status(400).json({ error: 'orders array required' });
    }

    const settingsResult = await db.query(
      'SELECT default_attribution_model FROM shop_settings WHERE shop_id = $1',
      [shopId]
    );

    const attributionModel = model || 
      settingsResult.rows[0]?.default_attribution_model || 
      'last_click';

    const engine = new AttributionEngine(shopId, { model: attributionModel });
    const results = [];

    for (const order of orders) {
      try {
        const result = await engine.calculateAttribution(
          order.orderId,
          order.customerId,
          parseFloat(order.revenue),
          order.orderDate || new Date()
        );
        results.push({ success: true, ...result });
      } catch (err) {
        results.push({ 
          success: false, 
          orderId: order.orderId, 
          error: err.message 
        });
      }
    }

    res.json({
      processed: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    });

  } catch (error) {
    console.error('Batch attribution error:', error);
    res.status(500).json({ error: 'Batch calculation failed' });
  }
});

/**
 * Get attribution results for an order
 */
router.get('/order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const shopId = req.shopId;

    const result = await db.query(
      `SELECT * FROM attribution_results 
       WHERE shop_id = $1 AND order_id = $2`,
      [shopId, orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Attribution not found' });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Get attribution error:', error);
    res.status(500).json({ error: 'Failed to fetch attribution' });
  }
});

/**
 * Re-run attribution with different model
 */
router.post('/recalculate', async (req, res) => {
  try {
    const { orderIds, newModel } = req.body;
    const shopId = req.shopId;

    if (!orderIds || !newModel) {
      return res.status(400).json({ 
        error: 'orderIds and newModel are required' 
      });
    }

    const engine = new AttributionEngine(shopId, { model: newModel });
    const results = [];

    for (const orderId of orderIds) {
      // Get existing order data
      const existingResult = await db.query(
        `SELECT customer_id, total_revenue, created_at 
         FROM attribution_results 
         WHERE shop_id = $1 AND order_id = $2`,
        [shopId, orderId]
      );

      if (existingResult.rows.length > 0) {
        const order = existingResult.rows[0];
        const result = await engine.calculateAttribution(
          orderId,
          order.customer_id,
          parseFloat(order.total_revenue),
          order.created_at
        );
        results.push(result);
      }
    }

    res.json({
      recalculated: results.length,
      model: newModel,
      results
    });

  } catch (error) {
    console.error('Recalculation error:', error);
    res.status(500).json({ error: 'Recalculation failed' });
  }
});

/**
 * Get attribution summary for date range
 */
router.get('/summary', async (req, res) => {
  try {
    const { startDate, endDate, model } = req.query;
    const shopId = req.shopId;

    const query = `
      SELECT 
        attribution_model,
        COUNT(DISTINCT order_id) as total_orders,
        SUM(total_revenue) as total_revenue,
        AVG(journey_length) as avg_journey_length,
        AVG(time_to_conversion_hours) as avg_time_to_conversion
      FROM attribution_results
      WHERE shop_id = $1 
      ${startDate ? 'AND created_at >= $2' : ''}
      ${endDate ? `AND created_at <= $${startDate ? 3 : 2}` : ''}
      ${model ? `AND attribution_model = $${startDate && endDate ? 4 : startDate || endDate ? 3 : 2}` : ''}
      GROUP BY attribution_model
    `;

    const params = [shopId];
    if (startDate) params.push(startDate);
    if (endDate) params.push(endDate);
    if (model) params.push(model);

    const result = await db.query(query, params);

    res.json({
      period: { startDate, endDate },
      summary: result.rows
    });

  } catch (error) {
    console.error('Attribution summary error:', error);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

module.exports = router;
