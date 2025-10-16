import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { StatsCard } from "@/components/StatsCard";
import { ContractorListItem } from "@/components/ContractorListItem";
import { BidCard } from "@/components/BidCard";
import { ContractorDetailsDrawer } from "@/components/ContractorDetailsDrawer";
import { CreateTenderDialog } from "@/components/CreateTenderDialog";
import { ViewBidDetailsDialog } from "@/components/ViewBidDetailsDialog";
import { FileText, Users, DollarSign, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

const DEMO_ORG_ID = "org-tenderer-1";
const DEMO_TENDER_ID = "tender-1";

export default function TendererDashboard() {
  const [selectedContractor, setSelectedContractor] = useState<any>(null);
  const [selectedBidId, setSelectedBidId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: stats } = useQuery({
    queryKey: ['/api/stats/tenderer', DEMO_ORG_ID],
    queryFn: () => fetch(`/api/stats/tenderer/${DEMO_ORG_ID}`).then(res => res.json()),
  });

  const { data: contractors = [] } = useQuery({
    queryKey: ['/api/match/contractors', DEMO_TENDER_ID],
    queryFn: () => fetch(`/api/match/contractors/${DEMO_TENDER_ID}?limit=5`).then(res => res.json()),
  });

  const { data: bids = [] } = useQuery({
    queryKey: ['/api/bids', DEMO_TENDER_ID],
    queryFn: () => fetch(`/api/bids?tenderId=${DEMO_TENDER_ID}`).then(res => res.json()),
  });

  const { data: complianceDocs = [] } = useQuery({
    queryKey: ['/api/compliance', 'organization', selectedContractor?.id],
    enabled: !!selectedContractor?.id,
    queryFn: () => fetch(`/api/compliance?entityType=organization&entityId=${selectedContractor.id}`).then(res => res.json()),
  });

  const { data: crewMembers = [] } = useQuery({
    queryKey: ['/api/crew', selectedContractor?.id],
    enabled: !!selectedContractor?.id,
    queryFn: () => fetch(`/api/crew?organizationId=${selectedContractor.id}`).then(res => res.json()),
  });

  const updateBidStatusMutation = useMutation({
    mutationFn: async ({ bidId, status }: { bidId: string; status: string }) => {
      const response = await apiRequest("PATCH", `/api/bids/${bidId}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bids"] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats/tenderer', DEMO_ORG_ID] });
      toast({
        title: "Success",
        description: "Bid status updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update bid status",
        variant: "destructive",
      });
    },
  });

  const mappedContractors = contractors.map((c: any) => ({
    id: c.id,
    name: c.name,
    logo: c.logoUrl,
    matchScore: c.matchScore || 0,
    rating: parseFloat(c.rating || "0"),
    reviewCount: c.reviewCount || 0,
    distance: c.distance || "0km",
    available: c.available,
    complianceValid: true,
    capabilityFit: c.matchScore || 0,
    whyMatched: [
      { type: "skills" as const, value: `${c.matchScore || 0}%` },
      { type: "location" as const, value: c.distance || "0km" },
    ],
  }));

  const mappedBids = bids.map((b: any) => ({
    id: b.bid.id,
    contractorName: b.contractor?.name || "Unknown",
    contractorLogo: b.contractor?.logoUrl,
    price: `$${parseFloat(b.bid.price).toLocaleString()}`,
    duration: `${b.bid.duration} weeks`,
    crewCount: b.bid.crewCount,
    status: b.bid.status,
    hasMethodStatement: !!b.bid.methodStatement,
    submittedDate: new Date(b.bid.submittedAt).toLocaleDateString(),
  }));

  const selectedContractorDetails = selectedContractor ? {
    ...selectedContractor,
    logo: selectedContractor.logoUrl,
    location: selectedContractor.address || `${selectedContractor.latitude}, ${selectedContractor.longitude}`,
    description: selectedContractor.description || "No description available",
    capabilities: selectedContractor.capabilities || [],
    whyMatched: selectedContractor.whyMatched || [
      { type: "skills" as const, value: `${selectedContractor.matchScore || 0}%` },
      { type: "location" as const, value: selectedContractor.distance || "Unknown" },
    ],
    compliance: complianceDocs.map((doc: any) => ({
      type: doc.type,
      status: doc.status,
      issuedDate: doc.issuedDate ? new Date(doc.issuedDate).toLocaleDateString() : '',
      expiryDate: doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString() : '',
    })),
    crew: crewMembers.map((member: any) => ({
      name: member.name,
      role: member.role,
      complianceScore: member.complianceScore || 0,
      docs: [
        { type: "Medical", status: "valid" as const },
        { type: "License", status: "valid" as const },
      ],
    })),
    reviews: [
      { author: "ABC Corp", rating: 5, comment: "Excellent work", date: "2 weeks ago" },
    ],
  } : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Tenderer Dashboard</h1>
          <p className="text-muted-foreground">Manage your tenders and find qualified contractors</p>
        </div>
        <CreateTenderDialog
          organizationId={DEMO_ORG_ID}
          trigger={
            <Button size="lg" data-testid="button-create-tender">
              <FileText className="h-4 w-4 mr-2" />
              Create Tender
            </Button>
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Active Tenders" 
          value={stats?.activeTenders || 0} 
          icon={FileText} 
          change={15} 
          trend="up" 
        />
        <StatsCard 
          title="Bids Received" 
          value={stats?.bidsReceived || 0} 
          icon={Users} 
          change={22} 
          trend="up" 
        />
        <StatsCard 
          title="Avg. Bid Value" 
          value={`$${Math.round((stats?.avgBidValue || 0) / 1000)}k`} 
          icon={DollarSign} 
          change={-8} 
          trend="down" 
        />
        <StatsCard 
          title="Contractors Shortlisted" 
          value={stats?.contractorsShortlisted || 0} 
          icon={TrendingUp} 
          change={33} 
          trend="up" 
        />
      </div>

      <Tabs defaultValue="contractors">
        <TabsList>
          <TabsTrigger value="contractors">Top Matched Contractors</TabsTrigger>
          <TabsTrigger value="bids">Recent Bids</TabsTrigger>
        </TabsList>

        <TabsContent value="contractors" className="space-y-3 mt-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Contractors for "Commercial Office Fitout - Level 12"</h3>
              <Button variant="outline" size="sm" data-testid="button-view-all-contractors">
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {mappedContractors.map((contractor: any) => (
                <ContractorListItem
                  key={contractor.id}
                  {...contractor}
                  onClick={() => setSelectedContractor(contractors.find((c: any) => c.id === contractor.id))}
                  onShortlist={() => console.log("Shortlist", contractor.id)}
                />
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="bids" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mappedBids.map((bid: any) => (
              <BidCard
                key={bid.id}
                {...bid}
                onView={() => setSelectedBidId(bid.id)}
                onShortlist={() => updateBidStatusMutation.mutate({ bidId: bid.id, status: "shortlisted" })}
                onAward={() => updateBidStatusMutation.mutate({ bidId: bid.id, status: "awarded" })}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {selectedContractorDetails && (
        <ContractorDetailsDrawer
          open={!!selectedContractorDetails}
          onClose={() => setSelectedContractor(null)}
          contractor={selectedContractorDetails}
          onRequestBid={() => {
            console.log("Request bid from", selectedContractorDetails.name);
            setSelectedContractor(null);
          }}
          onMessage={() => {
            console.log("Message", selectedContractorDetails.name);
            setSelectedContractor(null);
          }}
        />
      )}

      {selectedBidId && (
        <ViewBidDetailsDialog 
          bidId={selectedBidId}
          open={!!selectedBidId}
          onOpenChange={(open) => !open && setSelectedBidId(null)}
        />
      )}
    </div>
  );
}
