export const UserList = ({ selectedUsers }) => {
  const cleanPhoneNumber = (phone) => {
    if (!phone) return null;
    let phoneStr = phone.toString();
    if (phoneStr.startsWith("57")) {
      phoneStr = phoneStr.slice(2);
    }
    return phoneStr.length === 10 ? phoneStr : "Numero no valido";
  };

  // Filter out invalid numbers
  console.log(selectedUsers);
  
  const filteredUsers = selectedUsers.filter(
    (user) => cleanPhoneNumber(user.phone) !== null
  );

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
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
  );
};