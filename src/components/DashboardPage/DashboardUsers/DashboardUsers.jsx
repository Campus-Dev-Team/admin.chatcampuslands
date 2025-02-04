import { useEffect, useState } from "react";
import { TitleHeader } from '../components/TitleHeader';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MessageCircle, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export const DashboardUsers = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [templates] = useState([
    {
      id: "1",
      title: "Bienvenida Nuevos Estudiantes",
      content: "Estimado estudiante, ¡Bienvenido a nuestra institución! Nos complace informarte que tu proceso de matrícula ha sido completado exitosamente. A continuación, encontrarás información importante sobre el inicio de clases...",
    },
    {
      id: "2",
      title: "Recordatorio de Pago",
      content: "Querido estudiante, este es un recordatorio amistoso sobre el próximo vencimiento de tu cuota mensual. Por favor, asegúrate de realizar el pago antes de la fecha límite para evitar recargos...",
    },
    {
      id: "3",
      title: "Evento Campus Virtual",
      content: "Te invitamos a participar en nuestro próximo evento virtual donde discutiremos las últimas tendencias en educación online y las mejores prácticas para el aprendizaje remoto...",
    }
  ]);

  const [selectedIds] = useState([
    "319700312",
    "319700312",
    "319700312",
    "319700312",
    "319700312",
    "319700312",
    "319700312",
    "319700312",
    "319700312",
    "319700312",
  ]);

  return (
    <div className="p-6 space-y-6 bg-slate-900 overflow-y-scroll scrollbar-custom">
      <div className="mx-auto space-y-8">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <TitleHeader title="Mensajes masivos" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template List Section */}
          <Card className="col-span-1 bg-slate-800/50 border-slate-700">
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-white">Lista de Plantillas</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-500 border-cyan-500/20"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Plantilla
                </Button>
              </div>
              
              <RadioGroup 
                value={selectedTemplate} 
                onValueChange={setSelectedTemplate}
                className="space-y-4"
              >
                {templates.map((template) => (
                  <div 
                    key={template.id}
                    className="relative flex items-start space-x-4 p-4 rounded-lg bg-slate-700/50 border border-slate-600 hover:border-cyan-500/50 transition-colors duration-200"
                  >
                    <RadioGroupItem 
                      value={template.id} 
                      id={template.id}
                      className="mt-1 border-slate-500"
                    />
                    <div className="flex-1 min-w-0">
                      <Label 
                        htmlFor={template.id}
                        className="text-base font-semibold text-slate-200 block mb-1 cursor-pointer hover:text-slate-100"
                      >
                        {template.title}
                      </Label>
                      <p className="text-sm text-slate-400 line-clamp-2 mb-2 group-hover:text-slate-300">
                        {template.content}
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-cyan-500 hover:text-cyan-400 p-0 h-auto font-normal hover:bg-transparent"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Ver más
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl bg-slate-800 border-slate-700">
                          <DialogHeader>
                            <DialogTitle className="text-xl text-slate-200">
                              {template.title}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="mt-6 space-y-4">
                            <div className="prose prose-invert max-w-none">
                              <p className="text-slate-300 leading-relaxed">
                                {template.content}
                              </p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </Card>

          {/* Message Preview Section */}
          <Card className="col-span-2 bg-slate-800/50 border-slate-700">
            <div className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Estado Usuario</h3>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <Label className="text-sm text-slate-300">Registrado</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-slate-500"></div>
                      <Label className="text-sm text-slate-300">No Registrado</Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {selectedIds.map((id, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-lg"
                    >
                      <span className="text-slate-300 min-w-8">{index + 1}</span>
                      <span className="text-slate-300 flex-1">NOMBRE</span>
                      <span className="text-slate-400 font-mono">{id}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <Button 
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                  disabled={!selectedTemplate}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Enviar Mensajes
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardUsers;