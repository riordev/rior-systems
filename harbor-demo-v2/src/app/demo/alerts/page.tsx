"use client";

import { useState } from "react";
import { Check, X, Bell, TrendingUp, TrendingDown, AlertTriangle, Info, Filter } from "lucide-react";
import { harborData, formatCurrency, formatROAS } from "@/lib/data";

type AlertType = "all" | "scale" | "warning" | "info";

export default function AlertsPage() {
  const [filter, setFilter] = useState<AlertType>("all");
  const [alerts, setAlerts] = useState(harborData.alerts);

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "all") return true;
    return alert.type === filter;
  });

  const acknowledgeAlert = (id: string) => {
    setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, acknowledged: true } : alert)));
  };

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "scale":
        return (
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center scale-signal">
            <TrendingUp size={20} className="text-emerald-400" />
          </div>
        );
      case "warning":
        return (
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center warning-signal">
            <AlertTriangle size={20} className="text-amber-400" />
          </div>
        );
      case "info":
        return (
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Info size={20} className="text-blue-400" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Bell size={20} className="text-white/60" />
          </div>
        );
    }
  };

  const getAlertBorderColor = (type: string, acknowledged: boolean) => {
    if (acknowledged) return "border-white/5 opacity-60";
    switch (type) {
      case "scale":
        return "border-emerald-500/30";
      case "warning":
        return "border-amber-500/30";
      case "info":
        return "border-blue-500/30";
      default:
        return "border-white/10";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;
  const scaleCount = alerts.filter((a) => a.type === "scale" && !a.acknowledged).length;
  const warningCount = alerts.filter((a) => a.type === "warning" && !a.acknowledged).length;

  return (
    <div className="space-y-6 pt-20 lg:pt-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gradient">Alerts</h1>
          <p className="text-white/50 mt-1">
            {unacknowledgedCount > 0 ? (
              <span>
                You have <span className="text-amber-400 font-medium">{unacknowledgedCount} unacknowledged</span> alerts
              </span>
            ) : (
              "All caught up! No new alerts"
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-white/40" />
          <div className="flex glass-card p-1">
            {[
              { label: "All", value: "all", count: unacknowledgedCount },
              { label: "Scale", value: "scale", count: scaleCount },
              { label: "Warnings", value: "warning", count: warningCount },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value as AlertType)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all relative ${
                  filter === f.value ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
                }`}
              >
                {f.label}
                {f.count > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center">
                    {f.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alert Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400">{scaleCount}</div>
          <div className="text-xs text-white/50 mt-1">Scale Signals</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-amber-400">{warningCount}</div>
          <div className="text-xs text-white/50 mt-1">Warnings</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-white">{alerts.filter((a) => a.acknowledged).length}</div>
          <div className="text-xs text-white/50 mt-1">Acknowledged</div>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Bell size={32} className="text-white/30" />
            </div>
            <h3 className="text-lg font-medium text-white/60">No alerts</h3>
            <p className="text-sm text-white/40 mt-1">You're all caught up!</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`glass-card p-4 sm:p-5 transition-all duration-300 border ${getAlertBorderColor(
                alert.type,
                alert.acknowledged
              )} ${alert.acknowledged ? "opacity-60" : ""}`}
            >
              <div className="flex gap-4">
                {getAlertIcon(alert.type)}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className={`font-medium ${alert.acknowledged ? "text-white/60" : "text-white"}`}>
                        {alert.title}
                      </h4>
                      <p className="text-sm text-white/50 mt-1">{alert.message}</p>
                      
                      {alert.product && (
                        <div className="flex items-center gap-2 mt-3">
                          <span className="text-xs text-white/40">Product:</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                            {alert.product}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs text-white/40">{formatTimestamp(alert.timestamp)}</span>
                      
                      {!alert.acknowledged && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                            title="Acknowledge"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => dismissAlert(alert.id)}
                            className="p-2 rounded-lg bg-white/10 text-white/60 hover:bg-white/20 transition-colors"
                            title="Dismiss"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                      
                      {alert.acknowledged && (
                        <span className="text-xs text-emerald-400 flex items-center gap-1">
                          <Check size={12} />
                          Acknowledged
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More */}
      {filteredAlerts.length > 0 && (
        <div className="text-center">
          <button className="glass-button px-6 py-2 text-sm text-white/60 hover:text-white">
            Load more alerts
          </button>
        </div>
      )}
    </div>
  );
}