import { StatusBadge } from "../StatusBadge";

export default function StatusBadgeExample() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex gap-2 flex-wrap">
        <StatusBadge status="available" />
        <StatusBadge status="busy" />
        <StatusBadge status="valid" />
        <StatusBadge status="expired" />
        <StatusBadge status="expiring" />
        <StatusBadge status="pending" />
      </div>
    </div>
  );
}
