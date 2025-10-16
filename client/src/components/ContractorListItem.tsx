import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, MapPin, CheckCircle, ChevronRight } from "lucide-react";
import { MatchFactorChip } from "./MatchFactorChip";

interface ContractorListItemProps {
  id: string;
  name: string;
  logo?: string;
  matchScore: number;
  rating: number;
  reviewCount: number;
  distance: string;
  available: boolean;
  complianceValid: boolean;
  capabilityFit: number;
  whyMatched: {
    type: "skills" | "location" | "availability" | "reliability";
    value: string;
  }[];
  onClick?: () => void;
  onShortlist?: () => void;
}

export function ContractorListItem({
  id,
  name,
  logo,
  matchScore,
  rating,
  reviewCount,
  distance,
  available,
  complianceValid,
  capabilityFit,
  whyMatched,
  onClick,
  onShortlist,
}: ContractorListItemProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className="flex items-center gap-4 p-4 border rounded-md hover-elevate cursor-pointer"
      onClick={onClick}
      data-testid={`row-contractor-${id}`}
    >
      <div className="flex items-center gap-3 flex-1">
        <div className="flex flex-col items-center gap-1 min-w-[60px]">
          <Progress value={matchScore} className="h-2 w-12" />
          <span className="text-xs font-mono font-medium">{matchScore}%</span>
        </div>

        <Avatar className="h-12 w-12">
          <AvatarImage src={logo} alt={name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm mb-1">{name}</h3>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-warning text-warning" />
              <span className="font-medium">{rating}</span>
              <span>({reviewCount})</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{distance}</span>
            </div>
            <Badge
              variant={available ? "default" : "secondary"}
              className={available ? "bg-success/10 text-success border-success/20" : ""}
            >
              {available ? "Available" : "Busy"}
            </Badge>
            {complianceValid && (
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                <CheckCircle className="h-3 w-3 mr-1" />
                Compliant
              </Badge>
            )}
            <span>Capability: {capabilityFit}%</span>
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
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onShortlist?.();
            }}
            data-testid={`button-shortlist-${id}`}
          >
            Shortlist
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
