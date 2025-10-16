import { StatsCard } from "@/components/StatsCard";
import { ContractorListItem } from "@/components/ContractorListItem";
import { TenderListItem } from "@/components/TenderListItem";
import { BidCard } from "@/components/BidCard";
import { FileText, Users, CheckCircle, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  // TODO: Remove mock data
  const mockContractors = [
    {
      id: "1",
      name: "BuildCorp Construction",
      matchScore: 94,
      rating: 4.8,
      reviewCount: 156,
      distance: "12km",
      available: true,
      complianceValid: true,
      capabilityFit: 92,
      whyMatched: [
        { type: "skills" as const, value: "94%" },
        { type: "location" as const, value: "12km" },
      ],
    },
    {
      id: "2",
      name: "Elite Engineering Services",
      matchScore: 88,
      rating: 4.6,
      reviewCount: 92,
      distance: "25km",
      available: true,
      complianceValid: true,
      capabilityFit: 85,
      whyMatched: [
        { type: "skills" as const, value: "88%" },
        { type: "availability" as const, value: "Now" },
      ],
    },
  ];

  const mockTenders = [
    {
      id: "1",
      title: "Commercial Office Fitout - Level 12",
      company: "ABC Corporation",
      matchScore: 92,
      budget: "$250k - $350k",
      location: "Sydney CBD",
      deadline: "Dec 15, 2025",
      status: "open" as const,
      whyMatched: [
        { type: "skills" as const, value: "95%" },
        { type: "location" as const, value: "8km" },
      ],
    },
  ];

  const mockBids = [
    {
      id: "1",
      contractorName: "BuildCorp Construction",
      price: "$285,000",
      duration: "12 weeks",
      crewCount: 8,
      status: "shortlisted" as const,
      hasMethodStatement: true,
      submittedDate: "2 days ago",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Active Tenders" value="24" icon={FileText} change={12} trend="up" />
        <StatsCard title="Total Contractors" value="156" icon={Users} change={8} trend="up" />
        <StatsCard title="Awarded This Month" value="18" icon={CheckCircle} change={-3} trend="down" />
        <StatsCard title="Win Rate" value="68%" icon={TrendingUp} change={5} trend="up" />
      </div>

      <Tabs defaultValue="contractors">
        <TabsList>
          <TabsTrigger value="contractors">Top Matches</TabsTrigger>
          <TabsTrigger value="tenders">Recent Tenders</TabsTrigger>
          <TabsTrigger value="bids">Active Bids</TabsTrigger>
        </TabsList>

        <TabsContent value="contractors" className="space-y-3 mt-4">
          <Card className="p-4">
            <h3 className="font-medium mb-4">Top Matched Contractors</h3>
            <div className="space-y-3">
              {mockContractors.map((contractor) => (
                <ContractorListItem
                  key={contractor.id}
                  {...contractor}
                  onClick={() => console.log("View contractor", contractor.id)}
                  onShortlist={() => console.log("Shortlist", contractor.id)}
                />
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="tenders" className="space-y-3 mt-4">
          <Card className="p-4">
            <h3 className="font-medium mb-4">Recent Tenders</h3>
            <div className="space-y-3">
              {mockTenders.map((tender) => (
                <TenderListItem
                  key={tender.id}
                  {...tender}
                  onClick={() => console.log("View tender", tender.id)}
                  onBid={() => console.log("Submit bid", tender.id)}
                />
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="bids" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockBids.map((bid) => (
              <BidCard
                key={bid.id}
                {...bid}
                onView={() => console.log("View bid", bid.id)}
                onShortlist={() => console.log("Shortlist bid", bid.id)}
                onAward={() => console.log("Award bid", bid.id)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
