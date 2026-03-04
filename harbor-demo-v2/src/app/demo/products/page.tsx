"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ArrowUpDown, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { harborData, formatCurrency, formatNumber, formatPercent, formatROAS, getSignalColor } from "@/lib/data";

type SortKey = "name" | "revenue" | "roas" | "margin" | "profit" | "breakEvenROAS";
type SortDirection = "asc" | "desc";

export default function ProductsPage() {
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("revenue");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const products = [...harborData.products].sort((a, b) => {
    let aValue: number | string;
    let bValue: number | string;

    switch (sortKey) {
      case "name":
        aValue = a.name;
        bValue = b.name;
        break;
      case "revenue":
        aValue = a.revenue;
        bValue = b.revenue;
        break;
      case "roas":
        aValue = a.roas;
        bValue = b.roas;
        break;
      case "margin":
        aValue = a.margin;
        bValue = b.margin;
        break;
      case "profit":
        aValue = a.profit;
        bValue = b.profit;
        break;
      case "breakEvenROAS":
        aValue = a.breakEvenROAS;
        bValue = b.breakEvenROAS;
        break;
      default:
        aValue = a.revenue;
        bValue = b.revenue;
    }

    if (typeof aValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue as string)
        : (bValue as string).localeCompare(aValue);
    }

    return sortDirection === "asc" ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  };

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) return <ArrowUpDown size={14} className="text-white/30" />;
    return sortDirection === "asc" ? (
      <ChevronUp size={14} className="text-white" />
    ) : (
      <ChevronDown size={14} className="text-white" />
    );
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp size={16} className="text-emerald-400" />;
      case "down":
        return <TrendingDown size={16} className="text-red-400" />;
      default:
        return <Minus size={16} className="text-white/40" />;
    }
  };

  const getSignalBadge = (signal: string) => {
    switch (signal) {
      case "scale":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Scale
          </span>
        );
      case "watch":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Watch
          </span>
        );
      case "pause":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
            Pause
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pt-20 lg:pt-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gradient">Products</h1>
        <p className="text-white/50 mt-1">Deep dive into product performance</p>
      </div>

      {/* Product Summary Cards - Mobile */}
      <div className="lg:hidden space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className={`glass-card overflow-hidden transition-all duration-300 ${
              expandedProduct === product.id ? "ring-1 ring-white/20" : ""
            }`}
          >
            <button
              onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
              className="w-full p-4 flex items-center gap-4"
            >
              <div className="text-3xl">{product.image}</div>
              <div className="flex-1 text-left">
                <div className="font-semibold">{product.name}</div>
                <div className="text-sm text-white/50">{product.sku}</div>
              </div>
              <div className="flex items-center gap-2">
                {getSignalBadge(product.signal)}
                {expandedProduct === product.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </button>

            {expandedProduct === product.id && (
              <div className="px-4 pb-4 space-y-4 border-t border-white/10 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-white/40 mb-1">Revenue</div>
                    <div className="font-semibold">{formatCurrency(product.revenue)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/40 mb-1">Net Profit</div>
                    <div className="font-semibold text-emerald-400">{formatCurrency(product.profit)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/40 mb-1">ROAS</div>
                    <div className="font-semibold">{formatROAS(product.roas)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/40 mb-1">Break-Even</div>
                    <div className="font-semibold">{formatROAS(product.breakEvenROAS)}</div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <div className="text-xs text-white/40 mb-3">Unit Economics</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Retail Price</span>
                      <span>{formatCurrency(product.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">COGS</span>
                      <span className="text-white/40">-{formatCurrency(product.cogs)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Shipping</span>
                      <span className="text-white/40">-{formatCurrency(product.shipping)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-white/10">
                      <span className="text-white/60">Margin</span>
                      <span className="text-emerald-400">{formatPercent(product.margin)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="text-xs text-white/40 mb-3">Performance</div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(product.trend)}
                    <span className="text-sm text-white/60">
                      {product.trend === "up" ? "Trending up" : product.trend === "down" ? "Trending down" : "Stable"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Product Table - Desktop */}
      <div className="hidden lg:block glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-2 text-xs font-medium text-white/60 uppercase tracking-wider hover:text-white transition-colors"
                  >
                    Product
                    {getSortIcon("name")}
                  </button>
                </th>
                <th className="text-right p-4">
                  <button
                    onClick={() => handleSort("revenue")}
                    className="flex items-center gap-2 text-xs font-medium text-white/60 uppercase tracking-wider hover:text-white transition-colors ml-auto"
                  >
                    Revenue
                    {getSortIcon("revenue")}
                  </button>
                </th>
                <th className="text-right p-4">
                  <button
                    onClick={() => handleSort("roas")}
                    className="flex items-center gap-2 text-xs font-medium text-white/60 uppercase tracking-wider hover:text-white transition-colors ml-auto"
                  >
                    ROAS
                    {getSortIcon("roas")}
                  </button>
                </th>
                <th className="text-right p-4">
                  <button
                    onClick={() => handleSort("breakEvenROAS")}
                    className="flex items-center gap-2 text-xs font-medium text-white/60 uppercase tracking-wider hover:text-white transition-colors ml-auto"
                  >
                    Break-Even
                    {getSortIcon("breakEvenROAS")}
                  </button>
                </th>
                <th className="text-right p-4">
                  <button
                    onClick={() => handleSort("margin")}
                    className="flex items-center gap-2 text-xs font-medium text-white/60 uppercase tracking-wider hover:text-white transition-colors ml-auto"
                  >
                    Margin
                    {getSortIcon("margin")}
                  </button>
                </th>
                <th className="text-right p-4">
                  <button
                    onClick={() => handleSort("profit")}
                    className="flex items-center gap-2 text-xs font-medium text-white/60 uppercase tracking-wider hover:text-white transition-colors ml-auto"
                  >
                    Net Profit
                    {getSortIcon("profit")}
                  </button>
                </th>
                <th className="text-center p-4">
                  <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Signal</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <>
                  <tr
                    key={product.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{product.image}</div>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-white/40">{product.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="font-medium">{formatCurrency(product.revenue)}</div>
                      <div className="text-sm text-white/40">{formatNumber(product.units)} units</div>
                    </td>
                    <td className="p-4 text-right">
                      <div className={`font-medium ${getSignalColor(product.roas >= product.breakEvenROAS ? "scale" : "watch")}`}>
                        {formatROAS(product.roas)}
                      </div>
                      <div className="text-sm text-white/40">Target: {formatROAS(harborData.summary.blendedROAS)}</div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="font-medium">{formatROAS(product.breakEvenROAS)}</div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="font-medium">{formatPercent(product.margin)}</div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="font-medium text-emerald-400">{formatCurrency(product.profit)}</div>
                      <div className="text-sm text-white/40">{formatPercent((product.profit / product.revenue) * 100)} of revenue</div>
                    </td>
                    <td className="p-4 text-center">
                      {getSignalBadge(product.signal)}
                    </td>
                  </tr>
                  {expandedProduct === product.id && (
                    <tr>
                      <td colSpan={7} className="p-0">
                        <div className="p-6 bg-white/5 border-b border-white/10">
                          <div className="grid grid-cols-3 gap-8">
                            {/* Unit Economics */}
                            <div>
                              <h4 className="text-sm font-medium text-white/60 mb-4">Unit Economics</h4>
                              <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                  <span className="text-white/60">Retail Price</span>
                                  <span>{formatCurrency(product.price)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-white/60">COGS</span>
                                  <span className="text-white/40">-{formatCurrency(product.cogs)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-white/60">Shipping</span>
                                  <span className="text-white/40">-{formatCurrency(product.shipping)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-white/60">Payment Fees (3%)</span>
                                  <span className="text-white/40">-{formatCurrency(product.price * 0.03)}</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-white/10">
                                  <span className="font-medium">Contribution Margin</span>
                                  <span className="text-emerald-400 font-medium">
                                    {formatCurrency(product.price - product.cogs - product.shipping - product.price * 0.03)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Ad Performance */}
                            <div>
                              <h4 className="text-sm font-medium text-white/60 mb-4">Ad Performance</h4>
                              <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                  <span className="text-white/60">Ad Spend</span>
                                  <span>{formatCurrency(product.adSpend)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-white/60">Revenue</span>
                                  <span>{formatCurrency(product.revenue)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-white/60">ROAS</span>
                                  <span className={product.roas >= product.breakEvenROAS ? "text-emerald-400" : "text-amber-400"}>
                                    {formatROAS(product.roas)}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-white/60">Break-Even ROAS</span>
                                  <span>{formatROAS(product.breakEvenROAS)}</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-white/10">
                                  <span className="font-medium">Status</span>
                                  <span className={product.roas >= product.breakEvenROAS ? "text-emerald-400" : "text-amber-400"}>
                                    {product.roas >= product.breakEvenROAS ? "Profitable" : "Below Break-Even"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Recommendations */}
                            <div>
                              <h4 className="text-sm font-medium text-white/60 mb-4">Recommendation</h4>
                              {product.signal === "scale" ? (
                                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg">🚀</span>
                                    <span className="font-medium text-emerald-400">Scale This Product</span>
                                  </div>
                                  <p className="text-sm text-white/60">
                                    ROAS of {formatROAS(product.roas)} exceeds break-even by {(product.roas - product.breakEvenROAS).toFixed(2)}x. 
                                    Increase ad spend by 20-30% to capture more demand.
                                  </p>
                                </div>
                              ) : product.signal === "watch" ? (
                                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg">👀</span>
                                    <span className="font-medium text-amber-400">Monitor Closely</span>
                                  </div>
                                  <p className="text-sm text-white/60">
                                    ROAS is near break-even. Review creative performance and audience targeting 
                                    before scaling further.
                                  </p>
                                </div>
                              ) : (
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg">⚠️</span>
                                    <span className="font-medium text-red-400">Pause & Review</span>
                                  </div>
                                  <p className="text-sm text-white/60">
                                    ROAS is below break-even. Consider pausing campaigns and reviewing 
                                    pricing or cost structure.
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}