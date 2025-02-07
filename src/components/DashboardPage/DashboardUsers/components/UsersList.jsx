export const UserList = ({ selectedUsers }) => {
  const cleanPhoneNumber = (phone) => {
    if (!phone) return null;
    let phoneStr = phone.toString();
    if (phoneStr.startsWith("57")) {
      phoneStr = phoneStr.slice(2);
    }
    return phoneStr.length === 10 ? phoneStr : "Numero no valido";
  };
  
  const filteredUsers = selectedUsers.filter(
    (user) => cleanPhoneNumber(user.phone) !== null
  );

  return (
    <div className="h-[450px] overflow-hidden">
      <div className="h-full overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-lg"
          >
            <span className="text-slate-300 min-w-8">{user.id}</span>
            <span className="text-slate-300 flex-1">
              {user?.username || user?.name}
            </span>
            <span className="text-slate-400 font-mono">
              {cleanPhoneNumber(user.phone)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};