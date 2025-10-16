import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComplianceDocCardProps {
  type: string;
  issuedDate?: string;
  expiryDate?: string;
  status: "valid" | "expired" | "expiring";
  fileName?: string;
  onView?: () => void;
  onDownload?: () => void;
}

export function ComplianceDocCard({
  type,
  issuedDate,
  expiryDate,
  status,
  fileName,
  onView,
  onDownload,
}: ComplianceDocCardProps) {
  const statusConfig = {
    valid: {
      icon: CheckCircle,
      className: "bg-success/10 text-success border-success/20",
      label: "Valid",
    },
    expired: {
      icon: XCircle,
      className: "bg-error/10 text-error border-error/20",
      label: "Expired",
    },
    expiring: {
      icon: AlertCircle,
      className: "bg-warning/10 text-warning border-warning/20",
      label: "Expiring Soon",
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-2 rounded-md bg-muted">
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm mb-1">{type}</h4>
            {fileName && (
              <p className="text-xs text-muted-foreground truncate mb-2">{fileName}</p>
            )}
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {issuedDate && <span>Issued: {issuedDate}</span>}
              {expiryDate && <span>Expires: {expiryDate}</span>}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge variant="outline" className={cn(config.className, "gap-1")}>
            <StatusIcon className="h-3 w-3" />
            {config.label}
          </Badge>
          <div className="flex gap-1">
            {onView && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onView}
                data-testid="button-view-doc"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            {onDownload && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onDownload}
                data-testid="button-download-doc"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
