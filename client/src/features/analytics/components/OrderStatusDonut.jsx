import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Skeleton } from '@/components/ui';

export default function OrderStatusDonut({
  pieData = [],
  counts = { delivered: 0, preparing: 0, placed: 0, cancelled: 0 },
  total = 0,
  isLoading = false,
}) {
  return (
    <div className="bg-surface border border-neutralBorder rounded-3xl p-6 shadow-warm-xs flex flex-col justify-between space-y-4">
      <div className="border-b border-neutralBorder-light pb-3">
        <h2 className="font-display text-base font-bold text-charcoal">
          Order Fulfillment Breakdown
        </h2>
        <p className="text-xs text-charcoal-secondary">
          Pipeline distribution from kitchen queue
        </p>
      </div>

      {isLoading ? (
        <Skeleton className="h-48 w-full rounded-2xl" />
      ) : total === 0 ? (
        <div className="h-48 flex items-center justify-center text-xs text-charcoal-muted">
          No orders logged for this restaurant
        </div>
      ) : (
        <div className="space-y-4">
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [`${val} orders`, name]}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    border: '1px solid #E4DDD2',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend List */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-xl bg-surface-subtle border border-neutralBorder-light flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-charcoal-secondary">Delivered</span>
              </div>
              <strong className="text-charcoal font-bold">{counts.delivered || 0}</strong>
            </div>

            <div className="p-2 rounded-xl bg-surface-subtle border border-neutralBorder-light flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-terracotta-500" />
                <span className="text-charcoal-secondary">In Prep</span>
              </div>
              <strong className="text-charcoal font-bold">{counts.preparing || 0}</strong>
            </div>

            <div className="p-2 rounded-xl bg-surface-subtle border border-neutralBorder-light flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-charcoal-secondary">Placed</span>
              </div>
              <strong className="text-charcoal font-bold">{counts.placed || 0}</strong>
            </div>

            <div className="p-2 rounded-xl bg-surface-subtle border border-neutralBorder-light flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-charcoal-muted" />
                <span className="text-charcoal-secondary">Cancelled</span>
              </div>
              <strong className="text-charcoal font-bold">{counts.cancelled || 0}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

