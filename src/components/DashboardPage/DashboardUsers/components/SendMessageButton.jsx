import { Button } from "@/components/ui/button";
import { Plus, MessageCircle, ChevronDown } from "lucide-react";

export const SendMessageButton = ({ selectedTemplate, onSendMessages }) => {
  return (
    <Button
      className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
      disabled={!selectedTemplate}
      onClick={onSendMessages}
    >
      <MessageCircle className="w-4 h-4 mr-2" />
      Enviar Mensajes
    </Button>
  );
};

export default SendMessageButton;
