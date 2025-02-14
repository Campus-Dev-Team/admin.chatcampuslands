import { CustomSwitch } from '../../components/CustomSwitch';

export const DataSourceSwitch = ({ isExcelMode, setIsExcelMode, disabled = false }) => (
  <CustomSwitch
    isChecked={isExcelMode}
    onToggle={setIsExcelMode}
    leftLabel="Excel"
    rightLabel="IZA"
    className="bg-slate-800/50 p-3 rounded-lg"
    disabled={disabled}
  />
);