export const UserList = ({ selectedIds }) => {
  return (
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
  );
};

export default UserList;
