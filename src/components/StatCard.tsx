import Card from "./Card.jsx";
import { cn } from "./Card.jsx";
import type { ReactElement } from "react";
import { TrendingUp } from "lucide-react";
// Stat Card Component
const StatCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  trend,
  color = "indigo",
  ...props
}: {
  icon: ReactElement;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
  color?: "indigo" | "green" | "blue" | "orange" | "purple";
}) => {
  const colorClasses = {
    indigo: "bg-primary-100 text-primary-600",
    green: "bg-tertiary-100 text-tertiary-600",
    blue: "bg-secondary-100 text-secondary-600",
    orange: "bg-primary-100 text-primary-600",
    purple: "bg-secondary-100 text-secondary-600",
  };

  return (
    <Card hoverable className="p-6" {...props}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                colorClasses[color],
              )}
            >
              {Icon}
            </div>
            <h3 className="text-sm font-medium text-primary-600">{title}</h3>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-primary-900">{value}</p>
            {subtitle && (
              <p className="text-sm text-primary-500 flex items-center gap-1">
                {trend && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-xs font-medium",
                      trend > 0 ? "text-tertiary-500" : "text-secondary-500",
                    )}
                  >
                    <TrendingUp
                      className={cn("w-3 h-3", trend < 0 ? "rotate-180" : "")}
                    />
                    {Math.abs(trend)}%
                  </span>
                )}
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
