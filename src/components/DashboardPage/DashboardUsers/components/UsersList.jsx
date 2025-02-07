export const UserList = ({ selectedUsers }) => {
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
    <div className="h-[450px] overflow-hidden">
      <div className="h-full overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
        {filteredUsers.map((user) => (
          <div
            key={user.uniqueKey}
            className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-lg"
          >
            <span className="text-slate-300 min-w-8">{user.displayIndex}</span>
            <span className="text-slate-300 flex-1">{user.displayName}</span>
            <span className="text-slate-400 font-mono">{user.phoneNumber}</span>
          </div>
        ))}
      </div>
    </div>
  );
};