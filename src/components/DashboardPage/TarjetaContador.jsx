export const TarjetaContador = ({ userList }) => {
    // Contar los mensajes y usuarios
    const totalUsers = userList.length;

    // Contar el total de mensajes recorriendo cada usuario y sumando la cantidad de mensajes
    const totalMessages = userList.reduce((total, user) => total + (user.Messages ? user.Messages.length : 0), 0);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            <div className="p-4 bg-[#162033] text-white rounded-lg shadow-md flex flex-col items-center justify-center">
                <h2 className="text-xl font-bold">Total Mensajes</h2>
                <p className="text-3xl font-semibold text-cyan-400">{totalMessages}</p>
            </div>
            <div className="p-4 bg-[#162033] text-white rounded-lg shadow-md flex flex-col items-center justify-center">
                <h2 className="text-xl font-bold">Total Usuarios</h2>
                <p className="text-3xl font-semibold text-cyan-400">{totalUsers}</p>
            </div>
        </div>
    );
};
