import { TitleHeader } from "../../components/TitleHeader";
import { StepIndicator } from "./StepIndicator";
import { DataSourceSwitch } from "./DataSourceSwitch";

export const DashboardHeader = ({ selectedTemplate, selectedCity, selectState, isExcelMode, setIsExcelMode }) => (
  <div className="flex flex-col lg:flex-row items-center justify-between w-full mb-6 gap-4">
    <div className="flex-shrink-0 w-full lg:w-auto">
      <TitleHeader title="Mensajes masivos" />
    </div>

    <div className="flex items-center gap-2 md:gap-3 flex-grow justify-center overflow-x-auto w-full lg:w-auto py-2">
      <StepIndicator
        number={1}
        active={!selectedTemplate}
        text="Selecciona una plantilla"
      />
      <StepIndicator
        number={2}
        active={selectedTemplate && !selectedCity}
        text="Selecciona una sede"
        disabled={!selectedTemplate}
      />
      <StepIndicator
        number={3}
        active={selectedCity && selectedTemplate && !selectState}
        text="Selecciona el estado"
        disabled={!selectedCity}
      />
    </div>

    <div className="flex-shrink-0 w-full lg:w-auto">
      <DataSourceSwitch
        isExcelMode={isExcelMode}
        setIsExcelMode={setIsExcelMode}
      />
    </div>
  </div>
);
