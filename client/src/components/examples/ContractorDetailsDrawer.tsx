import { useState } from "react";
import { ContractorDetailsDrawer } from "../ContractorDetailsDrawer";
import { Button } from "@/components/ui/button";

export default function ContractorDetailsDrawerExample() {
  const [open, setOpen] = useState(false);

  const mockContractor = {
    id: "1",
    name: "BuildCorp Construction",
    rating: 4.8,
    reviewCount: 156,
    location: "Sydney, NSW",
    description: "Leading construction company with 20+ years experience in commercial and residential projects. Specializing in high-quality fitouts, renovations, and new builds.",
    capabilities: ["Commercial Fitouts", "Electrical", "Plumbing", "HVAC", "Civil Works"],
    matchScore: 94,
    whyMatched: [
      { type: "skills" as const, value: "94%" },
      { type: "location" as const, value: "12km" },
      { type: "reliability" as const, value: "4.8" },
    ],
    compliance: [
      { type: "Public Liability Insurance", status: "valid" as const, issuedDate: "Jan 2024", expiryDate: "Jan 2026" },
      { type: "White Card", status: "valid" as const, issuedDate: "Mar 2023", expiryDate: "Mar 2028" },
      { type: "WorkCover Certificate", status: "expiring" as const, issuedDate: "Aug 2023", expiryDate: "Dec 2025" },
    ],
    crew: [
      {
        name: "John Mitchell",
        role: "Site Supervisor",
        complianceScore: 100,
        docs: [
          { type: "Medical", status: "valid" as const },
          { type: "License", status: "valid" as const },
          { type: "Induction", status: "valid" as const },
        ],
      },
      {
        name: "Sarah Chen",
        role: "Electrician",
        complianceScore: 85,
        docs: [
          { type: "Medical", status: "valid" as const },
          { type: "License", status: "expiring" as const },
          { type: "White Card", status: "valid" as const },
        ],
      },
    ],
    reviews: [
      { author: "ABC Corp", rating: 5, comment: "Excellent work on our office fitout. Professional team, delivered on time.", date: "2 weeks ago" },
      { author: "XYZ Ltd", rating: 4, comment: "Good quality work, minor delays but overall satisfied.", date: "1 month ago" },
    ],
  };

  return (
    <div className="p-6">
      <Button onClick={() => setOpen(true)}>Open Contractor Details</Button>
      <ContractorDetailsDrawer
        open={open}
        onClose={() => setOpen(false)}
        contractor={mockContractor}
        onRequestBid={() => console.log("Request bid")}
        onMessage={() => console.log("Send message")}
      />
    </div>
  );
}
