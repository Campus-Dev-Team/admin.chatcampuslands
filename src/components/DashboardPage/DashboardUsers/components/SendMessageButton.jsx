import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import ProgressBar from "./ProgressBar";
import { useSendProgress } from "@/hooks/useSendProgress";

export const SendMessageButton = ({ 
  selectedTemplate, 
  citySelected, 
  stateSelected, 
  usersExist, 
  onSendMessages, 
  isLoading 
}) => {
  const [isSending, setIsSending] = useState(false);
  const { progress, simulateProgress, resetProgress } = useSendProgress();

  const handleClick = async () => {
    setIsSending(true);
    try {
      // Iniciar simulación de progreso
      simulateProgress(usersExist);
      // Ejecutar la función real de envío
      await onSendMessages();
    } finally {
      setIsSending(false);
      // Resetear el progreso después de un tiempo
      setTimeout(() => {
        resetProgress();
      }, 3000);
    }
  };
  
  const falseClick = () =>{
    // Iniciar simulación de progreso
    simulateProgress(usersExist);
  }

  return (
    <div className="space-y-4 flex flex-col justify-center items-center">
            
      {isSending && progress.total > 0 && (
        <ProgressBar
          progress={progress.current}
          total={usersExist}
          completed={progress.completed}
          failed={progress.failed}
        />
      )}
      <Button
        className="w-full bg-cyan-500 hover:bg-cyan-600 text-white disabled:bg-slate-600"
        disabled={!selectedTemplate || !citySelected || !stateSelected || usersExist === 0 || isLoading || isSending}
        onClick={handleClick}
      >
        {isSending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando Mensajes...
          </>
        ) : (
          'Enviar Mensajes'
        )}
      </Button>
    </div>
  );
};