import { MessageCircle } from "lucide-react";

export const UserList = ({ selectedUsers, stateSelected }) => {
  const cleanPhoneNumber = (phone) => {
    if (!phone) return null;
    let phoneStr = phone.toString();
    if (phoneStr.startsWith("57")) {
      phoneStr = phoneStr.slice(2);
    }
    return phoneStr.length === 10 ? phoneStr : "Numero no valido";
  };

  // Filter out users with invalid phone numbers and create unique keys
  const filteredUsers = selectedUsers
    .filter((user) => cleanPhoneNumber(user.phone || user.telefono) !== null)
    .map((user, index) => ({
      ...user,
      // Create a unique key using phone number and index as fallback
      uniqueKey: `${user.id || ''}-${user.phone || user.telefono || ''}-${index}`,
      // Ensure we have a display index
      displayIndex: user.id || (index + 1),
      // Handle different field names for name/username
      displayName: user.username || user.name || 'Sin nombre',
      // Handle different field names for phone
      phoneNumber: cleanPhoneNumber(user.phone || user.telefono)
    }));

  return (
    <div className="h-[80vh] md:h-[40vh] lg:h-[40vh] overflow-hidden">
      <div className="transition-all duration-300 ease-in-out h-full">
        {selectedUsers.length > 0 ? (
          <div className="animate-fadeIn flex flex-col h-full">
            <div className="mb-3 md:mb-4 p-2 md:p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg flex-shrink-0">
              <p className="text-blue-200 text-sm">
                Se enviará la plantilla a {selectedUsers.length} usuario{selectedUsers.length !== 1 ? 's' : ''} seleccionado{selectedUsers.length !== 1 ? 's' : ''}.
              </p>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
              {filteredUsers.map((user, index) => (
                <div
                  key={user.uniqueKey}
                  className="flex items-center gap-2 md:gap-4 p-2 md:p-3 bg-slate-700/30 rounded-lg"
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  <span className="text-slate-300 min-w-6 md:min-w-8 text-sm md:text-base">{user.displayIndex}</span>
                  <span className="text-slate-300 flex-1 text-sm md:text-base truncate">{user.displayName}</span>
                  <span className="text-slate-400 font-mono text-xs md:text-sm">{user.phoneNumber}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full animate-fadeIn">
            <div className="text-center space-y-2">
              <MessageCircle className="w-12 h-12 text-slate-500 mx-auto animate-bounce" />
              <p className="text-slate-400">No hay usuarios para mostrar</p>
              <p className="text-sm text-slate-500">Prueba cambiando la sede o el estado</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};