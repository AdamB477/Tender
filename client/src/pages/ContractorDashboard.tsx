import { useQuery } from "@tanstack/react-query";
import { StatsCard } from "@/components/StatsCard";
import { TenderListItem } from "@/components/TenderListItem";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, TrendingUp, DollarSign, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const DEMO_CONTRACTOR_ID = "org-contractor-1";

export default function ContractorDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['/api/stats/contractor', DEMO_CONTRACTOR_ID],
    queryFn: () => fetch(`/api/stats/contractor/${DEMO_CONTRACTOR_ID}`).then(res => res.json()),
  });

  const { data: tenders = [] } = useQuery({
    queryKey: ['/api/match/tenders', DEMO_CONTRACTOR_ID],
    queryFn: () => fetch(`/api/match/tenders/${DEMO_CONTRACTOR_ID}?limit=5`).then(res => res.json()),
  });

  const { data: myBids = [] } = useQuery({
    queryKey: ['/api/bids', DEMO_CONTRACTOR_ID],
    queryFn: () => fetch(`/api/bids?contractorId=${DEMO_CONTRACTOR_ID}`).then(res => res.json()),
  });

  const { data: complianceDocs = [] } = useQuery({
    queryKey: ['/api/compliance', 'organization', DEMO_CONTRACTOR_ID],
    queryFn: () => fetch(`/api/compliance?entityType=organization&entityId=${DEMO_CONTRACTOR_ID}`).then(res => res.json()),
  });

  const { data: crewMembers = [] } = useQuery({
    queryKey: ['/api/crew', DEMO_CONTRACTOR_ID],
    queryFn: () => fetch(`/api/crew?organizationId=${DEMO_CONTRACTOR_ID}`).then(res => res.json()),
  });

  const mappedTenders = tenders.map((t: any) => {
    const budget = typeof t.budget === 'string' ? JSON.parse(t.budget) : t.budget;
    return {
      id: t.id,
      title: t.title,
      company: "ABC Corporation",
      matchScore: t.matchScore || 0,
      budget: `$${(budget.min / 1000).toFixed(0)}k - $${(budget.max / 1000).toFixed(0)}k`,
      location: t.address || "Sydney",
      deadline: new Date(t.deadline).toLocaleDateString(),
      status: t.status,
      whyMatched: [
        { type: "skills" as const, value: `${t.matchScore || 0}%` },
        { type: "location" as const, value: t.distance || "0km" },
      ],
    };
  });

  const mappedMyBids = myBids.map((b: any) => ({
    id: b.bid.id,
    tender: b.tender?.title || "Unknown Tender",
    company: "ABC Corporation",
    bidAmount: `$${parseFloat(b.bid.price).toLocaleString()}`,
    status: b.bid.status,
    submittedDate: new Date(b.bid.submittedAt).toLocaleDateString(),
  }));

  const complianceRate = crewMembers.length > 0
    ? Math.round(crewMembers.reduce((sum: number, m: any) => sum + (m.complianceScore || 0), 0) / crewMembers.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Contractor Dashboard</h1>
          <p className="text-muted-foreground">Find tenders and manage your bids</p>
        </div>
        <Button size="lg" data-testid="button-browse-tenders">
          <FileText className="h-4 w-4 mr-2" />
          Browse Tenders
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Active Bids" 
          value={stats?.activeBids || 0} 
          icon={FileText} 
          change={25} 
          trend="up" 
        />
        <StatsCard 
          title="Win Rate" 
          value={`${stats?.winRate || 0}%`} 
          icon={TrendingUp} 
          change={8} 
          trend="up" 
        />
        <StatsCard 
          title="Avg. Bid Value" 
          value={`$${Math.round((stats?.avgBidValue || 0) / 1000)}k`} 
          icon={DollarSign} 
          change={12} 
          trend="up" 
        />
        <StatsCard 
          title="Jobs Won This Month" 
          value={stats?.jobsWonThisMonth || 0} 
          icon={CheckCircle} 
          change={50} 
          trend="up" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Top Matched Tenders</h3>
              <Button variant="outline" size="sm" data-testid="button-view-all-tenders">
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {mappedTenders.map((tender: any) => (
                <TenderListItem
                  key={tender.id}
                  {...tender}
                  onClick={() => console.log("View tender", tender.id)}
                  onBid={() => console.log("Submit bid", tender.id)}
                />
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-medium mb-4">My Recent Bids</h3>
            <div className="space-y-3">
              {mappedMyBids.map((bid: any) => (
                <div
                  key={bid.id}
                  className="flex items-center justify-between p-3 border rounded-md hover-elevate cursor-pointer"
                  data-testid={`row-my-bid-${bid.id}`}
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">{bid.tender}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{bid.company}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Bid: {bid.bidAmount}</span>
                      <span>Submitted {bid.submittedDate}</span>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      bid.status === "shortlisted"
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-muted text-muted-foreground border-border"
                    }
                  >
                    {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-medium mb-4">Compliance Status</h3>
            <div className="space-y-3">
              {complianceDocs.map((doc: any, idx: number) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{doc.type}</span>
                    <Badge
                      variant="outline"
                      className={
                        doc.status === "valid"
                          ? "bg-success/10 text-success border-success/20"
                          : "bg-warning/10 text-warning border-warning/20"
                      }
                    >
                      {doc.status === "valid" ? "Valid" : "Expiring Soon"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Expires: {doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-2" data-testid="button-manage-compliance">
                Manage Compliance
              </Button>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-medium mb-4">Crew Status</h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Total Crew Members</span>
                  <span className="text-lg font-semibold">{crewMembers.length}</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Compliance Rate</span>
                  <span className="text-lg font-semibold">{complianceRate}%</span>
                </div>
                <Progress value={complianceRate} className="h-2" />
              </div>
              <Button variant="outline" size="sm" className="w-full mt-2" data-testid="button-manage-crew">
                Manage Crew
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
