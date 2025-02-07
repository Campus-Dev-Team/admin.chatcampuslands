import { Button } from "@/components/ui/button";
import { Plus, MessageCircle, ChevronDown } from "lucide-react";

export const SendMessageButton = ({ selectedTemplate, citySelected, stateSelected, onSendMessages }) => {
  return (
    <Button
      className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
      disabled={!selectedTemplate || !citySelected || !stateSelected}
      onClick={onSendMessages}
    >
      Enviar Mensajes
    </Button>
  );
};

export default SendMessageButton;
