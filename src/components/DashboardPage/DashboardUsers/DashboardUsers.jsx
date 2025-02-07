import { useEffect, useState } from "react";
import { TitleHeader } from "../components/TitleHeader";
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
  // Basic states
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [templates, setTemplates] = useState([]);
  const [selectedCity, setSelectedCity] = useState("Bucaramanga");
  
  // User handling states
  const [currentState, setCurrentState] = useState("Registrados");
  const [originalUsers, setOriginalUsers] = useState([]); // Store original user list
  const [addressee, setAddressee] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  
  // Excel handling states
  const [isExcelMode, setIsExcelMode] = useState(false);
  const [excelData, setExcelData] = useState(null);

  // Phone number utilities
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

  // Load IZA users
  useEffect(() => {
    const loadUsersIza = async () => {
      try {
        const usersData = await getAllusers();
        setOriginalUsers(usersData.data); // Store original data
        setAddressee(usersData.data);
      } catch (error) {
        console.error("Error loading users:", error);
      }
    };

    if (!isExcelMode) {
      loadUsersIza();
    }
  }, [isExcelMode]);

  // Load templates
  useEffect(() => {
    loadTemplates();
  }, []);
  
  const loadTemplates = async () => {
    try {
      const templatesData = await getAllTemplates();
      setTemplates(templatesData.data);
    } catch (error) {
      console.error("Error loading templates:", error);
    }
  };

  const handleGetUsersByState = async (currentState) => {
    if (!selectedCity) {
      console.warn("Por favor selecciona una ciudad");
      return;
    }

    const usersToFilter = isExcelMode ? addressee : originalUsers;
    const cleanedNumbers = usersToFilter
      .map((user) => cleanPhoneNumber(user.phone))
      .filter((number) => number !== null);

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
        username: user.name || user.email?.split("@")[0] || 'N/A',
        phone: cleanPhoneNumber(user.phone),
      }));

      setAddressee(formattedUsers);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      setFilteredUsers([]);
      // Reset to original list on error
      setAddressee(isExcelMode ? addressee : originalUsers);
    }
  };

  const handleSendMessages = async () => {
    const phoneNumbers = addressee
      .map((user) => add57ToPhone(user.phone || user.telefono))
      .filter((number) => number !== null);

    const dataMasiveMessage = {
      toList: phoneNumbers,
      template: selectedTemplate,
    };

    try {
      const response = await sendTemplates(dataMasiveMessage);
      console.log("Mensajes masivos enviados exitosamente", response);
    } catch (error) {
      console.error("Error al enviar mensajes masivos", error);
    }
  };

  const handleExcelData = (data) => {
    setOriginalUsers(data); // Store original Excel data
    setAddressee(data);
    setExcelData(true);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-900 h-screen overflow-y-auto scrollbar-custom">
      <div className="mx-auto space-y-8">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <TitleHeader title="Mensajes masivos" />
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
                  setAddressee([]);
                  setOriginalUsers([]);
                }
              }}
              className="data-[state=checked]:bg-cyan-500"
            />
            <Label htmlFor="data-source" className="text-slate-200">
              Datos IZA
            </Label>
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
                    setSelectedCity={setSelectedCity}
                  />
                  <UserMessagePanel
                    selectedUsers={addressee}
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
                  setSelectedCity={setSelectedCity}
                />
                <UserMessagePanel
                  selectedUsers={addressee}
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