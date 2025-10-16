import { ContractorListItem } from "../ContractorListItem";

export default function ContractorListItemExample() {
  return (
    <div className="p-6 space-y-3 max-w-6xl">
      <ContractorListItem
        id="1"
        name="BuildCorp Construction"
        matchScore={94}
        rating={4.8}
        reviewCount={156}
        distance="12km"
        available={true}
        complianceValid={true}
        capabilityFit={92}
        whyMatched={[
          { type: "skills", value: "94%" },
          { type: "location", value: "12km" },
          { type: "reliability", value: "4.8" },
        ]}
        onClick={() => console.log("View contractor details")}
        onShortlist={() => console.log("Add to shortlist")}
      />
      <ContractorListItem
        id="2"
        name="Elite Engineering Services"
        matchScore={88}
        rating={4.6}
        reviewCount={92}
        distance="25km"
        available={true}
        complianceValid={true}
        capabilityFit={85}
        whyMatched={[
          { type: "skills", value: "88%" },
          { type: "availability", value: "Now" },
        ]}
        onClick={() => console.log("View contractor details")}
        onShortlist={() => console.log("Add to shortlist")}
      />
    </div>
  );
}
