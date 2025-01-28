import { MessageSquare, Users, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const TarjetaContador = ({ userList }) => {
  // Calcular estadísticas
  const totalUsers = userList.length;
  const totalMessages = userList.reduce((total, user) => total + (user.Messages ? user.Messages.length : 0), 0);
  const averageRate = totalMessages > 0 ? ((totalMessages / totalUsers) * 100).toFixed(2) : 0;

  // Definir datos de las tarjetas
  const stats = [
    { title: "Total Mensajes", icon: MessageSquare, value: totalMessages.toLocaleString(), color: "cyan" },
    { title: "Usuarios Totales", icon: Users, value: totalUsers.toLocaleString(), color: "cyan" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">{stat.title}</p>
                <p className={`text-2xl font-bold text-${stat.color}-400 mt-2`}>{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 text-${stat.color}-400 opacity-80`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};