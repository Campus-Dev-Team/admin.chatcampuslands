export const StepIndicator = ({ number, active, text, disabled }) => (
  <div className={`flex justify-center items-center h-full ${disabled ? 'opacity-50' : ''}`}>
    <div className={`
      w-8 h-8 rounded-full flex items-center justify-center mr-2
      ${active ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-300'}
    `}>
      {number}
    </div>
    <span className="text-slate-200 text-sm">{text}</span>
  </div>
);