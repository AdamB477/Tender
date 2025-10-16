import { MatchFactorChip } from "../MatchFactorChip";

export default function MatchFactorChipExample() {
  return (
    <div className="p-6 flex gap-2 flex-wrap">
      <MatchFactorChip type="skills" value="92%" tooltip="Skills match: 92%" />
      <MatchFactorChip type="location" value="15km" tooltip="Distance: 15km away" />
      <MatchFactorChip type="availability" value="Now" tooltip="Available immediately" />
      <MatchFactorChip type="reliability" value="4.8" tooltip="Reliability score: 4.8/5" />
    </div>
  );
}
