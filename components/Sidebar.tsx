import React from 'react';
import { LEARNING_STEPS } from '../constants';
import { StepId } from '../types';
import { CheckCircle2, Circle, PanelLeftClose } from 'lucide-react';

interface SidebarProps {
  activeStepId: StepId;
  onSelectStep: (id: StepId) => void;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeStepId, onSelectStep, onClose }) => {
  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 w-full overflow-y-auto">
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Curriculum</h2>
          <p className="text-sm text-slate-500 mt-1">PyTorch GPT Implementation</p>
        </div>
        <button 
          onClick={onClose}
          className="hidden md:block text-slate-500 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded"
          title="Collapse Sidebar"
        >
          <PanelLeftClose size={20} />
        </button>
      </div>
      <div className="flex-1 py-4">
        {LEARNING_STEPS.map((step, index) => {
          const isActive = step.id === activeStepId;
          const isPast = LEARNING_STEPS.findIndex(s => s.id === activeStepId) > index;
          
          return (
            <button
              key={step.id}
              onClick={() => onSelectStep(step.id)}
              className={`w-full text-left px-6 py-4 flex items-start gap-3 hover:bg-slate-800/50 transition-colors border-l-2 ${
                isActive 
                  ? 'bg-slate-800/80 border-indigo-500 text-white' 
                  : 'border-transparent text-slate-400'
              }`}
            >
              <div className={`mt-0.5 ${isActive ? 'text-indigo-400' : isPast ? 'text-emerald-500' : 'text-slate-600'}`}>
                {isPast ? <CheckCircle2 size={18} /> : step.icon}
              </div>
              <div>
                <span className={`block text-sm font-medium ${isActive ? 'text-white' : ''}`}>
                  {step.title}
                </span>
                <span className="block text-xs text-slate-500 mt-0.5">
                  {step.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      <div className="p-6 border-t border-slate-800 text-xs text-slate-600 text-center">
        v1.0.0 &bull; GPT-3 Builder Studio
      </div>
    </div>
  );
};

export default Sidebar;