import React from 'react';
import { Calendar } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import Skeleton from '@/components/ui/Skeleton';
import { formatCurrency } from '@/lib/utils';

function CustomRevenueTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface border border-neutralBorder rounded-xl p-3 shadow-warm-md text-xs space-y-1">
        <p className="font-bold text-charcoal">{label}</p>
        <p className="text-terracotta-600 font-semibold">
          Revenue: {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
}

export default function DashboardChartsRow({
  isLoadingRevenue,
  chartDays,
  revenueData,
  isLoadingOrders,
  statusDistribution,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Chart: 7-Day Revenue Trends */}
      <div className="lg:col-span-8 bg-surface border border-neutralBorder rounded-3xl p-6 shadow-warm-xs space-y-4">
        <div className="flex items-center justify-between border-b border-neutralBorder-light pb-3">
          <div>
            <h2 className="font-display text-base font-bold text-charcoal">
              Daily Revenue Trend
            </h2>
            <p className="text-xs text-charcoal-secondary">
              Delivered revenue from {revenueData?.from || 'past week'} to {revenueData?.to || 'today'}
            </p>
          </div>
          <span className="text-xs font-semibold text-terracotta-600 bg-terracotta-50 px-2.5 py-1 rounded-full border border-terracotta-200">
            Live Aggregation
          </span>
        </div>

        {isLoadingRevenue ? (
          <div className="h-64 flex items-center justify-center">
            <Skeleton className="h-full w-full rounded-2xl" />
          </div>
        ) : chartDays.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-2 text-charcoal-muted">
            <Calendar className="w-8 h-8 stroke-[1.5]" />
            <p className="text-xs">No delivered orders recorded in this date range.</p>
          </div>
        ) : (
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartDays} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C85A32" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#C85A32" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E7E2D9" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="formattedDate"
                  tick={{ fill: '#78716C', fontSize: 11 }}
                  axisLine={{ stroke: '#E7E2D9' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#78716C', fontSize: 11 }}
                  axisLine={{ stroke: '#E7E2D9' }}
                  tickLine={false}
                  tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                />
                <Tooltip content={<CustomRevenueTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#C85A32"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Right Chart: Order Status Distribution */}
      <div className="lg:col-span-4 bg-surface border border-neutralBorder rounded-3xl p-6 shadow-warm-xs space-y-4">
        <div className="border-b border-neutralBorder-light pb-3">
          <h2 className="font-display text-base font-bold text-charcoal">
            Order Pipeline Breakdown
          </h2>
          <p className="text-xs text-charcoal-secondary">
            State distribution across active orders
          </p>
        </div>

        {isLoadingOrders ? (
          <div className="h-64 flex items-center justify-center">
            <Skeleton className="h-48 w-48 rounded-full" />
          </div>
        ) : (
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [`${val} orders`, name]}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E7E2D9',
                    fontSize: '11px',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

