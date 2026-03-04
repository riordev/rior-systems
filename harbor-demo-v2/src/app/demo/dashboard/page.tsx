"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine,
  Cell,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  Target,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from "lucide-react";
import {
  harborData,
  formatCurrency,
  formatNumber,
  formatPercent,
  formatROAS,
} from "@/lib/data";

const dateRanges = [
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "90 Days", value: "90d" },
];

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState("90d");

  // Calculate metrics
  const revenue = harborData.summary.revenue;
  const netProfit = harborData.summary.netProfit;
  const profitMargin = harborData.summary.profitMargin;
  const blendedROAS = harborData.summary.blendedROAS;
  const breakEvenROAS = harborData.summary.breakEvenROAS;
  const orders = harborData.summary.orders;
  const aov = harborData.summary.aov;

  // Prepare chart data
  const revenueChartData = harborData.revenueOverTime.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    revenue: item.revenue,
    profit: item.profit,
    roas: item.revenue / item.adSpend,
  }));

  const roasChartData = harborData.campaignROAS.map((item) => ({
    name: item.name,
    roas: item.roas,
    target: item.target,
    status: item.roas >= item.target ? "above" : "below",
  }));

  const productChartData = harborData.products.map((item) => ({
    name: item.name,
    roas: item.roas,
    profit: item.profit,
    signal: item.signal,
  }));

  return (
    <div className="space-y-6 pt-20 lg:pt-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gradient">Dashboard</h1>
          <p className="text-white/50 mt-1">Real-time profit intelligence</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-white/40" />
          <div className="flex glass-card p-1">
            {dateRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setDateRange(range.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  dateRange === range.value
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue Card */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <DollarSign size={20} className="text-blue-400" />
            </div>
            <span className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
              <ArrowUpRight size={14} />
              12.5%
            </span>
          </div>
          <div className="text-2xl font-bold">{formatCurrency(revenue)}</div>
          <div className="text-sm text-white/50 mt-1">Total Revenue</div>
        </div>

        {/* Net Profit Card */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <TrendingUp size={20} className="text-emerald-400" />
            </div>
            <span className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
              <ArrowUpRight size={14} />
              8.3%
            </span>
          </div>
          <div className="text-2xl font-bold">{formatCurrency(netProfit)}</div>
          <div className="text-sm text-white/50 mt-1">Net Profit</div>
          <div className="text-xs text-emerald-400 mt-2">{formatPercent(profitMargin)} margin</div>
        </div>

        {/* ROAS Card */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Target size={20} className="text-purple-400" />
            </div>
            <span className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
              <ArrowUpRight size={14} />
              5.2%
            </span>
          </div>
          <div className="text-2xl font-bold">{formatROAS(blendedROAS)}</div>
          <div className="text-sm text-white/50 mt-1">Blended ROAS</div>
          <div className="text-xs text-emerald-400 mt-2">
            Break-even: {formatROAS(breakEvenROAS)}
          </div>
        </div>

        {/* Orders Card */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-amber-500/20">
              <ShoppingCart size={20} className="text-amber-400" />
            </div>
            <span className="flex items-center gap-1 text-white/40 text-sm font-medium">
              <ArrowDownRight size={14} />
              2.1%
            </span>
          </div>
          <div className="text-2xl font-bold">{formatNumber(orders)}</div>
          <div className="text-sm text-white/50 mt-1">Total Orders</div>
          <div className="text-xs text-white/40 mt-2">AOV: {formatCurrency(aov)}</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Over Time */}
        <div className="glass-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Revenue & Profit Over Time</h3>
              <p className="text-sm text-white/50">Daily performance tracking</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-white/60">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-white/60">Profit</span>
              </div>
            </div>
          </div>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="date"
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(10, 10, 10, 0.9)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "rgba(255, 255, 255, 0.6)" }}
                  formatter={(value: number) => [formatCurrency(value), ""]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#profitGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ROAS by Campaign */}
        <div className="glass-card p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">ROAS by Campaign</h3>
            <p className="text-sm text-white/50">Performance vs target</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roasChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(10, 10, 10, 0.9)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`${value.toFixed(2)}x ROAS`, ""]}
                />
                <ReferenceLine x={breakEvenROAS} stroke="#f59e0b" strokeDasharray="3 3" />
                <Bar dataKey="roas" radius={[0, 4, 4, 0]} barSize={24}>
                  {roasChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.status === "above" ? "#10b981" : "#f59e0b"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-500"></div>
              <span className="text-white/60">Above Target</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-amber-500"></div>
              <span className="text-white/60">Below Target</span>
            </div>
          </div>
        </div>

        {/* Product Performance */}
        <div className="glass-card p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Product Performance</h3>
            <p className="text-sm text-white/50">ROAS by product</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(10, 10, 10, 0.9)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number, name: string, props: any) => [
                    `${value.toFixed(2)}x ROAS`,
                    props.payload.name,
                  ]}
                />
                <ReferenceLine x={breakEvenROAS} stroke="#f59e0b" strokeDasharray="3 3" />
                <Bar dataKey="roas" radius={[0, 4, 4, 0]} barSize={32}>
                  {productChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.signal === "scale" ? "#10b981" : "#f59e0b"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-500"></div>
              <span className="text-white/60">Scale Signal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-amber-500"></div>
              <span className="text-white/60">Watch</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}