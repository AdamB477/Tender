import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: LucideIcon;
  trend?: "up" | "down";
}

export function StatsCard({ title, value, change, icon: Icon, trend }: StatsCardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-semibold mb-2">{value}</h3>
          {change !== undefined && (
            <div className="flex items-center gap-1">
              <TrendIcon
                className={cn(
                  "h-4 w-4",
                  trend === "up" ? "text-success" : "text-error"
                )}
              />
              <span
                className={cn(
                  "text-sm font-medium",
                  trend === "up" ? "text-success" : "text-error"
                )}
              >
                {change > 0 ? "+" : ""}
                {change}%
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-3 rounded-lg bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        )}
      </div>
    </Card>
  );
}
