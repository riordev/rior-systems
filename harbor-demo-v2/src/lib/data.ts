// Sample data for Harbor Goods Co. demo

export const harborData = {
  brand: {
    name: "Harbor Goods Co.",
    tagline: "Heritage-inspired goods for modern life",
  },
  
  // 90-day summary metrics
  summary: {
    revenue: 237876,
    netProfit: 56685,
    profitMargin: 23.8,
    blendedROAS: 3.10,
    breakEvenROAS: 1.92,
    adSpend: 76734,
    orders: 3247,
    aov: 73.26,
  },
  
  // Time series data for charts
  revenueOverTime: [
    { date: "2024-01-01", revenue: 2100, adSpend: 680, profit: 420 },
    { date: "2024-01-02", revenue: 2350, adSpend: 720, profit: 495 },
    { date: "2024-01-03", revenue: 1890, adSpend: 650, profit: 310 },
    { date: "2024-01-04", revenue: 2600, adSpend: 780, profit: 580 },
    { date: "2024-01-05", revenue: 3200, adSpend: 850, profit: 780 },
    { date: "2024-01-06", revenue: 4100, adSpend: 920, profit: 1150 },
    { date: "2024-01-07", revenue: 3800, adSpend: 890, profit: 1020 },
    { date: "2024-01-08", revenue: 2400, adSpend: 700, profit: 510 },
    { date: "2024-01-09", revenue: 2650, adSpend: 730, profit: 590 },
    { date: "2024-01-10", revenue: 2900, adSpend: 760, profit: 670 },
    { date: "2024-01-11", revenue: 2750, adSpend: 740, profit: 620 },
    { date: "2024-01-12", revenue: 3400, adSpend: 820, profit: 870 },
    { date: "2024-01-13", revenue: 4200, adSpend: 950, profit: 1190 },
    { date: "2024-01-14", revenue: 3900, adSpend: 910, profit: 1080 },
    { date: "2024-01-15", revenue: 2200, adSpend: 690, profit: 440 },
    { date: "2024-01-16", revenue: 2450, adSpend: 710, profit: 520 },
    { date: "2024-01-17", revenue: 2700, adSpend: 750, profit: 600 },
    { date: "2024-01-18", revenue: 3100, adSpend: 800, profit: 750 },
    { date: "2024-01-19", revenue: 3600, adSpend: 860, profit: 920 },
    { date: "2024-01-20", revenue: 4500, adSpend: 980, profit: 1320 },
    { date: "2024-01-21", revenue: 4100, adSpend: 940, profit: 1180 },
    { date: "2024-01-22", revenue: 2300, adSpend: 700, profit: 480 },
    { date: "2024-01-23", revenue: 2550, adSpend: 720, profit: 560 },
    { date: "2024-01-24", revenue: 2800, adSpend: 760, profit: 640 },
    { date: "2024-01-25", revenue: 3300, adSpend: 810, profit: 820 },
    { date: "2024-01-26", revenue: 3800, adSpend: 880, profit: 1000 },
    { date: "2024-01-27", revenue: 4700, adSpend: 1000, profit: 1410 },
    { date: "2024-01-28", revenue: 4300, adSpend: 960, profit: 1270 },
    { date: "2024-01-29", revenue: 2600, adSpend: 770, profit: 600 },
    { date: "2024-01-30", revenue: 2850, adSpend: 790, profit: 680 },
  ],
  
  // Campaign ROAS comparison
  campaignROAS: [
    { name: "Meta Prospecting", roas: 2.8, target: 3.0, spend: 28500 },
    { name: "Meta Retargeting", roas: 4.5, target: 4.0, spend: 12200 },
    { name: "Google Brand", roas: 8.2, target: 8.0, spend: 6900 },
    { name: "Google Non-Brand", roas: 2.3, target: 2.5, spend: 9200 },
    { name: "Google Shopping", roas: 3.4, target: 3.0, spend: 6900 },
    { name: "TikTok", roas: 1.9, target: 2.0, spend: 6500 },
  ],
  
  // Product performance data
  products: [
    {
      id: "sailor-tee",
      name: "Sailor Tee",
      sku: "HG-TSHIRT-001",
      category: "Apparel",
      price: 48,
      cogs: 16.80,
      shipping: 4.50,
      margin: 56.9,
      revenue: 89456,
      units: 1864,
      roas: 3.4,
      breakEvenROAS: 1.75,
      adSpend: 26311,
      profit: 25420,
      signal: "scale",
      trend: "up",
      image: "👕",
    },
    {
      id: "dock-shorts",
      name: "Dock Shorts",
      sku: "HG-SHORTS-001",
      category: "Apparel",
      price: 68,
      cogs: 23.80,
      shipping: 5.00,
      margin: 57.6,
      revenue: 95680,
      units: 1407,
      roas: 2.9,
      breakEvenROAS: 1.72,
      adSpend: 32993,
      profit: 26842,
      signal: "scale",
      trend: "up",
      image: "🩳",
    },
    {
      id: "anchor-hat",
      name: "Anchor Hat",
      sku: "HG-CAP-001",
      category: "Accessories",
      price: 38,
      cogs: 13.30,
      shipping: 3.50,
      margin: 55.8,
      revenue: 52740,
      units: 1388,
      roas: 2.7,
      breakEvenROAS: 1.79,
      adSpend: 19533,
      profit: 13602,
      signal: "watch",
      trend: "stable",
      image: "🧢",
    },
  ],
  
  // Real-time alerts
  alerts: [
    {
      id: "alert-1",
      type: "scale",
      title: "Scale Signal: Sailor Tee",
      message: "ROAS at 3.4x (target: 3.0x). Increase budget by 20%",
      timestamp: "2024-01-30T14:23:00Z",
      acknowledged: false,
      product: "Sailor Tee",
    },
    {
      id: "alert-2",
      type: "warning",
      title: "Underperformance: TikTok Campaign",
      message: "ROAS dropped to 1.9x (target: 2.0x). Review audience targeting",
      timestamp: "2024-01-30T12:15:00Z",
      acknowledged: false,
      product: null,
    },
    {
      id: "alert-3",
      type: "scale",
      title: "Scale Signal: Dock Shorts",
      message: "ROAS at 2.9x (target: 2.5x). Strong performance on retargeting",
      timestamp: "2024-01-30T10:45:00Z",
      acknowledged: true,
      product: "Dock Shorts",
    },
    {
      id: "alert-4",
      type: "info",
      title: "Daily Profit Target Met",
      message: "Today's net profit of $1,890 exceeds daily target of $1,500",
      timestamp: "2024-01-30T08:00:00Z",
      acknowledged: true,
      product: null,
    },
    {
      id: "alert-5",
      type: "warning",
      title: "Low Stock Alert: Anchor Hat",
      message: "Inventory below 200 units. Reorder recommended within 7 days",
      timestamp: "2024-01-29T16:30:00Z",
      acknowledged: false,
      product: "Anchor Hat",
    },
    {
      id: "alert-6",
      type: "scale",
      title: "Scale Signal: Google Brand",
      message: "ROAS at 8.2x (target: 8.0x). Consider increasing daily budget",
      timestamp: "2024-01-29T11:20:00Z",
      acknowledged: true,
      product: null,
    },
  ],
};

// Helper functions
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatROAS(value: number): string {
  return `${value.toFixed(2)}x`;
}

export function getSignalColor(signal: string): string {
  switch (signal) {
    case "scale":
      return "text-emerald-400";
    case "watch":
      return "text-amber-400";
    case "pause":
      return "text-red-400";
    default:
      return "text-white/60";
  }
}

export function getTrendIcon(trend: string): string {
  switch (trend) {
    case "up":
      return "↗️";
    case "down":
      return "↘️";
    default:
      return "➡️";
  }
}