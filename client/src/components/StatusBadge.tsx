import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, Clock, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type StatusType = "available" | "busy" | "valid" | "expired" | "expiring" | "pending";

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  showIcon?: boolean;
  className?: string;
}

const statusConfig = {
  available: {
    icon: CheckCircle,
    className: "bg-success/10 text-success border-success/20",
    defaultLabel: "Available",
  },
  busy: {
    icon: XCircle,
    className: "bg-muted text-muted-foreground border-border",
    defaultLabel: "Busy",
  },
  valid: {
    icon: CheckCircle,
    className: "bg-success/10 text-success border-success/20",
    defaultLabel: "Valid",
  },
  expired: {
    icon: XCircle,
    className: "bg-error/10 text-error border-error/20",
    defaultLabel: "Expired",
  },
  expiring: {
    icon: AlertCircle,
    className: "bg-warning/10 text-warning border-warning/20",
    defaultLabel: "Expiring Soon",
  },
  pending: {
    icon: Clock,
    className: "bg-primary/10 text-primary border-primary/20",
    defaultLabel: "Pending",
  },
};

export function StatusBadge({ status, label, showIcon = true, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {showIcon && <Icon className="h-3 w-3 mr-1" />}
      {label || config.defaultLabel}
    </Badge>
  );
}
