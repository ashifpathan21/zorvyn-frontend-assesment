import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import Button from "./Button";
import type { IData } from "../pages/DashBoard";

const metrics = ["income", "expense", "both"] as const;
type Metric = (typeof metrics)[number];

const formatDate = (value: string) => {
  const date = new Date(value);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export default function FinanceChart({ data }: { data: IData[] }) {
  const [selectedMetric, setSelectedMetric] = useState<Metric>("both");

  const chartData = useMemo(
    () =>
      data.map((item) => ({
        ...item,
        date: formatDate(item.date),
      })),
    [data]
  );

  return (
    <div className="w-full h-96 rounded-3xl p-5 shadow-xl bg-neutral-50 border border-neutral-200">
      
      {/* 🔥 SAME HEADER (UNCHANGED) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-5">
        <div>
          <p className="text-sm text-neutral-500">Financial trend</p>
          <h2 className="text-xl font-semibold text-neutral-900 capitalize">
            {selectedMetric}
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {metrics.map((metric) => (
            <Button
              key={metric}
              type="ghost"
              text={metric}
              onClick={() => setSelectedMetric(metric)}
              clicked={selectedMetric === metric}
            />
          ))}
        </div>
      </div>

      {/* 🔥 CHART */}
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            
            {/* GRADIENTS (same colors as your theme) */}
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary-500)" stopOpacity={0.3}/>
                <stop offset="100%" stopColor="var(--color-primary-500)" stopOpacity={0}/>
              </linearGradient>

              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-secondary-500)" stopOpacity={0.3}/>
                <stop offset="100%" stopColor="var(--color-secondary-500)" stopOpacity={0}/>
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              stroke="var(--color-neutral-200)"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--color-neutral-500)", fontSize: 12 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--color-neutral-500)", fontSize: 12 }}
            />

            <Tooltip
              cursor={{ stroke: "var(--color-neutral-200)", strokeWidth: 1 }}
              contentStyle={{
                borderRadius: 16,
                border: "1px solid var(--color-neutral-200)",
              }}
            />

            {/* 🔥 LOGIC RESTORED */}
            {selectedMetric === "both" ? (
              <>
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="var(--color-primary-500)"
                  fill="url(#incomeGradient)"
                  strokeWidth={2}
                />

                <Area
                  type="monotone"
                  dataKey="expense"
                  stroke="var(--color-secondary-500)"
                  fill="url(#expenseGradient)"
                  strokeWidth={2}
                />
              </>
            ) : (
              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke={
                  selectedMetric === "income"
                    ? "var(--color-primary-500)"
                    : "var(--color-secondary-500)"
                }
                fill={
                  selectedMetric === "income"
                    ? "url(#incomeGradient)"
                    : "url(#expenseGradient)"
                }
                strokeWidth={2}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}