import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MapPin, Briefcase, CheckCircle, Star } from "lucide-react";

type FactorType = "skills" | "location" | "availability" | "reliability";

interface MatchFactorChipProps {
  type: FactorType;
  value: string;
  tooltip?: string;
}

const factorConfig = {
  skills: { icon: Briefcase, label: "Skills" },
  location: { icon: MapPin, label: "Location" },
  availability: { icon: CheckCircle, label: "Available" },
  reliability: { icon: Star, label: "Reliability" },
};

export function MatchFactorChip({ type, value, tooltip }: MatchFactorChipProps) {
  const config = factorConfig[type];
  const Icon = config.icon;

  const chip = (
    <Badge variant="secondary" className="gap-1">
      <Icon className="h-3 w-3" />
      <span>{value}</span>
    </Badge>
  );

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{chip}</TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return chip;
}
