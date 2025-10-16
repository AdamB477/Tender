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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DollarSign, Clock, Users, FileText, MapPin, Star, CheckCircle2 } from "lucide-react";

interface ViewBidDetailsDialogProps {
  bidId: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function ViewBidDetailsDialog({ bidId, open, onOpenChange, trigger }: ViewBidDetailsDialogProps) {
  // Fetch all bids to find the specific one
  const { data: allBids, isLoading } = useQuery({
    queryKey: ['/api/bids'],
    queryFn: () => fetch('/api/bids').then(res => res.json()),
    enabled: !!bidId,
  });

  // Find the specific bid and contractor from the response
  const bidItem = allBids?.find((item: any) => 
    item.bid?.id === bidId || item.id === bidId
  );
  const bid = bidItem?.bid || bidItem;
  const contractor = bidItem?.contractor;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'awarded': return 'default';
      case 'shortlisted': return 'secondary';
      case 'rejected': return 'destructive';
      case 'pending': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bid Details</DialogTitle>
          <DialogDescription>
            Detailed information about this bid
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="text-muted-foreground">Loading bid details...</div>
          </div>
        ) : bid ? (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={contractor?.logoUrl} alt={contractor?.name} />
                  <AvatarFallback>
                    {contractor?.name?.substring(0, 2).toUpperCase() || 'CO'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{contractor?.name || "Unknown Contractor"}</h3>
                  {contractor?.address && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {contractor.address}
                    </p>
                  )}
                </div>
              </div>
              <Badge variant={getStatusColor(bid.status)}>
                {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
              </Badge>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Bid Price
                </h4>
                <p className="text-2xl font-bold">${parseFloat(bid.price).toLocaleString()}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Duration
                </h4>
                <p className="text-2xl font-bold">{bid.duration} weeks</p>
              </div>

              {bid.crewCount && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Crew Size
                  </h4>
                  <p className="text-2xl font-bold">{bid.crewCount} members</p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium mb-2">
                  Submitted
                </h4>
                <p className="text-lg">{new Date(bid.submittedAt).toLocaleDateString()}</p>
              </div>
            </div>

            <Separator />

            {bid.methodStatement && (
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Method Statement
                </h4>
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-sm whitespace-pre-wrap">{bid.methodStatement}</p>
                </div>
              </div>
            )}

            {bid.selectedScopeItems && bid.selectedScopeItems.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Agreed Scope of Work
                </h4>
                <div className="bg-muted p-4 rounded-md">
                  <ul className="space-y-2">
                    {bid.selectedScopeItems.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Contractor has agreed to complete {bid.selectedScopeItems.length} item(s)
                </p>
              </div>
            )}

            {contractor?.rating && (
              <div>
                <h4 className="text-sm font-medium mb-2">Contractor Rating</h4>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(contractor.rating) ? "fill-warning text-warning" : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {contractor.rating} ({contractor.reviewCount || 0} reviews)
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            No bid details found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
