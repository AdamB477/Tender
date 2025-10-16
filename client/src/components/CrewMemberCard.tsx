import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface CrewMemberCardProps {
  name: string;
  role: string;
  photoUrl?: string;
  complianceScore: number;
  docs: {
    type: string;
    status: "valid" | "expired" | "expiring";
  }[];
  onClick?: () => void;
}

export function CrewMemberCard({
  name,
  role,
  photoUrl,
  complianceScore,
  docs,
  onClick,
}: CrewMemberCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "valid":
        return <CheckCircle className="h-3 w-3 text-success" />;
      case "expired":
        return <XCircle className="h-3 w-3 text-error" />;
      case "expiring":
        return <AlertCircle className="h-3 w-3 text-warning" />;
      default:
        return null;
    }
  };

  return (
    <Card
      className="p-4 hover-elevate cursor-pointer"
      onClick={onClick}
      data-testid={`card-crew-${name.toLowerCase().replace(/\s/g, "-")}`}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-16 w-16">
          <AvatarImage src={photoUrl} alt={name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm mb-1">{name}</h4>
          <p className="text-xs text-muted-foreground mb-2">{role}</p>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium">Compliance:</span>
            <Badge
              variant={complianceScore >= 90 ? "default" : "secondary"}
              className="text-xs"
            >
              {complianceScore}%
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {docs.map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1 text-xs"
                title={doc.type}
              >
                {getStatusIcon(doc.status)}
                <span className="truncate text-muted-foreground">{doc.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
