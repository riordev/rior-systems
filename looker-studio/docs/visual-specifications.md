# Dashboard Visual Specifications

## Page 1: Executive Summary

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Rior Systems - Profit Intelligence Dashboard     [Date ▼]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  ┌─────┐ │
│  │   💰         │  │   📈         │  │   🎯     │  │  🚀 │ │
│  │  $47,293     │  │  $18,452     │  │  38.9%   │  │ 3.2 │ │
│  │  REVENUE     │  │  NET PROFIT  │  │  MARGIN  │  │ROAS │ │
│  │  ▲ +12.4%    │  │  ▲ +8.2%    │  │  ▲ +2.1% │  │+0.3 │ │
│  └──────────────┘  └──────────────┘  └──────────┘  └─────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │        REVENUE TREND (Last 90 Days)                 │   │
│  │                                                     │   │
│  │    ╭─╮                  ╭──╮                        │   │
│  │   ╭╯ ╰╮    ╭─╮        ╭╯  ╰──╮    ╭──╮            │   │
│  │ ─╯    ╰────╯ ╰────────╯      ╰────╯  ╰────         │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Component Details

**Header**
- Height: 60px
- Background: #0D1117
- Border-bottom: 1px solid #30363D
- Logo: Left aligned
- Date picker: Right aligned

**KPI Cards (4 columns)**
- Width: 23% each
- Height: 140px
- Background: #161B22
- Border: 1px solid #30363D
- Border-radius: 8px
- Padding: 24px

