import { useEffect, useState } from "react";
import { TitleHeader } from "../components/TitleHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MessageCircle, ChevronDown } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TemplatesList } from "@/components/DashboardPage/DashboardUsers/components/TemplatesList";
import { getAllTemplates } from "@/services/templateService";

export const DashboardUsers = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [templates, setTemplates] = useState([]);


  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const templatesData = await getAllTemplates();
        setTemplates(templatesData.data);
      } catch (error) {
        console.error("Error loading templates:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, []);

  const [selectedStates, setSelectedStates] = useState([]);

  const [selectedIds] = useState([
    "319700312",
    "319700312",
    "319700312",
    "319700312",
    "319700312",
    "319700312",
    "319700312",
    "319700312",
    "319700312",
    "319700312",
  ]);

  const states = [
    { id: 1, label: "Registrado", value: "registered" },
    { id: 2, label: "No Registrado", value: "unregistered" },
    { id: 3, label: "Sin Estado", value: "no-state" },
  ];

  const handleStateChange = (value) => {
    setSelectedStates((prevStates) => {
      if (prevStates.includes(value)) {
        return prevStates.filter((state) => state !== value);
      }
      return [...prevStates, value];
    });
  };

  const toggleTemplate = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-900 overflow-y-scroll scrollbar-custom">
      <div className="mx-auto space-y-8">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <TitleHeader title="Mensajes masivos" />
          <div className="flex items-center gap-6">
            <div className="w-[180px]">
              <select
                defaultValue="Bucaramanga"
                className="h-fit w-fit bg-slate-800 text-white text-[0.9rem] border border-slate-600 rounded-lg p-2 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
              >
                <option value="Bucaramanga">Bucaramanga</option>
                <option value="Bogota">Bogotá</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="data-source" className="text-slate-200">
                Datos Excel
              </Label>
              <Switch
                id="data-source"
                className="data-[state=checked]:bg-cyan-500"
              />
              <Label htmlFor="data-source" className="text-slate-200">
                Datos IZA
              </Label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TemplatesList templates={templates} />

          <div className="flex flex-col w-full">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-white mb-4">
                Seleccione el estado
              </h3>
              <RadioGroup
                value={selectedStates}
                onValueChange={setSelectedStates}
                className="flex gap-4"
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
            <Card className="col-span-2 bg-slate-800/50 border-slate-700">
              <div className="p-4">
                <div className="mt-6">
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {selectedIds.map((id, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-lg"
                      >
                        <span className="text-slate-300 min-w-8">
                          {index + 1}
                        </span>
                        <span className="text-slate-300 flex-1">NOMBRE</span>
                        <span className="text-slate-400 font-mono">{id}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                    disabled={!selectedTemplate}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Enviar Mensajes
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardUsers;
