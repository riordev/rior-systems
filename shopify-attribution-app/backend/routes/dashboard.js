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
 * Get dashboard overview stats
 */
router.get('/overview', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const shopId = req.shopId;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Total attributed revenue
    const revenueResult = await db.query(
      `SELECT COALESCE(SUM(total_revenue), 0) as total_revenue,
              COUNT(DISTINCT order_id) as total_orders
       FROM attribution_results
       WHERE shop_id = $1 AND created_at >= $2`,
      [shopId, startDate]
    );

    // Channel breakdown
    const channelResult = await db.query(
      `SELECT 
        channel,
        SUM((channel_attribution->channel->>'amount')::numeric) as revenue,
        COUNT(*) as orders
       FROM attribution_results,
            jsonb_object_keys(channel_attribution) as channel
       WHERE shop_id = $1 AND created_at >= $2
       GROUP BY channel
       ORDER BY revenue DESC`,
      [shopId, startDate]
    );

    // Journey length stats
    const journeyResult = await db.query(
      `SELECT 
        AVG(journey_length) as avg_touchpoints,
        AVG(time_to_conversion_hours) as avg_time_to_conversion
       FROM attribution_results
       WHERE shop_id = $1 AND created_at >= $2`,
      [shopId, startDate]
    );

    // Daily trend
    const trendResult = await db.query(
      `SELECT 
        DATE(created_at) as date,
        SUM(total_revenue) as revenue,
        COUNT(*) as orders
       FROM attribution_results
       WHERE shop_id = $1 AND created_at >= $2
       GROUP BY DATE(created_at)
       ORDER BY date ASC`,
      [shopId, startDate]
    );

    res.json({
      period: `${days} days`,
      totalRevenue: parseFloat(revenueResult.rows[0]?.total_revenue || 0),
      totalOrders: parseInt(revenueResult.rows[0]?.total_orders || 0),
      channelBreakdown: channelResult.rows.map(row => ({
        channel: row.channel,
        revenue: parseFloat(row.revenue || 0),
        orders: parseInt(row.orders || 0)
      })),
      journeyStats: {
        avgTouchpoints: parseFloat(journeyResult.rows[0]?.avg_touchpoints || 0).toFixed(1),
        avgTimeToConversion: parseFloat(journeyResult.rows[0]?.avg_time_to_conversion || 0).toFixed(1)
      },
      dailyTrend: trendResult.rows.map(row => ({
        date: row.date,
        revenue: parseFloat(row.revenue || 0),
        orders: parseInt(row.orders || 0)
      }))
    });

  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({ error: 'Failed to fetch overview' });
  }
});

/**
 * Get attributed revenue by channel
 */
router.get('/channels', async (req, res) => {
  try {
    const { days = 30, model = 'last_click' } = req.query;
    const shopId = req.shopId;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const result = await db.query(
      `SELECT 
        channel,
        SUM((channel_attribution->channel->>'amount')::numeric) as attributed_revenue,
        SUM((channel_attribution->channel->>'percentage')::numeric) as percentage,
        COUNT(*) as conversions
       FROM attribution_results,
            jsonb_object_keys(channel_attribution) as channel
       WHERE shop_id = $1 
       AND attribution_model = $2
       AND created_at >= $3
       GROUP BY channel
       ORDER BY attributed_revenue DESC`,
      [shopId, model, startDate]
    );

    res.json({
      model,
      period: `${days} days`,
      channels: result.rows.map(row => ({
        channel: row.channel,
        attributedRevenue: parseFloat(row.attributed_revenue || 0),
        percentage: parseFloat(row.percentage || 0).toFixed(1),
        conversions: parseInt(row.conversions || 0)
      }))
    });

  } catch (error) {
    console.error('Channels error:', error);
    res.status(500).json({ error: 'Failed to fetch channels' });
  }
});

/**
 * Get customer journeys
 */
router.get('/journeys', async (req, res) => {
  try {
    const { limit = 50, offset = 0, converted = null } = req.query;
    const shopId = req.shopId;

    let query = `
      SELECT 
        cj.*,
        json_agg(
          json_build_object(
            'id', t.id,
            'channel', t.channel,
            'source', t.source,
            'campaign', t.campaign,
            'touchedAt', t.touched_at,
            'landingPage', t.landing_page
          ) ORDER BY t.touched_at
        ) as touchpoints
      FROM customer_journeys cj
      LEFT JOIN touchpoints t ON t.customer_id = cj.customer_id AND t.shop_id = cj.shop_id
      WHERE cj.shop_id = $1
    `;

    const params = [shopId];

    if (converted !== null) {
      query += ` AND cj.converted = $${params.length + 1}`;
      params.push(converted === 'true');
    }

    query += `
      GROUP BY cj.id
      ORDER BY cj.updated_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    params.push(limit, offset);

    const result = await db.query(query, params);

    res.json({
      journeys: result.rows,
      pagination: { limit, offset }
    });

  } catch (error) {
    console.error('Journeys error:', error);
    res.status(500).json({ error: 'Failed to fetch journeys' });
  }
});

/**
 * Get comparison of attribution models
 */
router.get('/model-comparison', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const shopId = req.shopId;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const models = ['first_click', 'last_click', 'linear', 'time_decay'];
    const comparisons = {};

    for (const model of models) {
      const result = await db.query(
        `SELECT 
          channel,
          SUM((channel_attribution->channel->>'amount')::numeric) as revenue
         FROM attribution_results,
              jsonb_object_keys(channel_attribution) as channel
         WHERE shop_id = $1 
         AND attribution_model = $2
         AND created_at >= $3
         GROUP BY channel
         ORDER BY revenue DESC`,
        [shopId, model, startDate]
      );

      comparisons[model] = result.rows.map(row => ({
        channel: row.channel,
        revenue: parseFloat(row.revenue || 0)
      }));
    }

    res.json({
      period: `${days} days`,
      comparisons
    });

  } catch (error) {
    console.error('Model comparison error:', error);
    res.status(500).json({ error: 'Failed to fetch comparison' });
  }
});

module.exports = router;
