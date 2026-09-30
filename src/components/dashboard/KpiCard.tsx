import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  badge?: string;
  trend?: {
    value: string;
    isPositive: boolean;
    label: string;
  };
  icon: LucideIcon;
  variant?: 'default' | 'profit' | 'warning' | 'alert';
  helpText?: string;
}

export function KpiCard({
  title,
  value,
  subtitle,
  badge,
  trend,
  icon: Icon,
  variant = 'default',
  helpText,
}: KpiCardProps) {
  const variantStyles = {
    default: {
      border: 'border-zinc-800/80 hover:border-zinc-700',
      iconBg: 'bg-zinc-800/60 text-zinc-300',
      glow: '',
      valueColor: 'text-zinc-100',
      badgeBg: 'bg-zinc-800 text-zinc-400 border-zinc-700',
    },
    profit: {
      border: 'border-emerald-500/30 hover:border-emerald-500/50 bg-gradient-to-b from-emerald-950/20 to-zinc-950',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      glow: 'shadow-lg shadow-emerald-500/5',
      valueColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    },
    warning: {
      border: 'border-amber-500/30 hover:border-amber-500/50 bg-gradient-to-b from-amber-950/20 to-zinc-950',
      iconBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      glow: 'shadow-lg shadow-amber-500/5',
      valueColor: 'text-amber-400',
      badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    },
    alert: {
      border: 'border-red-500/30 hover:border-red-500/50 bg-gradient-to-b from-red-950/20 to-zinc-950',
      iconBg: 'bg-red-500/10 text-red-400 border border-red-500/20',
      glow: 'shadow-lg shadow-red-500/5',
      valueColor: 'text-red-400',
      badgeBg: 'bg-red-500/15 text-red-300 border-red-500/30',
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-zinc-900/60 p-5 backdrop-blur-md transition-all duration-200 ${style.border} ${style.glow}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              {title}
            </span>
            {helpText && (
              <span title={helpText} className="cursor-help text-zinc-500 hover:text-zinc-300">
                <HelpCircle className="h-3.5 w-3.5" />
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl lg:text-3xl font-black tracking-tight ${style.valueColor}`}>
              {value}
            </span>
            {badge && (
              <span className={`rounded-md border px-1.5 py-0.5 text-[10px] font-bold ${style.badgeBg}`}>
                {badge}
              </span>
            )}
          </div>
        </div>

        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${style.iconBg}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-4 flex items-center justify-between border-t border-zinc-800/60 pt-3 text-xs">
          {subtitle && <span className="text-zinc-400 text-[11px]">{subtitle}</span>}
          {trend && (
            <div
              className={`flex items-center gap-1 font-semibold text-[11px] ${
                trend.isPositive ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{trend.value}</span>
              <span className="text-zinc-400 font-normal">({trend.label})</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
