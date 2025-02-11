import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export const SendMessageButton = ({ selectedTemplate, citySelected, stateSelected, onSendMessages }) => {
  const [isSending, setIsSending] = useState(false);

  const handleClick = async () => {
    setIsSending(true);
    try {
      await onSendMessages();
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Button
      className="w-full bg-cyan-500 hover:bg-cyan-600 text-white disabled:bg-slate-600"
      disabled={!selectedTemplate || !citySelected || !stateSelected || isSending}
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
  );
};

export default SendMessageButton;