import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DollarSign, Clock, Users, FileText, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface ViewBidsDialogProps {
  tenderId: string;
  trigger?: React.ReactNode;
}

export function ViewBidsDialog({ tenderId, trigger }: ViewBidsDialogProps) {
  const [selectedBid, setSelectedBid] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: bids = [], isLoading } = useQuery({
    queryKey: ['/api/bids', tenderId],
    queryFn: () => fetch(`/api/bids?tenderId=${tenderId}`).then(res => res.json()),
  });

  const awardBidMutation = useMutation({
    mutationFn: async (bidId: string) => {
      const response = await apiRequest("PATCH", `/api/bids/${bidId}/status`, {
        status: "awarded"
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bids"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tenders"] });
      toast({
        title: "Success",
        description: "Bid awarded successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to award bid",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'awarded': return 'default';
      case 'shortlisted': return 'secondary';
      case 'rejected': return 'destructive';
      case 'pending': return 'outline';
      default: return 'secondary';
    }
  };

  const sortedBids = [...bids].sort((a: any, b: any) => {
    const priceA = parseFloat(a.bid?.price || a.price || 0);
    const priceB = parseFloat(b.bid?.price || b.price || 0);
    return priceA - priceB;
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" data-testid={`button-view-bids-${tenderId}`}>
            View Bids ({bids.length})
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bids for Tender</DialogTitle>
          <DialogDescription>
            Review and compare all submitted bids
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="text-muted-foreground">Loading bids...</div>
          </div>
        ) : bids.length > 0 ? (
          <div className="space-y-4">
            {sortedBids.map((item: any, index: number) => {
              const bid = item.bid || item;
              const contractor = item.contractor;
              const isLowestBid = index === 0;

              return (
                <Card 
                  key={bid.id} 
                  className={selectedBid === bid.id ? "border-primary" : ""}
                  data-testid={`card-bid-${bid.id}`}
                >
                  <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={contractor?.logoUrl} alt={contractor?.name} />
                        <AvatarFallback>
                          {contractor?.name?.substring(0, 2).toUpperCase() || 'CO'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{contractor?.name || "Unknown Contractor"}</h3>
                        {isLowestBid && (
                          <Badge variant="default" className="mt-1">
                            Lowest Bid
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Badge variant={getStatusColor(bid.status)}>
                      {bid.status}
                    </Badge>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-xs text-muted-foreground">Bid Price</div>
                          <div className="font-semibold">£{parseFloat(bid.price).toLocaleString()}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-xs text-muted-foreground">Duration</div>
                          <div className="font-semibold">{bid.duration} weeks</div>
                        </div>
                      </div>

                      {bid.crewCount && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="text-xs text-muted-foreground">Crew Size</div>
                            <div className="font-semibold">{bid.crewCount} members</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {bid.methodStatement && (
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Method Statement</span>
                        </div>
                        <p className="text-sm text-muted-foreground pl-6 line-clamp-3">
                          {bid.methodStatement}
                        </p>
                      </div>
                    )}

                    {bid.proposedCrew && bid.proposedCrew.length > 0 && (
                      <div className="pl-6">
                        <div className="text-sm font-medium mb-1">Proposed Crew</div>
                        <div className="flex flex-wrap gap-1">
                          {bid.proposedCrew.map((crewId: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              Crew Member {idx + 1}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground pl-6">
                      Submitted: {new Date(bid.submittedAt).toLocaleDateString()}
                    </div>
                  </CardContent>

                  {bid.status === "pending" && (
                    <CardFooter className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => awardBidMutation.mutate(bid.id)}
                        disabled={awardBidMutation.isPending}
                        data-testid={`button-award-${bid.id}`}
                      >
                        <Award className="h-4 w-4 mr-2" />
                        {awardBidMutation.isPending ? "Awarding..." : "Award Tender"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedBid(selectedBid === bid.id ? null : bid.id)}
                        data-testid={`button-select-${bid.id}`}
                      >
                        {selectedBid === bid.id ? "Deselect" : "Select for Comparison"}
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            No bids submitted yet
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
