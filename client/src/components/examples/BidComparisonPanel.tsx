import { useState } from "react";
import { BidComparisonPanel } from "../BidComparisonPanel";
import { Button } from "@/components/ui/button";

export default function BidComparisonPanelExample() {
  const [open, setOpen] = useState(false);

  const mockBids = [
    {
      id: "1",
      contractorName: "BuildCorp Construction",
      price: 285000,
      duration: 12,
      crewCount: 8,
      status: "Shortlisted",
      methodStatement: "We propose a phased approach with minimal disruption to operations. Team of 8 experienced professionals with proven track record.",
    },
    {
      id: "2",
      contractorName: "Elite Engineering",
      price: 310000,
      duration: 14,
      crewCount: 6,
      status: "Shortlisted",
      methodStatement: "Comprehensive solution with focus on quality and safety. Smaller team for better coordination and efficiency.",
    },
    {
      id: "3",
      contractorName: "Quality Builders",
      price: 265000,
      duration: 10,
      crewCount: 10,
      status: "Shortlisted",
      methodStatement: "Fast-track delivery with larger crew. Competitive pricing without compromising on quality standards.",
    },
  ];

  return (
    <div className="p-6">
      <Button onClick={() => setOpen(true)}>Compare Bids</Button>
      {open && (
        <BidComparisonPanel
          bids={mockBids}
          onClose={() => setOpen(false)}
          onAward={(id) => {
            console.log("Award bid", id);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}
