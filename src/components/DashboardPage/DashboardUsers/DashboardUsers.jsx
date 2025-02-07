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
import { StepIndicator } from "./components/StepIndicator";

export const DashboardUsers = () => {
  // Basic states
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [templates, setTemplates] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);

  // User handling states
  const [currentState, setCurrentState] = useState(null);
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

  // Keep using the existing city-specific endpoints
  const handleGetUsersByState = async (currentState) => {
    if (!selectedCity) return;

    const usersToFilter = isExcelMode ? addressee : originalUsers;
    const dataUsers = {
      status: currentState,
      list: usersToFilter
        .map((user) => cleanPhoneNumber(user.phone))
        .filter(Boolean),
    };

    try {
      const response =
        selectedCity === "Bogota"
          ? await getUsersByStateBogota(dataUsers)
          : await getUsersByStateBucaramanga(dataUsers);

      if (currentState === "NO_REGISTRADO") {
        const matchingUsers = usersToFilter.filter(user => 
          response.data.users.includes(cleanPhoneNumber(user.phone))
        );
        
        setAddressee(
          matchingUsers.map((user, index) => ({
            id: index + 1,
            username: user.name || user.username,
            phone: cleanPhoneNumber(user.phone)
          }))
        );
      } else {
        setAddressee(
          response.data.users.map((user, index) => ({
            id: index + 1,
            username: user.name,
            phone: cleanPhoneNumber(user.phone),
          }))
        );
      }
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      setFilteredUsers([]);
      setAddressee(originalUsers);
    }
  };

  // Update city handler
  const handleCityChange = (newCity) => {
    setSelectedCity(newCity);
    if (currentState) {
      handleGetUsersByState(currentState);
      console.log(newCity, currentState, selectedCity);
    } else {
      // If no state is selected, keep original users
      setAddressee(originalUsers);
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
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto p-6">
        {/* Header Section */}
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center mb-8">
          <TitleHeader title="Mensajes masivos" />
          <div className="flex items-center mb-4 gap-3">
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
              active={selectedCity && !currentState}
              text="Selecciona el estado"
              disabled={!selectedCity}
            />
          </div>
          <DataSourceSwitch
            isExcelMode={isExcelMode}
            setIsExcelMode={setIsExcelMode}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Templates */}
          <div className="col-span-12 lg:col-span-4">
            <TemplatesList
              templates={templates}
              sendTemplate={setSelectedTemplate}
            />
          </div>

          {/* Right Panel - User Selection & Messages */}
          <div className="col-span-12 lg:col-span-8">
            {/* Filters Bar */}
            {/* In DashboardUsers.jsx */}
            <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
              <StateSelection
                currentState={currentState}
                setCurrentState={setCurrentState}
                onStateSelect={handleGetUsersByState}
                selectedCity={selectedCity}
                setSelectedCity={handleCityChange}
                disabled={!selectedTemplate}
              />
            </div>

            {/* User List or Excel Upload */}
            <div className="bg-slate-800/50 rounded-lg">
              {isExcelMode ? (
                excelData ? (
                  <UserMessagePanel
                    selectedUsers={addressee}
                    selectedTemplate={selectedTemplate}
                    onSendMessages={handleSendMessages}
                  />
                ) : (
                  <ExcelUpload onDataProcessed={handleExcelData} />
                )
              ) : (
                <UserMessagePanel
                  selectedUsers={addressee}
                  selectedTemplate={selectedTemplate}
                  onSendMessages={handleSendMessages}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DataSourceSwitch = ({ isExcelMode, setIsExcelMode }) => (
  <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg">
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

export default DashboardUsers;
