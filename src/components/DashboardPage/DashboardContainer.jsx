export const DashboardContainer = () => {
    // Datos de ejemplo
    const totalMessages = 1240; // Contador de mensajes
    const totalUsers = 320; // Contador de usuarios
    const userList = [
      {
        id: 1,
        name: "Juan Pérez",
        phone: "300-123-4567",
        age: 25,
        availability: "Available",
        contactWay: "Email",
      },
      {
        id: 2,
        name: "Ana Gómez",
        phone: "311-987-6543",
        age: 30,
        availability: "Busy",
        contactWay: "Phone",
      },
      {
        id: 3,
        name: "Carlos Torres",
        phone: "322-654-7890",
        age: 28,
        availability: "Available",
        contactWay: "WhatsApp",
      },
      // Agrega más usuarios según sea necesario
    ];
  
    return (
      <div className="p-6 space-y-6">
        {/* Tarjetas de Contadores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          <div className="p-4 bg-[#2A303C] text-white rounded-lg shadow-md flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold">Total Mensajes</h2>
            <p className="text-3xl font-semibold text-cyan-400">{totalMessages}</p>
          </div>
          <div className="p-4 bg-[#2A303C] text-white rounded-lg shadow-md flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold">Total Usuarios</h2>
            <p className="text-3xl font-semibold text-cyan-400">{totalUsers}</p>
          </div>
        </div>
  
        {/* Tabla de Usuarios */}
        <div className="overflow-x-auto bg-[#2A303C] text-white rounded-lg shadow-md">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-cyan-400">
                <th className="px-4 py-2">Usuario ID</th>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Teléfono</th>
                <th className="px-4 py-2">Edad</th>
                <th className="px-4 py-2">Disponibilidad</th>
                <th className="px-4 py-2">Método de Contacto</th>
              </tr>
            </thead>
            <tbody>
              {userList.map((user) => (
                <tr key={user.id} className="border-b border-gray-600 hover:bg-[#3B3F47]">
                  <td className="px-4 py-2">{user.id}</td>
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.phone}</td>
                  <td className="px-4 py-2">{user.age}</td>
                  <td
                    className={`px-4 py-2 ${
                      user.availability === "Available" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {user.availability}
                  </td>
                  <td className="px-4 py-2">{user.contactWay}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  