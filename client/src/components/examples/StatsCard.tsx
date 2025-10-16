import { StatsCard } from "../StatsCard";
import { FileText, Users, CheckCircle, TrendingUp } from "lucide-react";

export default function StatsCardExample() {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard title="Active Tenders" value="24" icon={FileText} change={12} trend="up" />
      <StatsCard title="Total Contractors" value="156" icon={Users} change={8} trend="up" />
      <StatsCard title="Awarded This Month" value="18" icon={CheckCircle} change={-3} trend="down" />
      <StatsCard title="Win Rate" value="68%" icon={TrendingUp} change={5} trend="up" />
    </div>
  );
}
