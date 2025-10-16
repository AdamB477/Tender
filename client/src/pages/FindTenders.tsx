import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, FileText, MapPin, DollarSign, Clock, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ViewTenderDialog } from "@/components/ViewTenderDialog";
import { SubmitBidDialog } from "@/components/SubmitBidDialog";

const DEMO_CONTRACTOR_ID = "org-contractor-1";

export default function FindTenders() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: tenders = [], isLoading } = useQuery({
    queryKey: ['/api/match/tenders', DEMO_CONTRACTOR_ID],
    queryFn: () => fetch(`/api/match/tenders/${DEMO_CONTRACTOR_ID}?limit=20`).then(res => res.json()),
  });

  const filteredTenders = tenders.filter((t: any) =>
    t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading tenders...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Find Tenders</h1>
        <p className="text-muted-foreground">Browse and bid on construction tenders matched to your skills</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tenders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search-tenders"
        />
      </div>

      <div className="grid gap-4">
        {filteredTenders.map((tender: any) => {
          const budget = typeof tender.budget === 'string' ? JSON.parse(tender.budget) : tender.budget;
          const matchScore = tender.matchScore || 0;
          
          return (
            <Card key={tender.id} data-testid={`card-tender-${tender.id}`}>
              <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold mb-2">{tender.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{tender.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant="default" data-testid={`badge-match-${tender.id}`}>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {matchScore}% Match
                  </Badge>
                  <span className="text-xs text-muted-foreground">{tender.distance || '0km'} away</span>
                </div>
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
                    {tender.requiredSkills.slice(0, 5).map((skill: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {tender.requiredSkills.length > 5 && (
                      <Badge variant="secondary" className="text-xs">
                        +{tender.requiredSkills.length - 5} more
                      </Badge>
                    )}
                  </div>
                )}
                
                {tender.deadline && (
                  <div className="text-sm text-muted-foreground">
                    Deadline: {new Date(tender.deadline).toLocaleDateString()}
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex gap-2 pt-4">
                <ViewTenderDialog
                  tenderId={tender.id}
                  trigger={
                    <Button variant="outline" size="sm" data-testid={`button-view-${tender.id}`}>
                      View Details
                    </Button>
                  }
                />
                <SubmitBidDialog
                  tenderId={tender.id}
                  contractorId={DEMO_CONTRACTOR_ID}
                  trigger={
                    <Button size="sm" className="ml-auto" data-testid={`button-bid-${tender.id}`}>
                      Submit Bid
                    </Button>
                  }
                />
              </CardFooter>
            </Card>
          );
        })}
        
        {filteredTenders.length === 0 && (
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <FileText className="h-16 w-16 text-muted-foreground/50" />
              <div>
                <h3 className="text-lg font-semibold mb-2">No tenders found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your search or update your profile capabilities</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
