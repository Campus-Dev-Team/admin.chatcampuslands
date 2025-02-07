import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const StateSelection = ({
  currentState,
  setCurrentState,
  onStateSelect,
  selectedCity,
  setSelectedCity,
}) => {
  const states = [
    { id: 1, label: "Registrado", value: "Registrado" },
    { id: 2, label: "No Registrado", value: "NO_REGISTRADO" },
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

  const handleStateChange = (value) => {
    setCurrentState(value);
    onStateSelect(value);
  };

  return (
    <div className="flex gap-4 items-center mb-6">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-white mb-2">Sede</h3>
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-full bg-slate-800 border-slate-600 text-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem 
                value="Bucaramanga"
                className="text-slate-200 hover:bg-slate-700 focus:bg-slate-700"
              >
                Bucaramanga
              </SelectItem>
              <SelectItem 
                value="Bogota"
                className="text-slate-200 hover:bg-slate-700 focus:bg-slate-700"
              >
                Bogotá
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      <div className="flex-1">
        <h3 className="text-lg font-medium text-white mb-2">Estado</h3>
        <Select value={currentState} onValueChange={handleStateChange}>
          <SelectTrigger className="w-full bg-slate-800 border-slate-600 text-slate-200">
            <SelectValue placeholder="Seleccione un estado" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600">
            {states.map((state) => (
              <SelectItem 
                key={state.id} 
                value={state.value }
                className="text-slate-200 hover:bg-slate-700 focus:bg-slate-700"
              >
                {state.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
    </div>
  );
};