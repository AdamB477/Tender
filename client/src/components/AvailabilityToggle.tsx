import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface AvailabilityToggleProps {
  defaultAvailable?: boolean;
  onToggle?: (available: boolean) => void;
}

export function AvailabilityToggle({ defaultAvailable = true, onToggle }: AvailabilityToggleProps) {
  const [available, setAvailable] = useState(defaultAvailable);

  const handleToggle = (checked: boolean) => {
    setAvailable(checked);
    onToggle?.(checked);
    console.log("Availability toggled:", checked ? "Available" : "Busy");
  };

  return (
    <div className="flex items-center gap-2">
      <Switch
        id="availability"
        checked={available}
        onCheckedChange={handleToggle}
        data-testid="switch-availability"
      />
      <Label htmlFor="availability" className="text-sm font-medium cursor-pointer">
        {available ? "Available" : "Busy"}
      </Label>
    </div>
  );
}
