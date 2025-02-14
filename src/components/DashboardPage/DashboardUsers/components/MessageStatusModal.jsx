import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, XCircle } from "lucide-react";

export const MessageStatusModal = ({ isOpen, onClose, successList, failedList, messageStatus }) => {
  const { successDetails, failedDetails } = messageStatus || { successDetails: [], failedDetails: [] };
  //console.log(failedDetails);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 text-slate-100 border-slate-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-100">
            Estado de Envío de Mensajes
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Successful Messages Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
              <h3 className="font-medium">Mensajes Enviados ({successList.length})</h3>
            </div>
            <div className="max-h-32 overflow-y-auto rounded-md border border-slate-700 bg-slate-900/50">
              <div className="p-4 space-y-2">
                {successList.length > 0 ? (
                  successDetails.map((detail, index) => (
                    <div key={index} className="flex items-center gap-2 text-slate-300">
                      <span>📱 {detail.number}</span>
                      <span className="text-slate-400">-</span>
                      <span className="text-emerald-400">{detail.name}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400">No hay mensajes enviados exitosamente</p>
                )}
              </div>
            </div>
          </div>

          {/* Failed Messages Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-red-400">
              <XCircle className="h-5 w-5" />
              <h3 className="font-medium">Mensajes Fallidos ({failedList.length})</h3>
            </div>
            <div className="max-h-32 overflow-y-auto rounded-md border border-slate-700 bg-slate-900/50">
              <div className="p-4 space-y-2">
                {failedList.length > 0 ? (
                  failedDetails.map((detail, index) => (
                    <div key={index} className="flex items-center gap-2 text-slate-300">
                      <span>📱 {detail.number}</span>
                      <span className="text-slate-400">-</span>
                      <span className="text-red-400">{detail.name || detail.displayName }</span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400">No hay mensajes fallidos</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageStatusModal;