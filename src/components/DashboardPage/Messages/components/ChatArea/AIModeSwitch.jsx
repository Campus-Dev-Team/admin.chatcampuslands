import { CustomSwitch } from '../../../components/CustomSwitch';

const AIModeSwitch = ({ isAIEnabled, toggleAI, disabled = false }) => (
  <CustomSwitch
    isChecked={!isAIEnabled}
    onToggle={toggleAI}
    leftLabel="Admin"
    rightLabel="IA"
    className="bg-slate-800/50 p-2 rounded-lg"
    disabled={disabled}
  />
);

export default AIModeSwitch