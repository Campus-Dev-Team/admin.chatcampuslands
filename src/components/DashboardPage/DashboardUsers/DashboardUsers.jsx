import { useEffect, useState } from "react";
import { TitleHeader } from "../components/TitleHeader";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TemplatesList } from "@/components/DashboardPage/DashboardUsers/components/TemplatesList";
import { getAllTemplates, sendTemplates } from "@/services/templateService";
import { UserMessagePanel } from "./components/UserMessagePanel";
import { getUsersByStateBogota, getUsersByStateBucaramanga } from "@/services/userService";
import { StateSelection } from "./components/StateSelection";

export const DashboardUsers = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");

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

  const [selectedIds] = useState([]);

  const handleGetUsersByState = async () => {
    let dataUsers = {
      status: selectedStates,
      list: [],
    };
    if(selectedCity == null){
      console.warn("Porfavor selecciona una ciudad")
    } else if(selectedCity == "Bucaramanga") {
      try {
        const response = await getUsersByStateBucaramanga(dataUsers); 
        console.log("respuesta al enviar mensajes masivos", response);
      } catch (error) {
        console.error("error al enviar mensajes masivos", error)
      }
    } else if(selectedCity == "Bogota"){
      try {
        const response = await getUsersByStateBogota(dataUsers); 
        console.log("respuesta al enviar mensajes masivos", response);
      } catch (error) {
        console.error("error al enviar mensajes masivos", error)
      }
    } else {
      console.error("ciudad no encontrada")
    }
  };

  const handleSendMessages = async () => {
    let dataMasiveMessage = {
      toList: [],
      template: templates,
    };
    try {
      const response = await sendTemplates(dataMasiveMessage); 
      console.log("respuesta al enviar mensajes masivos", response);
    } catch (error) {
      console.error("error al enviar mensajes masivos", error)
    }
  };

  const handleStateChange = (value) => {
    setSelectedStates((prevStates) => {
      if (prevStates.includes(value)) {
        return prevStates.filter((state) => state !== value);
      }
      return [...prevStates, value];
    });
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
                onSelect={setSelectedCity}
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
          <div>
            <TemplatesList
              templates={templates}
              sendTemplate={setSelectedTemplate}
            />
          </div>

          <div className="flex flex-col w-full">
            <StateSelection
              selectedStates={selectedStates}
              setSelectedStates={setSelectedStates}
            />
            <UserMessagePanel
              selectedIds={selectedIds}
              selectedTemplate={selectedTemplate}
              onSendMessages={handleSendMessages}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardUsers;
