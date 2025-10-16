import { useQuery } from "@tanstack/react-query";
import { FileText, Plus, MapPin, DollarSign, Clock, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const DEMO_ORG_ID = "org-tenderer-1";

export default function MyTenders() {
  const { data: tenders = [], isLoading } = useQuery({
    queryKey: ['/api/tenders', DEMO_ORG_ID],
    queryFn: () => fetch(`/api/tenders?organizationId=${DEMO_ORG_ID}`).then(res => res.json()),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'default';
      case 'draft': return 'secondary';
      case 'closed': return 'outline';
      case 'awarded': return 'default';
      default: return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading tenders...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">My Tenders</h1>
          <p className="text-muted-foreground">Manage and track all your construction tenders</p>
        </div>
        <Button size="lg" data-testid="button-create-tender">
          <Plus className="h-4 w-4 mr-2" />
          Create Tender
        </Button>
      </div>

      <div className="grid gap-4">
        {tenders.map((item: any) => {
          const tender = item.tender || item;
          const budget = typeof tender.budget === 'string' ? JSON.parse(tender.budget) : tender.budget;
          
          return (
            <Card key={tender.id} data-testid={`card-tender-${tender.id}`}>
              <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold mb-2">{tender.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{tender.description}</p>
                </div>
                <Badge variant={getStatusColor(tender.status)} data-testid={`badge-status-${tender.id}`}>
                  {tender.status}
                </Badge>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{tender.address}</span>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>${budget.min?.toLocaleString()} - ${budget.max?.toLocaleString()}</span>
                  </div>
                  
                  {tender.duration && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{tender.duration} weeks</span>
                    </div>
                  )}
                </div>
                
                {tender.requiredSkills && tender.requiredSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {tender.requiredSkills.slice(0, 4).map((skill: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {tender.requiredSkills.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{tender.requiredSkills.length - 4} more
                      </Badge>
                    )}
                  </div>
                )}
                
                {tender.deadline && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <AlertCircle className="h-4 w-4" />
                    <span>Deadline: {new Date(tender.deadline).toLocaleDateString()}</span>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex gap-2 pt-4">
                <Button variant="outline" size="sm" data-testid={`button-view-${tender.id}`}>
                  View Details
                </Button>
                <Button variant="outline" size="sm" data-testid={`button-bids-${tender.id}`}>
                  View Bids
                </Button>
                {tender.status === 'draft' && (
                  <Button size="sm" className="ml-auto" data-testid={`button-publish-${tender.id}`}>
                    Publish
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
        
        {tenders.length === 0 && (
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <FileText className="h-16 w-16 text-muted-foreground/50" />
              <div>
                <h3 className="text-lg font-semibold mb-2">No tenders yet</h3>
                <p className="text-sm text-muted-foreground mb-4">Create your first tender to find qualified contractors</p>
                <Button data-testid="button-create-first-tender">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Tender
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