**KPI Card Content**
- Icon: 24px, top-left
- Value: 48px, bold, white (#E6EDF3)
- Label: 12px, uppercase, gray (#8B949E)
- Delta: 14px, with arrow indicator
  - Positive: #238636 (green)
  - Negative: #DA3633 (red)

**Trend Chart**
- Full width
- Height: 300px
- Background: #161B22
- Border-radius: 8px
- Line color: #58A6FF
- Grid lines: #30363D (subtle)

---

## Page 2: Product Performance

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│  PRODUCT PERFORMANCE                              [Date ▼]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────┐  ┌───────────────────────┐ │
│  │  PRODUCT PERFORMANCE TABLE  │  │  REVENUE BY PRODUCT   │ │
│  │                             │  │                       │ │
│  │  Product      Rev   Margin  │  │  ██████████████ Hoodie│ │
│  │  ─────────────────────────  │  │  ████████████   Tee   │ │
│  │  Hoodie      $24K   72%    │  │  ████████       Buds  │ │
│  │  T-Shirt     $18K   65%    │  │  ██████         Mat   │ │
│  │  Earbuds     $12K   68%    │  │  ████           Case  │ │
│  │  ...                        │  │                       │ │
│  │                             │  └───────────────────────┘ │
│  │                             │  ┌───────────────────────┐ │
│  │                             │  │   MARGIN TREND        │ │
│  │                             │  │    ╭╮╭╮  ╭──╮        │ │
│  │                             │  │   ╭╯╰╯╰──╯  ╰──      │ │
│  └─────────────────────────────┘  └───────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Component Details

**Left Panel: Data Table**
- Width: 55%
- Columns: Product, Revenue, COGS, Margin%, ROAS, Signal
- Signal badges:
  - 🟢 Scale: Green pill background
  - 🟡 Warning: Amber pill background
  - 🔴 Critical: Red pill background

**Right Panel: Charts**
- Top: Horizontal bar chart
- Bottom: Sparkline (mini line chart)
- Both: 40% width each

---

## Page 3: Marketing Performance

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│  MARKETING PERFORMANCE              [Date ▼] [Platform ▼]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  SPEND VS REVENUE (Last 30 Days)                    │   │
│  │                                                     │   │
│  │   $50K │    ╭──╮         ╭──╮                      │   │
│  │        │   ╭╯  ╰──╮     ╭╯  ╰──╮    Revenue        │   │
│  │   $25K │──╯       ╰─────╯       ╰──                │   │
│  │        │  ╭──╮  ╭──╮  ╭──╮                        │   │
│  │   $10K │─╯  ╰──╯  ╰──╯  ╰─────  Ad Spend          │   │
│  │        │                                            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────────────────┐  ┌─────────────────────────┐  │
│  │  ROAS BY CAMPAIGN        │  │  SPEND BY PLATFORM      │  │
│  │                          │  │                         │  │
│  │  ██████████████ Brand    │  │      ┌──────────┐       │  │
│  │  ████████████   Retarget │  │     ╱   Meta   ╲      │  │
│  │  █████████      Viral    │  │    │    45%    │      │  │
│  │  ██████         Shopping │  │     ╲  ████   ╱       │  │
│  │  ███            Test     │  │      └──┬──┬──┘        │  │
│  │                          │  │   Google│  │TikTok     │  │
│  │          0   2   4   6   │  │      35%   20%         │  │
│  └──────────────────────────┘  └─────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Component Details

**Dual-Axis Line Chart**
- Left axis (spend): #D29922 (amber)
- Right axis (revenue): #238636 (green)
- Legend: Top right
- Grid: Horizontal only

**ROAS Bar Chart**
- Horizontal bars
- Sorted descending
- Color by platform
- Target line at ROAS = 3.0

**Platform Pie Chart**
- Donut style (optional)
- Percentage labels
- Platform icons (optional)

---

## Page 4: Alerts & Signals

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│  ALERTS & SIGNALS            [Date ▼] [Signal Type ▼] [🔔]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │              🔔 5 Unacknowledged Alerts             │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  RECENT ALERTS                                      │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │                                                     │   │
│  │  🟢  Mar 1  Hoodie      SCALE   ROAS 4.2x ↑20%     │   │
│  │  🟢  Mar 1  Earbuds     SCALE   Trending up         │   │
│  │  🟡  Mar 1  T-Shirt     WARN    Margin compression  │   │
│  │  🟡  Feb 28 Cap         WARN    ROAS below 2x       │   │
│  │  🔴  Mar 1  Tote Bag    CRIT    Negative ROAS       │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [Acknowledge Selected]        [Export] [Refresh]          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Component Details

**Alert Count Scorecard**
- Large amber number
- Warning icon
- Updates dynamically

**Alerts Table**
- Severity column: Colored dot + text
- Product name: Clickable (link to product page)
- Signal type: Colored badge
- Message: Truncated with tooltip
- Actions: Acknowledge checkbox

**Row Colors**
- Scale (green): Background #23863633 (20% opacity)
- Warning (amber): Background #D2992233
- Critical (red): Background #DA363333

---

## Color Reference

### Background Colors
```
Page Background:      #0D1117
Card Background:      #161B22
Card Border:          #30363D
Hover State:          #1C2128
Selected State:       #21262D
```

### Text Colors
```
Primary Text:         #E6EDF3
Secondary Text:       #8B949E
Disabled Text:        #484F58
```

### Accent Colors
```
Primary (Blue):       #58A6FF
Success (Green):      #238636
Warning (Amber):      #D29922
Danger (Red):         #DA3633
Purple:               #A371F7
```

### Platform Colors
```
Meta Blue:            #1877F2
Google Blue:          #4285F4
TikTok Pink:          #FF0050
```

---

## Responsive Breakpoints

### Desktop (1200px+)
- 4-column KPI layout
- Side-by-side charts
- Full table with all columns

### Tablet (768px - 1199px)
- 2-column KPI layout
- Stacked charts
- Condensed table (hide ROAS column)

### Mobile (< 768px)
- 1-column KPI layout (scrollable)
- Single chart per row
- Minimal table (Product + Signal only)
- Hamburger menu for filters

---

## Typography Scale

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Page Title | 28px | 600 | #E6EDF3 |
| Section Title | 20px | 500 | #E6EDF3 |
| KPI Value | 48px | 700 | #E6EDF3 |
| KPI Label | 12px | 400 | #8B949E |
| Body Text | 14px | 400 | #E6EDF3 |
| Table Header | 12px | 600 | #8B949E |
| Chart Axis | 11px | 400 | #8B949E |
