export const SpentAmountInput = ({ value, onChange }) => {
    const handleChange = (e) => {
      const rawValue = e.target.value.replace(/[^0-9]/g, '');
      onChange(Number(rawValue));
      localStorage.setItem('spentAmount', rawValue);
    };
  
    const formatter = new Intl.NumberFormat('es-CO');
    const displayValue = value ? formatter.format(value) : '';
  
    return (
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        placeholder="$ Gasto Total"
        className="h-fit w-36 bg-slate-800 text-white text-[0.9rem] border border-slate-600 rounded-lg p-2 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
      />
    );
  };
  