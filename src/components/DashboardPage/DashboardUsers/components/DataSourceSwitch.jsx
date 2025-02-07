
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
export const DataSourceSwitch = ({ isExcelMode, setIsExcelMode }) => (
    <div className="flex items-center  gap-3 bg-slate-800/50 p-3 rounded-lg">
      <Label htmlFor="data-source" className="text-slate-200">
        Excel
      </Label>
      <Switch
        id="data-source"
        checked={!isExcelMode}
        onCheckedChange={(checked) => setIsExcelMode(!checked)}
        className="data-[state=checked]:bg-cyan-500"
      />
      <Label htmlFor="data-source" className="text-slate-200">
        IZA
      </Label>
    </div>
  );