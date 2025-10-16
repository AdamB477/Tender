import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, MessageSquare } from "lucide-react";
import { MatchFactorChip } from "./MatchFactorChip";
import { ComplianceDocCard } from "./ComplianceDocCard";
import { CrewMemberCard } from "./CrewMemberCard";

interface ContractorDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  contractor: {
    id: string;
    name: string;
    logo?: string;
    rating: number;
    reviewCount: number;
    location: string;
    description: string;
    capabilities: string[];
    matchScore: number;
    whyMatched: { type: "skills" | "location" | "availability" | "reliability"; value: string }[];
    compliance: { type: string; status: "valid" | "expired" | "expiring"; issuedDate: string; expiryDate: string }[];
    crew: { name: string; role: string; complianceScore: number; docs: { type: string; status: "valid" | "expired" | "expiring" }[] }[];
    reviews: { author: string; rating: number; comment: string; date: string }[];
  };
  onRequestBid?: () => void;
  onMessage?: () => void;
}

export function ContractorDetailsDrawer({
  open,
  onClose,
  contractor,
  onRequestBid,
  onMessage,
}: ContractorDetailsDrawerProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const initials = contractor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[600px] sm:w-[600px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={contractor.logo} alt={contractor.name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <SheetTitle className="text-xl mb-2">{contractor.name}</SheetTitle>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-warning text-warning" />
                  <span className="font-medium">{contractor.rating}</span>
                  <span>({contractor.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{contractor.location}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={onRequestBid} data-testid="button-request-bid">
                  Request Bid
                </Button>
                <Button variant="outline" onClick={onMessage} data-testid="button-message">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </div>
            </div>
          </div>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
            <TabsTrigger value="compliance" className="flex-1">Compliance</TabsTrigger>
            <TabsTrigger value="crew" className="flex-1">Crew</TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div>
              <h3 className="font-medium mb-2">Why Matched</h3>
              <div className="flex gap-2 flex-wrap">
                {contractor.whyMatched.map((factor, idx) => (
                  <MatchFactorChip key={idx} type={factor.type} value={factor.value} />
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">About</h3>
              <p className="text-sm text-muted-foreground">{contractor.description}</p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Capabilities</h3>
              <div className="flex gap-2 flex-wrap">
                {contractor.capabilities.map((cap, idx) => (
                  <Badge key={idx} variant="secondary">
                    {cap}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-3 mt-4">
            {contractor.compliance.map((doc, idx) => (
              <ComplianceDocCard
                key={idx}
                type={doc.type}
                issuedDate={doc.issuedDate}
                expiryDate={doc.expiryDate}
                status={doc.status}
                onView={() => console.log("View", doc.type)}
                onDownload={() => console.log("Download", doc.type)}
              />
            ))}
          </TabsContent>

          <TabsContent value="crew" className="space-y-3 mt-4">
            {contractor.crew.map((member, idx) => (
              <CrewMemberCard
                key={idx}
                name={member.name}
                role={member.role}
                complianceScore={member.complianceScore}
                docs={member.docs}
                onClick={() => console.log("View crew member", member.name)}
              />
            ))}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4 mt-4">
            {contractor.reviews.map((review, idx) => (
              <div key={idx} className="border-b pb-4 last:border-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? "fill-warning text-warning" : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{review.author}</span>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
