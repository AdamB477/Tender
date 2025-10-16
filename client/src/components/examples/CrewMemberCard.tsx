import { CrewMemberCard } from "../CrewMemberCard";

export default function CrewMemberCardExample() {
  return (
    <div className="p-6 space-y-3 max-w-md">
      <CrewMemberCard
        name="John Mitchell"
        role="Site Supervisor"
        complianceScore={100}
        docs={[
          { type: "Medical", status: "valid" },
          { type: "License", status: "valid" },
          { type: "Induction", status: "valid" },
        ]}
        onClick={() => console.log("View crew member")}
      />
      <CrewMemberCard
        name="Sarah Chen"
        role="Electrician"
        complianceScore={85}
        docs={[
          { type: "Medical", status: "valid" },
          { type: "License", status: "expiring" },
          { type: "White Card", status: "valid" },
        ]}
        onClick={() => console.log("View crew member")}
      />
    </div>
  );
}
