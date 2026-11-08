import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { LineChart, BarChart3, Receipt } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui';

export default function RevenueChart({
  chartData = [],
  fromDate,
  toDate,
  peakDay,
  maxRevenue,
  isLoading = false,
  isError = false,
}) {
  const [chartType, setChartType] = useState('area');

  return (
    <div className="bg-surface border border-neutralBorder rounded-3xl p-6 shadow-warm-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutralBorder-light pb-4">
        <div>
          <h2 className="font-display text-base font-bold text-charcoal">
            Revenue Trajectory & Sales Volume
          </h2>
          <p className="text-xs text-charcoal-secondary">
            Delivered sales aggregation from backend pipeline ({fromDate} to {toDate})
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Peak Day Chip */}
          {peakDay && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-terracotta-50 text-terracotta-700 border border-terracotta-200">
              Peak: {peakDay.date} ({formatCurrency(maxRevenue)})
            </span>
          )}

          {/* Area vs Bar Toggle */}
          <div className="flex items-center bg-surface-subtle p-0.5 border border-neutralBorder rounded-lg">
            <button
              type="button"
              onClick={() => setChartType('area')}
              className={cn(
                'p-1.5 rounded-md text-xs transition-colors',
                chartType === 'area'
                  ? 'bg-surface text-charcoal font-bold shadow-warm-xs'
                  : 'text-charcoal-muted hover:text-charcoal'
              )}
              title="Smooth Area Chart"
            >
              <LineChart size={14} />
            </button>
            <button
              type="button"
              onClick={() => setChartType('bar')}
              className={cn(
                'p-1.5 rounded-md text-xs transition-colors',
                chartType === 'bar'
                  ? 'bg-surface text-charcoal font-bold shadow-warm-xs'
                  : 'text-charcoal-muted hover:text-charcoal'
              )}
              title="Bar Columns Chart"
            >
              <BarChart3 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Chart Display */}
      {isLoading ? (
        <Skeleton className="h-72 w-full rounded-2xl" />
      ) : isError ? (
        <div className="p-8 text-center text-xs text-charcoal-muted">
          Unable to generate revenue graph for this date range.
        </div>
      ) : chartData.length === 0 ? (
        <div className="h-72 flex flex-col items-center justify-center text-center p-6 text-charcoal-muted text-xs space-y-2">
          <Receipt size={32} className="stroke-1" />
          <p className="font-semibold text-charcoal">No delivered sales in this timeframe</p>
          <p>Try expanding your date range to 30 or 90 days.</p>
        </div>
      ) : (
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="ownerRevGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C85A32" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#FAF8F5" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E4DDD2" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: '#636059', fontSize: 11 }} />
                <YAxis
                  tick={{ fill: '#636059', fontSize: 11 }}
                  tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                />
                <Tooltip
                  formatter={(val) => [formatCurrency(val), 'Delivered Revenue']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E4DDD2',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#C85A32"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#ownerRevGradient)"
                />
              </AreaChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#E4DDD2" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: '#636059', fontSize: 11 }} />
                <YAxis
                  tick={{ fill: '#636059', fontSize: 11 }}
                  tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                />
                <Tooltip
                  formatter={(val) => [formatCurrency(val), 'Daily Revenue']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E4DDD2',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  }}
                />
                <Bar dataKey="revenue" fill="#C85A32" radius={[6, 6, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

