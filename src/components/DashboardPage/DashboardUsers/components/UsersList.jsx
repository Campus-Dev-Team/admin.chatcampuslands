export const UserList = ({ selectedIds, data }) => {
  if (!data?.length && !selectedIds?.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-400">No hay usuarios seleccionados</p>
      </div>
    );
  }

  if (data?.length) {
    return (
      <div className="h-full overflow-auto">
        <div className="w-full border border-slate-700 rounded-lg">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] bg-slate-800 p-3 border-b border-slate-700">
            {Object.keys(data[0]).map(header => (
              <div key={header} className="text-slate-200 font-medium capitalize">
                {header}
              </div>
            ))}
          </div>
          <div className="divide-y divide-slate-700">
            {data.map((row, index) => (
              <div key={index} className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] p-3 hover:bg-slate-800/50">
                {Object.values(row).map((value, i) => (
                  <div key={i} className="text-slate-300">
                    {value}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};