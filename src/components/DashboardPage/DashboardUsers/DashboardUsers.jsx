import { useEffect, useState } from "react";
import { TitleHeader } from "../components/TitleHeader";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TemplatesList } from "@/components/DashboardPage/DashboardUsers/components/TemplatesList";
import { getAllTemplates, sendTemplates } from "@/services/templateService";
import { UserMessagePanel } from "./components/UserMessagePanel";
import {
  getAllusers,
  getUsersByStateBogota,
  getUsersByStateBucaramanga,
} from "@/services/userService";
import { StateSelection } from "./components/StateSelection";
import ExcelUpload from "./components/ExcelUpload";

export const DashboardUsers = () => {
  // Estados básicos
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [selectedCity, setSelectedCity] = useState("Bucaramanga");
  const [loading, setLoading] = useState(false);
  
  // Estados para el manejo de usuarios
  const [currentState, setCurrentState] = useState("Registrados");
  const [usersIza, setUsersIza] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredNumbers, setFilteredNumbers] = useState([]);
  
  // Estados para el manejo de Excel
  const [isExcelMode, setIsExcelMode] = useState(false);
  const [excelData, setExcelData] = useState(null);
  const [selectedStates, setSelectedStates] = useState([]);

  // Utilidades para el manejo de números telefónicos
  const cleanPhoneNumber = (phone) => {
    if (!phone) return null;
    let phoneStr = phone.toString();
    if (phoneStr.startsWith("57")) {
      phoneStr = phoneStr.slice(2);
    }
    return phoneStr.length === 10 ? phoneStr : "0";
  };

  const add57ToPhone = (phone) => {
    let phoneStr = phone.toString();
    return phoneStr.startsWith("57") ? phoneStr : `57${phoneStr}`;
  };

  // Cargar usuarios de IZA
  useEffect(() => {
    const loadUsersIza = async () => {
      try {
        const usersData = await getAllusers();
        setUsersIza(usersData.data);
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!isExcelMode) {
      loadUsersIza();
    }
  }, [isExcelMode]);

  // Cargar plantillas
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

  const handleGetUsersByState = async (currentState) => {
    if (!selectedCity) {
      console.warn("Por favor selecciona una ciudad");
      return;
    }

    const cleanedNumbers = usersIza
      .map((user) => cleanPhoneNumber(user.phone))
      .filter((number) => number !== null);

    setFilteredNumbers(cleanedNumbers);

    const dataUsers = {
      status: currentState,
      list: cleanedNumbers,
    };

    try {
      const response =
        selectedCity === "Bucaramanga"
          ? await getUsersByStateBucaramanga(dataUsers)
          : await getUsersByStateBogota(dataUsers);
      
      const formattedUsers = response.data.users.map((user, index) => ({
        id: index + 1,
        username: user.name || user.email.split("@")[0],
        phone: cleanPhoneNumber(user.phone),
      }));

      setUsersIza(formattedUsers);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      setFilteredUsers([]);
    }
  };

  const handleSendMessages = async () => {
    const dataToSend = isExcelMode ? excelData : usersIza;
    const phoneNumbers = dataToSend
      .map((user) => add57ToPhone(user.phone || user.telefono))
      .filter((number) => number !== null);

    let dataMasiveMessage = {
      toList: phoneNumbers,
      template: selectedTemplate,
    };

    try {
      const response = await sendTemplates(dataMasiveMessage);
      console.log("respuesta al enviar mensajes masivos", response);
    } catch (error) {
      console.error("error al enviar mensajes masivos", error);
    }
  };

  const handleExcelData = (data) => {
    setExcelData(data);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-900 h-screen overflow-y-auto scrollbar-custom">
      <div className="mx-auto space-y-8">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <TitleHeader title="Mensajes masivos" />
          <div className="flex items-center gap-6">
            <div className="w-[180px]">
              <select
                value={selectedCity}
                className="h-fit w-fit bg-slate-800 text-white text-[0.9rem] border border-slate-600 rounded-lg p-2 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                onChange={(e) => setSelectedCity(e.target.value)}
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
                checked={!isExcelMode}
                onCheckedChange={(checked) => {
                  setIsExcelMode(!checked);
                  if (checked) {
                    setExcelData(null);
                  }
                }}
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

          <div className="flex flex-col w-full my-6 h-auto lg:h-[30em]">
            {isExcelMode ? (
              excelData ? (
                <>
                  <StateSelection
                    currentState={currentState}
                    setCurrentState={setCurrentState}
                    onStateSelect={handleGetUsersByState}
                    selectedCity={selectedCity}
                  />
                  <UserMessagePanel
                    selectedUsers={excelData}
                    selectedTemplate={selectedTemplate}
                    onSendMessages={handleSendMessages}
                  />
                </>
              ) : (
                <ExcelUpload onDataProcessed={handleExcelData} />
              )
            ) : (
              <>
                <StateSelection
                  currentState={currentState}
                  setCurrentState={setCurrentState}
                  onStateSelect={handleGetUsersByState}
                  selectedCity={selectedCity}
                />
                <UserMessagePanel
                  selectedUsers={usersIza}
                  selectedTemplate={selectedTemplate}
                  onSendMessages={handleSendMessages}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardUsers;