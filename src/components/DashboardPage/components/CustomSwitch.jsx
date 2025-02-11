import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const CustomSwitch = ({ 
  isChecked,
  onToggle,
  leftLabel,
  rightLabel,
  className = "",
  switchClassName = "",
  disabled = false
}) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <Label htmlFor="custom-switch" className="text-slate-200">
      {leftLabel}
    </Label>
    <Switch
      id="custom-switch"
      checked={!isChecked}
      onCheckedChange={(checked) => onToggle(!checked)}
      className={switchClassName}
      disabled={disabled}
    />
    <Label htmlFor="custom-switch" className="text-slate-200">
      {rightLabel}
    </Label>
  </div>
);