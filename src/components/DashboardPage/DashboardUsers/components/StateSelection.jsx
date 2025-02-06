import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const StateSelection = ({ selectedStates, setSelectedStates }) => {
  const states = [
    { id: 1, label: "Registrado", value: "registered" },
    { id: 2, label: "No Registrado", value: "NO REGISTRADO" },
    { id: 3, label: "Preseleccionado", value: "Preseleccionado" },
    { id: 4, label: "Agendado", value: "Agendado" },
    { id: 5, label: "Rechazado", value: "Rechazado" },
    { id: 6, label: "Aceptado", value: "Aceptado" },
    { id: 7, label: "Activo", value: "Activo" },
    { id: 8, label: "Alerta", value: "Alerta" },
    { id: 9, label: "Egresado", value: "Egresado" },
    { id: 10, label: "Expulsado", value: "Expulsado" },
    { id: 11, label: "Retirado", value: "Retirado" },
  ];

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-white mb-4">
        Seleccione el estado
      </h3>
      <RadioGroup
        value={selectedStates}
        onValueChange={setSelectedStates}
        className="flex gap-4 flex-wrap"
      >
        {states.map((state) => (
          <div className="flex items-center space-x-2" key={state.id}>
            <RadioGroupItem
              value={state.value}
              id={state.value}
              className="border-slate-500"
            />
            <Label htmlFor={state.value} className="text-slate-200">
              {state.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default StateSelection;
