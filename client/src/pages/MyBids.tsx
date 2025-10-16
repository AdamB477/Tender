import { useQuery } from "@tanstack/react-query";
import { Briefcase, MapPin, DollarSign, Clock, Users } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const DEMO_CONTRACTOR_ID = "org-contractor-1";

export default function MyBids() {
  const { data: bids = [], isLoading } = useQuery({
    queryKey: ['/api/bids', DEMO_CONTRACTOR_ID],
    queryFn: () => fetch(`/api/bids?contractorId=${DEMO_CONTRACTOR_ID}`).then(res => res.json()),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'shortlisted': return 'default';
      case 'awarded': return 'default';
      case 'rejected': return 'outline';
      default: return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading bids...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">My Bids</h1>
        <p className="text-muted-foreground">Track all your submitted bids and their status</p>
      </div>

      <div className="grid gap-4">
        {bids.map((item: any) => {
          const bid = item.bid;
          const tender = item.tender;
          const budget = typeof tender?.budget === 'string' ? JSON.parse(tender.budget) : tender?.budget;
          
          return (
            <Card key={bid.id} data-testid={`card-bid-${bid.id}`}>
              <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold mb-2">{tender?.title || 'Tender'}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{tender?.description}</p>
                </div>
                <Badge variant={getStatusColor(bid.status)} data-testid={`badge-status-${bid.id}`}>
                  {bid.status}
                </Badge>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {tender?.address && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{tender.address}</span>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Your Bid</span>
                        <span className="font-semibold">${parseFloat(bid.price).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Duration</span>
                        <span className="font-semibold">{bid.duration} weeks</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {budget && (
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">Budget Range</span>
                          <span className="text-sm">${budget.min?.toLocaleString()} - ${budget.max?.toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                    
                    {bid.crewCount && (
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">Crew Size</span>
                          <span className="font-semibold">{bid.crewCount} members</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Submitted: {new Date(bid.submittedAt).toLocaleDateString()}
                </div>
              </CardContent>
              
              <CardFooter className="flex gap-2 pt-4">
                <Button variant="outline" size="sm" data-testid={`button-view-${bid.id}`}>
                  View Details
                </Button>
                {bid.status === 'pending' && (
                  <Button variant="outline" size="sm" data-testid={`button-edit-${bid.id}`}>
                    Edit Bid
                  </Button>
                )}
                {bid.status === 'shortlisted' && (
                  <Badge variant="default" className="ml-auto">
                    Under Review
                  </Badge>
                )}
              </CardFooter>
            </Card>
          );
        })}
        
        {bids.length === 0 && (
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <Briefcase className="h-16 w-16 text-muted-foreground/50" />
              <div>
                <h3 className="text-lg font-semibold mb-2">No bids submitted yet</h3>
                <p className="text-sm text-muted-foreground mb-4">Browse available tenders to submit your first bid</p>
                <Button data-testid="button-find-tenders">
                  Find Tenders
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
