import { Card } from "@/components/ui/card";

export const UserList = ({ selectedIds, excelData }) => {
  if (!excelData?.length && !selectedIds?.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-400">No hay usuarios seleccionados</p>
      </div>
    );
  }

  if (excelData?.length) {
    return (
      <div className="h-full overflow-auto">
        <div className="w-full border border-slate-700 rounded-lg">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] bg-slate-800 p-3 border-b border-slate-700">
            <div className="text-slate-200 font-medium">Teléfono</div>
            {Object.keys(excelData[0])
              .filter(key => key !== 'celular' && key !== 'phone')
              .map(header => (
                <div key={header} className="text-slate-200 font-medium">
                  {header}
                </div>
              ))}
          </div>
          <div className="divide-y divide-slate-700">
            {excelData.map((row, index) => (
              <div key={index} className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] p-3 hover:bg-slate-800/50">
                <div className="text-slate-300">{row.celular || row.phone}</div>
                {Object.entries(row)
                  .filter(([key]) => key !== 'celular' && key !== 'phone')
                  .map(([key, value]) => (
                    <div key={key} className="text-slate-300">
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

  return (
    <div className="h-full overflow-auto">
      <div className="w-full border border-slate-700 rounded-lg">
        <div className="bg-slate-800 p-3 border-b border-slate-700">
          <div className="text-slate-200 font-medium">ID</div>
        </div>
        <div className="divide-y divide-slate-700">
          {selectedIds.map((id) => (
            <div key={id} className="p-3 hover:bg-slate-800/50">
              <div className="text-slate-300">{id}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};