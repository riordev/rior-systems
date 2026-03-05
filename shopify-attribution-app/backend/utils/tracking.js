/**
 * Tracking utility functions
 */

/**
 * Parse user agent string for device and browser info
 */
function parseUserAgent(userAgent) {
  if (!userAgent) {
    return { device: 'unknown', browser: 'unknown' };
  }

  const ua = userAgent.toLowerCase();
  
  // Device type
  let device = 'desktop';
  if (/mobile|android|iphone|ipad|ipod/.test(ua)) {
    device = /ipad/.test(ua) ? 'tablet' : 'mobile';
  }
  
  // Browser
  let browser = 'other';
  if (/chrome/.test(ua) && !/edg/.test(ua)) {
    browser = 'chrome';
  } else if (/safari/.test(ua) && !/chrome/.test(ua)) {
    browser = 'safari';
  } else if (/firefox/.test(ua)) {
    browser = 'firefox';
  } else if (/edg/.test(ua)) {
    browser = 'edge';
  } else if (/opera|opr/.test(ua)) {
    browser = 'opera';
  }
  
  return { device, browser };
}

/**
 * Parse referrer for source info
 */
function parseReferrer(referrer) {
  if (!referrer) return null;
  
  try {
    const url = new URL(referrer);
    const hostname = url.hostname.toLowerCase();
    
    // Known sources
    const sources = {
      'google': ['google.com', 'www.google.com'],
      'facebook': ['facebook.com', 'www.facebook.com', 'fb.com'],
      'instagram': ['instagram.com', 'www.instagram.com'],
      'twitter': ['twitter.com', 'x.com', 't.co'],
      'linkedin': ['linkedin.com', 'www.linkedin.com'],
      'pinterest': ['pinterest.com', 'www.pinterest.com'],
      'youtube': ['youtube.com', 'www.youtube.com', 'youtu.be'],
      'tiktok': ['tiktok.com', 'www.tiktok.com'],
      'bing': ['bing.com', 'www.bing.com']
    };
    
    for (const [source, domains] of Object.entries(sources)) {
      if (domains.some(d => hostname.includes(d))) {
        return source;
      }
    }
    
    return hostname;
  } catch (e) {
    return null;
  }
}

/**
 * Generate session ID
 */
function generateSessionId() {
  return 'sess_' + Math.random().toString(36).substring(2) + Date.now();
}

/**
 * Extract domain from email
 */
function extractEmailDomain(email) {
  if (!email || !email.includes('@')) return null;
  return email.split('@')[1].toLowerCase();
}

module.exports = {
  parseUserAgent,
  parseReferrer,
  generateSessionId,
  extractEmailDomain
};
