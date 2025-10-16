import { TenderListItem } from "../TenderListItem";

export default function TenderListItemExample() {
  return (
    <div className="p-6 space-y-3 max-w-6xl">
      <TenderListItem
        id="1"
        title="Commercial Office Fitout - Level 12"
        company="ABC Corporation"
        matchScore={92}
        budget="$250k - $350k"
        location="Sydney CBD"
        deadline="Dec 15, 2025"
        status="open"
        whyMatched={[
          { type: "skills", value: "95%" },
          { type: "location", value: "8km" },
        ]}
        onClick={() => console.log("View tender details")}
        onBid={() => console.log("Submit bid")}
      />
      <TenderListItem
        id="2"
        title="Warehouse Electrical Upgrade"
        company="Logistics Pro Ltd"
        matchScore={85}
        budget="$150k - $200k"
        location="Western Sydney"
        deadline="Jan 30, 2026"
        status="open"
        whyMatched={[
          { type: "skills", value: "88%" },
          { type: "availability", value: "Now" },
        ]}
        onClick={() => console.log("View tender details")}
        onBid={() => console.log("Submit bid")}
      />
    </div>
  );
}
