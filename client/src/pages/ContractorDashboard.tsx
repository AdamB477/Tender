import { StatsCard } from "@/components/StatsCard";
import { TenderListItem } from "@/components/TenderListItem";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, TrendingUp, DollarSign, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function ContractorDashboard() {
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
    {
      id: "2",
      title: "Warehouse Electrical Upgrade",
      company: "Logistics Pro Ltd",
      matchScore: 85,
      budget: "$150k - $200k",
      location: "Western Sydney",
      deadline: "Jan 30, 2026",
      status: "open" as const,
      whyMatched: [
        { type: "skills" as const, value: "88%" },
        { type: "availability" as const, value: "Now" },
      ],
    },
    {
      id: "3",
      title: "Retail Store Renovation",
      company: "ShopFit Group",
      matchScore: 78,
      budget: "$180k - $220k",
      location: "North Sydney",
      deadline: "Jan 15, 2026",
      status: "open" as const,
      whyMatched: [
        { type: "skills" as const, value: "82%" },
        { type: "location" as const, value: "15km" },
      ],
    },
  ];

  const myBids = [
    {
      id: "1",
      tender: "Commercial Office Fitout - Level 12",
      company: "ABC Corporation",
      bidAmount: "$285,000",
      status: "shortlisted" as const,
      submittedDate: "2 days ago",
    },
    {
      id: "2",
      tender: "Factory Floor Upgrade",
      company: "Manufacturing Co",
      bidAmount: "$420,000",
      status: "pending" as const,
      submittedDate: "1 week ago",
    },
  ];

  const complianceDocs = [
    { name: "Public Liability Insurance", status: "valid" as const, expiry: "Jan 2026" },
    { name: "White Card", status: "valid" as const, expiry: "Mar 2028" },
    { name: "WorkCover Certificate", status: "expiring" as const, expiry: "Dec 2025" },
  ];

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
        <StatsCard title="Active Bids" value="8" icon={FileText} change={25} trend="up" />
        <StatsCard title="Win Rate" value="72%" icon={TrendingUp} change={8} trend="up" />
        <StatsCard title="Avg. Bid Value" value="$320k" icon={DollarSign} change={12} trend="up" />
        <StatsCard title="Jobs Won This Month" value="3" icon={CheckCircle} change={50} trend="up" />
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

          <Card className="p-4">
            <h3 className="font-medium mb-4">My Recent Bids</h3>
            <div className="space-y-3">
              {myBids.map((bid) => (
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
              {complianceDocs.map((doc, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{doc.name}</span>
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
                  <p className="text-xs text-muted-foreground">Expires: {doc.expiry}</p>
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
                  <span className="text-lg font-semibold">12</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Compliance Rate</span>
                  <span className="text-lg font-semibold">92%</span>
                </div>
                <Progress value={92} className="h-2" />
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
