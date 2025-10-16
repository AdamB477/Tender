import { useState } from "react";
import { StatsCard } from "@/components/StatsCard";
import { ContractorListItem } from "@/components/ContractorListItem";
import { BidCard } from "@/components/BidCard";
import { ContractorDetailsDrawer } from "@/components/ContractorDetailsDrawer";
import { FileText, Users, DollarSign, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TendererDashboard() {
  const [selectedContractor, setSelectedContractor] = useState<any>(null);

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
        { type: "reliability" as const, value: "4.8" },
      ],
      logo: "",
      location: "Sydney, NSW",
      description: "Leading construction company with 20+ years experience in commercial and residential projects.",
      capabilities: ["Commercial Fitouts", "Electrical", "Plumbing", "HVAC"],
      compliance: [
        { type: "Public Liability Insurance", status: "valid" as const, issuedDate: "Jan 2024", expiryDate: "Jan 2026" },
        { type: "White Card", status: "valid" as const, issuedDate: "Mar 2023", expiryDate: "Mar 2028" },
      ],
      crew: [
        {
          name: "John Mitchell",
          role: "Site Supervisor",
          complianceScore: 100,
          docs: [
            { type: "Medical", status: "valid" as const },
            { type: "License", status: "valid" as const },
          ],
        },
      ],
      reviews: [
        { author: "ABC Corp", rating: 5, comment: "Excellent work on our office fitout.", date: "2 weeks ago" },
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
      logo: "",
      location: "Parramatta, NSW",
      description: "Specialized engineering services for commercial projects.",
      capabilities: ["Electrical", "HVAC", "Fire Systems"],
      compliance: [
        { type: "Public Liability Insurance", status: "valid" as const, issuedDate: "Jan 2024", expiryDate: "Jan 2026" },
      ],
      crew: [
        {
          name: "Sarah Chen",
          role: "Electrician",
          complianceScore: 85,
          docs: [
            { type: "Medical", status: "valid" as const },
            { type: "License", status: "expiring" as const },
          ],
        },
      ],
      reviews: [
        { author: "XYZ Ltd", rating: 4, comment: "Good quality work.", date: "1 month ago" },
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
    {
      id: "2",
      contractorName: "Elite Engineering",
      price: "$310,000",
      duration: "14 weeks",
      crewCount: 6,
      status: "pending" as const,
      hasMethodStatement: true,
      submittedDate: "1 day ago",
    },
    {
      id: "3",
      contractorName: "Quality Builders",
      price: "$265,000",
      duration: "10 weeks",
      status: "pending" as const,
      hasMethodStatement: false,
      submittedDate: "3 hours ago",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Tenderer Dashboard</h1>
          <p className="text-muted-foreground">Manage your tenders and find qualified contractors</p>
        </div>
        <Button size="lg" data-testid="button-create-tender">
          <FileText className="h-4 w-4 mr-2" />
          Create Tender
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Active Tenders" value="12" icon={FileText} change={15} trend="up" />
        <StatsCard title="Bids Received" value="47" icon={Users} change={22} trend="up" />
        <StatsCard title="Avg. Bid Value" value="$285k" icon={DollarSign} change={-8} trend="down" />
        <StatsCard title="Contractors Shortlisted" value="8" icon={TrendingUp} change={33} trend="up" />
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
              {mockContractors.map((contractor) => (
                <ContractorListItem
                  key={contractor.id}
                  {...contractor}
                  onClick={() => setSelectedContractor(contractor)}
                  onShortlist={() => console.log("Shortlist", contractor.id)}
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

      {selectedContractor && (
        <ContractorDetailsDrawer
          open={!!selectedContractor}
          onClose={() => setSelectedContractor(null)}
          contractor={selectedContractor}
          onRequestBid={() => {
            console.log("Request bid from", selectedContractor.name);
            setSelectedContractor(null);
          }}
          onMessage={() => {
            console.log("Message", selectedContractor.name);
            setSelectedContractor(null);
          }}
        />
      )}
    </div>
  );
}
