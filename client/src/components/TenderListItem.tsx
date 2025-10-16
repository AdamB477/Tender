import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MapPin, Calendar, DollarSign, ChevronRight } from "lucide-react";
import { MatchFactorChip } from "./MatchFactorChip";

interface TenderListItemProps {
  id: string;
  title: string;
  company: string;
  matchScore: number;
  budget: string;
  location: string;
  deadline: string;
  status: "open" | "draft" | "awarded" | "closed";
  whyMatched: {
    type: "skills" | "location" | "availability" | "reliability";
    value: string;
  }[];
  onClick?: () => void;
  onBid?: () => void;
}

const statusConfig = {
  open: "bg-success/10 text-success border-success/20",
  draft: "bg-muted text-muted-foreground border-border",
  awarded: "bg-primary/10 text-primary border-primary/20",
  closed: "bg-muted text-muted-foreground border-border",
};

export function TenderListItem({
  id,
  title,
  company,
  matchScore,
  budget,
  location,
  deadline,
  status,
  whyMatched,
  onClick,
  onBid,
}: TenderListItemProps) {
  return (
    <div
      className="flex items-center gap-4 p-4 border rounded-md hover-elevate cursor-pointer"
      onClick={onClick}
      data-testid={`row-tender-${id}`}
    >
      <div className="flex items-center gap-3 flex-1">
        <div className="flex flex-col items-center gap-1 min-w-[60px]">
          <Progress value={matchScore} className="h-2 w-12" />
          <span className="text-xs font-mono font-medium">{matchScore}%</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-sm">{title}</h3>
            <Badge variant="outline" className={statusConfig[status]}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-2">{company}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              <span>{budget}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Due: {deadline}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex gap-1 flex-wrap max-w-xs">
          {whyMatched.map((factor, idx) => (
            <MatchFactorChip key={idx} type={factor.type} value={factor.value} />
          ))}
        </div>

        <div className="flex gap-2">
          {status === "open" && (
            <Button
              variant="default"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onBid?.();
              }}
              data-testid={`button-bid-${id}`}
            >
              Submit Bid
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
