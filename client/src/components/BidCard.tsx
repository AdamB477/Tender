import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Clock, Users, FileText } from "lucide-react";

interface BidCardProps {
  id: string;
  contractorName: string;
  contractorLogo?: string;
  price: string;
  duration: string;
  crewCount?: number;
  status: "pending" | "shortlisted" | "awarded" | "rejected";
  hasMethodStatement?: boolean;
  submittedDate: string;
  onView?: () => void;
  onShortlist?: () => void;
  onAward?: () => void;
}

const statusConfig = {
  pending: "bg-muted text-muted-foreground border-border",
  shortlisted: "bg-primary/10 text-primary border-primary/20",
  awarded: "bg-success/10 text-success border-success/20",
  rejected: "bg-error/10 text-error border-error/20",
};

export function BidCard({
  id,
  contractorName,
  contractorLogo,
  price,
  duration,
  crewCount,
  status,
  hasMethodStatement,
  submittedDate,
  onView,
  onShortlist,
  onAward,
}: BidCardProps) {
  const initials = contractorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="p-4" data-testid={`card-bid-${id}`}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={contractorLogo} alt={contractorName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium text-sm">{contractorName}</h4>
            <p className="text-xs text-muted-foreground">Submitted {submittedDate}</p>
          </div>
        </div>
        <Badge variant="outline" className={statusConfig[status]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{price}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{duration}</span>
        </div>
        {crewCount && (
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{crewCount} crew</span>
          </div>
        )}
        {hasMethodStatement && (
          <div className="flex items-center gap-2 text-sm text-success">
            <FileText className="h-4 w-4" />
            <span>Method statement</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={onView}
          data-testid={`button-view-bid-${id}`}
        >
          View Details
        </Button>
        {status === "pending" && onShortlist && (
          <Button
            variant="default"
            size="sm"
            onClick={onShortlist}
            data-testid={`button-shortlist-bid-${id}`}
          >
            Shortlist
          </Button>
        )}
        {status === "shortlisted" && onAward && (
          <Button
            variant="default"
            size="sm"
            onClick={onAward}
            data-testid={`button-award-bid-${id}`}
          >
            Award
          </Button>
        )}
      </div>
    </Card>
  );
}
