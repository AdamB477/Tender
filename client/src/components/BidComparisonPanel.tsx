import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, DollarSign, Clock, Users, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Bid {
  id: string;
  contractorName: string;
  contractorLogo?: string;
  price: number;
  duration: number;
  crewCount: number;
  status: string;
  methodStatement: string;
}

interface BidComparisonPanelProps {
  bids: Bid[];
  onClose?: () => void;
  onAward?: (bidId: string) => void;
}

export function BidComparisonPanel({ bids, onClose, onAward }: BidComparisonPanelProps) {
  const avgPrice = bids.reduce((sum, bid) => sum + bid.price, 0) / bids.length;
  const avgDuration = bids.reduce((sum, bid) => sum + bid.duration, 0) / bids.length;

  const getPriceDelta = (price: number) => {
    const delta = ((price - avgPrice) / avgPrice) * 100;
    return { delta, isBetter: delta < 0 };
  };

  const getDurationDelta = (duration: number) => {
    const delta = ((duration - avgDuration) / avgDuration) * 100;
    return { delta, isBetter: delta < 0 };
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 p-6">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Compare Bids</h2>
          <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-comparison">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-3 gap-4">
            {bids.map((bid) => {
              const priceDelta = getPriceDelta(bid.price);
              const durationDelta = getDurationDelta(bid.duration);
              const initials = bid.contractorName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase();

              return (
                <Card key={bid.id} className="p-6">
                  <div className="flex items-start gap-3 mb-4 pb-4 border-b sticky top-0 bg-card">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={bid.contractorLogo} alt={bid.contractorName} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{bid.contractorName}</h3>
                      <Badge variant="secondary">{bid.status}</Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Price</span>
                        {priceDelta.isBetter ? (
                          <TrendingDown className="h-4 w-4 text-success" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-error" />
                        )}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                        <span className="text-2xl font-semibold">{bid.price.toLocaleString()}</span>
                      </div>
                      <p
                        className={cn(
                          "text-xs mt-1",
                          priceDelta.isBetter ? "text-success" : "text-error"
                        )}
                      >
                        {priceDelta.delta > 0 ? "+" : ""}
                        {priceDelta.delta.toFixed(1)}% vs avg
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Duration</span>
                        {durationDelta.isBetter ? (
                          <TrendingDown className="h-4 w-4 text-success" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-error" />
                        )}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <span className="text-2xl font-semibold">{bid.duration}</span>
                        <span className="text-sm text-muted-foreground">weeks</span>
                      </div>
                      <p
                        className={cn(
                          "text-xs mt-1",
                          durationDelta.isBetter ? "text-success" : "text-error"
                        )}
                      >
                        {durationDelta.delta > 0 ? "+" : ""}
                        {durationDelta.delta.toFixed(1)}% vs avg
                      </p>
                    </div>

                    <div>
                      <span className="text-sm text-muted-foreground mb-1 block">Crew Size</span>
                      <div className="flex items-baseline gap-2">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <span className="text-2xl font-semibold">{bid.crewCount}</span>
                        <span className="text-sm text-muted-foreground">members</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-muted-foreground mb-2 block">Method Statement</span>
                      <p className="text-sm line-clamp-3">{bid.methodStatement}</p>
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => onAward?.(bid.id)}
                      data-testid={`button-award-${bid.id}`}
                    >
                      Award This Bid
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
