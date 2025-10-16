import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, DollarSign, Clock, AlertCircle, FileText, CheckCircle2 } from "lucide-react";
import type { Tender } from "@shared/schema";

interface ViewTenderDialogProps {
  tenderId: string;
  trigger?: React.ReactNode;
}

export function ViewTenderDialog({ tenderId, trigger }: ViewTenderDialogProps) {
  const { data: tender, isLoading } = useQuery<Tender>({
    queryKey: ['/api/tenders', tenderId],
    queryFn: () => fetch(`/api/tenders/${tenderId}`).then(res => res.json()),
  });

  const budget = tender?.budget ? (typeof tender.budget === 'string' ? JSON.parse(tender.budget) : tender.budget) : { min: 0, max: 0 };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'default';
      case 'draft': return 'secondary';
      case 'closed': return 'outline';
      case 'awarded': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" data-testid={`button-view-tender-${tenderId}`}>
            View Details
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{tender?.title || "Tender Details"}</span>
            {tender?.status && (
              <Badge variant={getStatusColor(tender.status)}>
                {tender.status}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Detailed information about this tender
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="text-muted-foreground">Loading tender details...</div>
          </div>
        ) : tender ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Description</h3>
              <p className="text-sm text-muted-foreground">{tender.description}</p>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </h3>
                <p className="text-sm text-muted-foreground">{tender.address}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Budget Range
                </h3>
                <p className="text-sm text-muted-foreground">
                  ${budget.min?.toLocaleString()} - ${budget.max?.toLocaleString()}
                </p>
              </div>

              {tender.duration && (
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Duration
                  </h3>
                  <p className="text-sm text-muted-foreground">{tender.duration} weeks</p>
                </div>
              )}

              {tender.deadline && (
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Deadline
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(tender.deadline).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            <Separator />

            {tender.requiredSkills && tender.requiredSkills.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tender.requiredSkills.map((skill, idx) => (
                    <Badge key={idx} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {tender.requiredCompliance && tender.requiredCompliance.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Required Compliance
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tender.requiredCompliance.map((compliance, idx) => (
                    <Badge key={idx} variant="outline">
                      {compliance}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {tender.startDate && (
              <div>
                <h3 className="text-sm font-medium mb-2">Start Date</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(tender.startDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">Tender not found</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
