import { BidCard } from "../BidCard";

export default function BidCardExample() {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
      <BidCard
        id="1"
        contractorName="BuildCorp Construction"
        price="$285,000"
        duration="12 weeks"
        crewCount={8}
        status="shortlisted"
        hasMethodStatement={true}
        submittedDate="2 days ago"
        onView={() => console.log("View bid details")}
        onShortlist={() => console.log("Shortlist bid")}
        onAward={() => console.log("Award bid")}
      />
      <BidCard
        id="2"
        contractorName="Elite Engineering"
        price="$310,000"
        duration="14 weeks"
        crewCount={6}
        status="pending"
        hasMethodStatement={true}
        submittedDate="1 day ago"
        onView={() => console.log("View bid details")}
        onShortlist={() => console.log("Shortlist bid")}
      />
      <BidCard
        id="3"
        contractorName="Quality Builders"
        price="$265,000"
        duration="10 weeks"
        status="awarded"
        hasMethodStatement={false}
        submittedDate="5 days ago"
        onView={() => console.log("View bid details")}
      />
    </div>
  );
}
