import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, MapPin, Star, Shield, Users } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ViewContractorProfileDialog } from "@/components/ViewContractorProfileDialog";
import { SendMessageDialog } from "@/components/SendMessageDialog";

const DEMO_ORG_ID = "org-tenderer-1";

export default function FindContractors() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: contractors = [], isLoading } = useQuery({
    queryKey: ['/api/organizations', 'contractor'],
    queryFn: () => fetch('/api/organizations?type=contractor').then(res => res.json()),
  });

  const filteredContractors = contractors.filter((c: any) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.capabilities?.some((cap: string) => cap.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading contractors...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Find Contractors</h1>
        <p className="text-muted-foreground">Search and connect with qualified construction contractors</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or capabilities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search-contractors"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredContractors.map((contractor: any) => (
          <Card key={contractor.id} data-testid={`card-contractor-${contractor.id}`}>
            <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={contractor.logoUrl} alt={contractor.name} />
                <AvatarFallback>{contractor.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold mb-1">{contractor.name}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-medium">{parseFloat(contractor.rating || "0").toFixed(1)}</span>
                  </div>
                  <span className="text-muted-foreground">({contractor.reviewCount || 0} reviews)</span>
                </div>
              </div>
              {contractor.available && (
                <Badge variant="default" className="bg-green-500">Available</Badge>
              )}
            </CardHeader>
            
            <CardContent className="space-y-3">
              {contractor.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">{contractor.description}</p>
              )}
              
              {contractor.address && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{contractor.address}</span>
                </div>
              )}
              
              {contractor.capabilities && contractor.capabilities.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {contractor.capabilities.slice(0, 5).map((cap: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {cap}
                    </Badge>
                  ))}
                  {contractor.capabilities.length > 5 && (
                    <Badge variant="secondary" className="text-xs">
                      +{contractor.capabilities.length - 5} more
                    </Badge>
                  )}
                </div>
              )}
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Reliability: {contractor.reliabilityScore || 50}%</span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex gap-2 pt-4">
              <ViewContractorProfileDialog
                contractorId={contractor.id}
                trigger={
                  <Button variant="outline" size="sm" data-testid={`button-view-profile-${contractor.id}`}>
                    View Profile
                  </Button>
                }
              />
              <SendMessageDialog
                senderId={DEMO_ORG_ID}
                receiverId={contractor.id}
                receiverName={contractor.name}
                trigger={
                  <Button size="sm" data-testid={`button-message-${contractor.id}`}>
                    Send Message
                  </Button>
                }
              />
            </CardFooter>
          </Card>
        ))}
        
        {filteredContractors.length === 0 && (
          <div className="col-span-2">
            <Card className="p-12">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <Users className="h-16 w-16 text-muted-foreground/50" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">No contractors found</h3>
                  <p className="text-sm text-muted-foreground">Try adjusting your search criteria</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
