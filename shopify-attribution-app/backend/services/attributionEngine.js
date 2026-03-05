/**
 * Attribution Engine
 * Implements multiple attribution models:
 * - First Click: 100% credit to first touchpoint
 * - Last Click: 100% credit to last touchpoint  
 * - Linear: Equal credit to all touchpoints
 * - Time Decay: More credit to recent touchpoints
 * - Data-Driven: Machine learning based (placeholder)
 */

const db = require('../config/database');

class AttributionEngine {
  constructor(shopId, options = {}) {
    this.shopId = shopId;
    this.windowDays = options.windowDays || 30;
    this.model = options.model || 'last_click';
  }

  /**
   * Get customer journey for a specific customer
   */
  async getCustomerJourney(customerId, endDate = null) {
    const query = `
      SELECT * FROM touchpoints 
      WHERE shop_id = $1 AND customer_id = $2
      ${endDate ? 'AND touched_at <= $3' : ''}
      ORDER BY touched_at ASC
    `;
    
    const params = endDate 
      ? [this.shopId, customerId, endDate]
      : [this.shopId, customerId];
    
    const result = await db.query(query, params);
    return result.rows;
  }

  /**
   * Calculate attribution using specified model
   */
  async calculateAttribution(orderId, customerId, revenue, orderDate) {
    const journey = await this.getCustomerJourney(customerId, orderDate);
    
    if (journey.length === 0) {
      return {
        orderId,
        customerId,
        model: this.model,
        attributedRevenue: {},
        totalRevenue: revenue,
        journeyLength: 0
      };
    }

    let attribution = {};

    switch (this.model) {
      case 'first_click':
        attribution = this.firstClickAttribution(journey, revenue);
        break;
      case 'last_click':
        attribution = this.lastClickAttribution(journey, revenue);
        break;
      case 'linear':
        attribution = this.linearAttribution(journey, revenue);
        break;
      case 'time_decay':
        attribution = this.timeDecayAttribution(journey, revenue, orderDate);
        break;
      case 'data_driven':
        attribution = await this.dataDrivenAttribution(journey, revenue);
        break;
      default:
        attribution = this.lastClickAttribution(journey, revenue);
    }

    // Save attribution result
    await this.saveAttributionResult(orderId, customerId, attribution, revenue, journey);

    return {
      orderId,
      customerId,
      model: this.model,
      channelAttribution: attribution,
      totalRevenue: revenue,
      journeyLength: journey.length,
      timeToConversion: this.calculateTimeToConversion(journey, orderDate),
      touchpoints: journey
    };
  }

  /**
   * First Click Attribution - 100% to first touchpoint
   */
  firstClickAttribution(journey, revenue) {
    const firstTouch = journey[0];
    return {
      [firstTouch.channel]: {
        amount: revenue,
        percentage: 100,
        touchpointId: firstTouch.id
      }
    };
  }

  /**
   * Last Click Attribution - 100% to last touchpoint
   */
  lastClickAttribution(journey, revenue) {
    const lastTouch = journey[journey.length - 1];
    return {
      [lastTouch.channel]: {
        amount: revenue,
        percentage: 100,
        touchpointId: lastTouch.id
      }
    };
  }

  /**
   * Linear Attribution - Equal credit to all touchpoints
   */
  linearAttribution(journey, revenue) {
    const equalShare = revenue / journey.length;
    const attribution = {};

    journey.forEach((touchpoint, index) => {
      if (!attribution[touchpoint.channel]) {
        attribution[touchpoint.channel] = {
          amount: 0,
          percentage: 0,
          touchpoints: []
        };
      }
      
      attribution[touchpoint.channel].amount += equalShare;
      attribution[touchpoint.channel].percentage += (100 / journey.length);
      attribution[touchpoint.channel].touchpoints.push(touchpoint.id);
    });

    // Round amounts to 2 decimal places
    Object.keys(attribution).forEach(channel => {
      attribution[channel].amount = Math.round(attribution[channel].amount * 100) / 100;
      attribution[channel].percentage = Math.round(attribution[channel].percentage * 100) / 100;
    });

    return attribution;
  }

  /**
   * Time Decay Attribution - More credit to recent touchpoints
   * Uses exponential decay formula
   */
  timeDecayAttribution(journey, revenue, conversionDate) {
    const decayHalfLife = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
    const conversionTime = new Date(conversionDate).getTime();
    
    let totalWeight = 0;
    const weights = journey.map(touchpoint => {
      const touchTime = new Date(touchpoint.touched_at).getTime();
      const age = conversionTime - touchTime;
      const weight = Math.pow(0.5, age / decayHalfLife);
      totalWeight += weight;
      return { touchpoint, weight };
    });

    const attribution = {};

    weights.forEach(({ touchpoint, weight }) => {
      const share = (weight / totalWeight) * revenue;
      
      if (!attribution[touchpoint.channel]) {
        attribution[touchpoint.channel] = {
          amount: 0,
          percentage: 0,
          touchpoints: []
        };
      }
      
      attribution[touchpoint.channel].amount += share;
      attribution[touchpoint.channel].percentage += (weight / totalWeight) * 100;
      attribution[touchpoint.channel].touchpoints.push(touchpoint.id);
    });

    // Round values
    Object.keys(attribution).forEach(channel => {
      attribution[channel].amount = Math.round(attribution[channel].amount * 100) / 100;
      attribution[channel].percentage = Math.round(attribution[channel].percentage * 100) / 100;
    });

    return attribution;
  }

  /**
   * Data-Driven Attribution (placeholder)
   * Would use ML models in production
   */
  async dataDrivenAttribution(journey, revenue) {
    // Placeholder: Use shapley value concept or Markov chains
    // For now, falls back to linear with a note
    console.log('Data-driven attribution requested - using linear as fallback');
    return this.linearAttribution(journey, revenue);
  }

  /**
   * Calculate time from first touch to conversion
   */
  calculateTimeToConversion(journey, conversionDate) {
    if (journey.length === 0) return 0;
    const firstTouch = new Date(journey[0].touched_at);
    const conversion = new Date(conversionDate);
    return Math.round((conversion - firstTouch) / (1000 * 60 * 60)); // Hours
  }

  /**
   * Save attribution result to database
   */
  async saveAttributionResult(orderId, customerId, attribution, revenue, journey) {
    const timeToConversion = this.calculateTimeToConversion(journey, new Date());
    
    await db.query(
      `INSERT INTO attribution_results 
       (shop_id, order_id, customer_id, attribution_model, channel_attribution, total_revenue, journey_length, time_to_conversion_hours)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (shop_id, order_id) DO UPDATE SET
       attribution_model = $4,
       channel_attribution = $5,
       updated_at = NOW()`,
      [
        this.shopId,
        orderId,
        customerId,
        this.model,
        JSON.stringify(attribution),
        revenue,
        journey.length,
        timeToConversion
      ]
    );
  }

  /**
   * Get aggregated attribution data by channel
   */
  async getChannelAttribution(startDate, endDate) {
    const result = await db.query(
      `SELECT 
        channel,
        COUNT(*) as touchpoints,
        COUNT(DISTINCT customer_id) as unique_customers,
        SUM(CASE WHEN order_id IS NOT NULL THEN 1 ELSE 0 END) as conversions,
        SUM(attributed_revenue) as total_revenue
       FROM touchpoints
       WHERE shop_id = $1 
       AND touched_at BETWEEN $2 AND $3
       GROUP BY channel
       ORDER BY total_revenue DESC`,
      [this.shopId, startDate, endDate]
    );

    return result.rows;
  }
}

module.exports = AttributionEngine;
