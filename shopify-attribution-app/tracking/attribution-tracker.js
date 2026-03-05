/**
 * Shopify Attribution Tracking Script
 * Include this in your Shopify theme's <head> section
 */
(function() {
  'use strict';

  // Configuration
  var config = {
    apiUrl: document.currentScript?.getAttribute('data-api-url') || 'https://your-app.com',
    shop: document.currentScript?.getAttribute('data-shop') || window.Shopify?.shop
  };

  // Storage keys
  var STORAGE_KEY_CID = 'attr_customer_id';
  var STORAGE_KEY_SESSION = 'attr_session_id';
  var STORAGE_KEY_TOUCHES = 'attr_touchpoints';

  // Attribution Tracker
  window.AttributionTracker = {
    config: config,
    
    /**
     * Initialize the tracker
     */
    init: function() {
      this.customerId = this.getOrCreateCustomerId();
      this.sessionId = this.getOrCreateSessionId();
      this.touchpoints = this.getStoredTouchpoints();
      
      // Track initial pageview
      this.trackPageview();
      
      // Set up event listeners
      this.setupEventListeners();
      
      console.log('[Attribution] Tracker initialized for customer:', this.customerId);
    },

    /**
     * Get or create customer ID
     */
    getOrCreateCustomerId: function() {
      var cid = localStorage.getItem(STORAGE_KEY_CID);
      if (!cid) {
        cid = 'attr_' + this.generateId();
        localStorage.setItem(STORAGE_KEY_CID, cid);
      }
      return cid;
    },

    /**
     * Get or create session ID
     */
    getOrCreateSessionId: function() {
      var sid = sessionStorage.getItem(STORAGE_KEY_SESSION);
      if (!sid) {
        sid = 'sess_' + this.generateId();
        sessionStorage.setItem(STORAGE_KEY_SESSION, sid);
      }
      return sid;
    },

    /**
     * Generate unique ID
     */
    generateId: function() {
      return Math.random().toString(36).substring(2, 15) + 
             Math.random().toString(36).substring(2, 15) +
             Date.now().toString(36);
    },

    /**
     * Get stored touchpoints
     */
    getStoredTouchpoints: function() {
      var stored = sessionStorage.getItem(STORAGE_KEY_TOUCHES);
      return stored ? JSON.parse(stored) : [];
    },

    /**
     * Store touchpoint
     */
    storeTouchpoint: function(touchpoint) {
      this.touchpoints.push({
        ...touchpoint,
        timestamp: new Date().toISOString()
      });
      sessionStorage.setItem(STORAGE_KEY_TOUCHES, JSON.stringify(this.touchpoints));
    },

    /**
     * Parse UTM parameters from URL
     */
    getUTMParams: function() {
      var params = new URLSearchParams(window.location.search);
      var utm = {};
      
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function(key) {
        var val = params.get(key);
        if (val) utm[key] = val;
      });
      
      return utm;
    },

    /**
     * Determine channel from UTM/referrer
     */
    getChannel: function(utm) {
      var source = (utm.utm_source || '').toLowerCase();
      var medium = (utm.utm_medium || '').toLowerCase();
      var referrer = document.referrer || '';
      
      // Paid social
      if (['meta', 'facebook', 'instagram', 'fb'].includes(source)) return 'meta';
      if (source.includes('facebook')) return 'meta';
      
      // Google Ads
      if (source === 'google' && ['cpc', 'ppc', 'paid'].includes(medium)) return 'google_ads';
      
      // Organic search
      if (source === 'google' && medium === 'organic') return 'organic_search';
      if (referrer.includes('google.com') && !source) return 'organic_search';
      
      // TikTok
      if (['tiktok', 'tiktokads'].includes(source)) return 'tiktok';
      
      // Email
      if (['email', 'newsletter', 'mail'].includes(source) || medium === 'email') return 'email';
      
      // YouTube
      if (['youtube', 'yt'].includes(source)) return 'youtube';
      
      // Pinterest
      if (source === 'pinterest') return 'pinterest';
      
      // Twitter/X
      if (['twitter', 'x', 't.co'].includes(source)) return 'twitter';
      
      // Direct
      if (!source && (!referrer || referrer.includes(window.location.hostname))) return 'direct';
      
      // Referral
      if (referrer && !source) return 'referral';
      
      return source || 'direct';
    },

    /**
     * Track event
     */
    track: function(eventName, properties) {
      var utm = this.getUTMParams();
      var data = {
        shop: config.shop,
        customerId: this.customerId,
        sessionId: this.sessionId,
        event: eventName,
        url: window.location.href,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
        properties: Object.assign({}, properties || {}, utm, {
          userAgent: navigator.userAgent,
          screenResolution: screen.width + 'x' + screen.height,
          language: navigator.language
        })
      };

      // Store touchpoint if UTM present
      if (utm.utm_source) {
        this.storeTouchpoint({
          channel: this.getChannel(utm),
          source: utm.utm_source,
          medium: utm.utm_medium,
          campaign: utm.utm_campaign,
          url: window.location.href,
          referrer: document.referrer
        });
      }

      // Send to API
      this.send(data);
    },

    /**
     * Track pageview
     */
    trackPageview: function() {
      this.track('pageview', {
        title: document.title,
        path: window.location.pathname
      });
    },

    /**
     * Track add to cart
     */
    trackAddToCart: function(product) {
      this.track('add_to_cart', {
        productId: product.id,
        productName: product.name,
        price: product.price,
        currency: product.currency || 'USD'
      });
    },

    /**
     * Track checkout started
     */
    trackCheckout: function(cart) {
      this.track('checkout_started', {
        value: cart.total,
        itemCount: cart.items.length,
        currency: cart.currency || 'USD'
      });
    },

    /**
     * Track purchase
     */
    trackPurchase: function(order) {
      this.track('purchase', {
        orderId: order.id,
        value: order.total,
        currency: order.currency || 'USD',
        itemCount: order.items.length
      });
    },

    /**
     * Send data to API
     */
    send: function(data) {
      var url = config.apiUrl + '/api/tracking/event';
      
      // Use sendBeacon for better reliability on page unload
      if (navigator.sendBeacon) {
        var blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        navigator.sendBeacon(url, blob);
      } else {
        // Fallback to fetch
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          keepalive: true
        }).catch(function(err) {
          console.error('[Attribution] Tracking error:', err);
        });
      }
    },

    /**
     * Set up event listeners
     */
    setupEventListeners: function() {
      var self = this;

      // Listen for Shopify events if available
      if (window.Shopify && window.Shopify.analytics) {
        document.addEventListener('product:added', function(e) {
          self.trackAddToCart(e.detail);
        });
        
        document.addEventListener('checkout:started', function(e) {
          self.trackCheckout(e.detail);
        });
        
        document.addEventListener('order:confirmed', function(e) {
          self.trackPurchase(e.detail);
        });
      }

      // Track clicks on external links
      document.addEventListener('click', function(e) {
        var link = e.target.closest('a');
        if (link && link.hostname !== window.location.hostname) {
          self.track('external_click', {
            url: link.href,
            text: link.innerText
          });
        }
      });
    },

    /**
     * Get customer journey summary
     */
    getJourney: function() {
      return {
        customerId: this.customerId,
        sessionId: this.sessionId,
        touchpoints: this.touchpoints,
        touchpointCount: this.touchpoints.length
      };
    }
  };

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      window.AttributionTracker.init();
    });
  } else {
    window.AttributionTracker.init();
  }
})();
