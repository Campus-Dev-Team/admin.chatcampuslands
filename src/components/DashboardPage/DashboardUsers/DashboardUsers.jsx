import { useEffect, useState } from "react";
import { TitleHeader } from "../components/TitleHeader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import { DashboardHeader } from "./components/DashboardHeader";


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
        setOriginalUsers(usersData.data);
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

  useEffect(() => {
    if (!isExcelMode) {
      setExcelData(null); // Limpia los datos de Excel cuando cambias a IZA
    }
  }, [isExcelMode]);


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

    let usersToFilter = isExcelMode ? excelData : originalUsers; // Usar Excel si está activo

    if (!usersToFilter || usersToFilter.length === 0) {
      console.warn("No hay usuarios para enviar en la consulta.");
      return;
    }

    const dataUsers = {
      status: currentState,
      list: usersToFilter
        .map((user) => cleanPhoneNumber(user.phone))
        .filter(Boolean),
    };

    if (dataUsers.list.length === 0) {
      console.warn("El array 'list' está vacío. No se enviará la petición.");
      return;
    }

    try {
      console.log('Enviando datos:', dataUsers);

      const response =
        selectedCity === "Bogota"
          ? await getUsersByStateBogota(dataUsers)
          : await getUsersByStateBucaramanga(dataUsers);

      if (!response.data || !response.data.users) {
        console.warn("La respuesta de la API no contiene usuarios.");
        setAddressee([]); // Mostrar vacío si la API responde vacío
        return;
      }

      if (currentState === "NO_REGISTRADO") {
        const matchingUsers = usersToFilter.filter(user =>
          response.data.users.includes(cleanPhoneNumber(user.phone))
        );

        setAddressee(
          matchingUsers.map((user, index) => ({
            id: index + 1,
            username: user.name || user.username,
            phone: cleanPhoneNumber(user.phone),
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
      setAddressee([]); // Mostrar vacío en caso de error
    }
  };


  const handleCityChange = (newCity) => {
    setSelectedCity(newCity);
    setCurrentState(null); // Restablecer el estado cuando cambia la ciudad
    // setAddressee(isExcelMode ? excelData : originalUsers); // Restaurar lista de usuarios
  };


  // Ejecutar la función cuando selectedCity cambie
  useEffect(() => {
    if (selectedCity && currentState) {
      handleGetUsersByState(currentState);
      console.log("Ciudad seleccionada:", selectedCity);
    }
  }, [selectedCity, currentState]);

  const handleSendMessages = async () => {
    const phoneNumbers = addressee
      .map((user) => add57ToPhone(user.phone || user.telefono))
      .filter((number) => number !== null);
  
    const dataMasiveMessage = {
      toList: phoneNumbers,
      template: selectedTemplate,
    };
  
    //in reseterar los selects
    setSelectedCity(null)
    setCurrentState(null)

    // Mostrar toast de "Enviando mensaje..."
    const sendingToastId = toast.info("📨 Enviando mensaje...", {
      position: "top-right",
      autoClose: false, // No se cierra hasta recibir respuesta
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      theme: "dark",
    });
  
    try {
      const response = await sendTemplates(dataMasiveMessage);
      console.log("Mensajes masivos enviados exitosamente", response);
  
      // Cerrar el toast de "Enviando mensaje..."
      toast.dismiss(sendingToastId);
  
      // Verificar la respuesta
      const { success, failed } = response.data;
  
      if (success.length > 0 && failed.length === 0) {
        toast.success(`✅ ${success.length} mensajes enviados exitosamente!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
      } else if (failed.length > 0) {
        toast.warn(`⚠️ ${failed.length} mensajes no pudieron enviarse.`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
      }
  
    } catch (error) {
      console.error("Error al enviar mensajes masivos", error);
  
      // Cerrar el toast de "Enviando mensaje..."
      toast.dismiss(sendingToastId);
  
      // Mostrar notificación de error
      toast.error("❌ Error al enviar los mensajes", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
  };

  const handleExcelData = (data) => {
    setOriginalUsers([]); // Limpiar usuarios originales para evitar mezclas
    setSelectedCity(null)
    setCurrentState(null)
    setExcelData(data); // Guardar los datos completos de Excel
    setAddressee(data); // Usarlos como destinatarios iniciales
  };



  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto p-6 flex flex-col justify-center ">
      <ToastContainer />
        {/* Header Section */}
        <DashboardHeader
          selectedTemplate={selectedTemplate}
          selectedCity={selectedCity}
          selectState = {currentState}
          isExcelMode={isExcelMode}
          setIsExcelMode={setIsExcelMode}
        />

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
              {isExcelMode && !excelData ? (
                <ExcelUpload onDataProcessed={handleExcelData} />
              ) : (
                <UserMessagePanel
                  selectedUsers={addressee}
                  selectedTemplate={selectedTemplate}
                  citySelected={selectedCity}
                  stateSelected={currentState}
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



export default DashboardUsers;
