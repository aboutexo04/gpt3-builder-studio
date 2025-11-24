import React, { useState } from 'react';
import { Layout, PanelLeftOpen } from 'lucide-react';
import Sidebar from './components/Sidebar';
import StepContent from './components/StepContent';
import { LEARNING_STEPS } from './constants';
import { StepId } from './types';

const App: React.FC = () => {
  const [activeStepId, setActiveStepId] = useState<StepId>('intro');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

  const activeStep = LEARNING_STEPS.find(s => s.id === activeStepId) || LEARNING_STEPS[0];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200 font-sans">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full h-14 bg-slate-900 border-b border-slate-800 z-50 flex items-center px-4 justify-between">
        <span className="font-bold text-lg text-indigo-400">GPT-3 Builder</span>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-400">
          <Layout size={24} />
        </button>
      </div>

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-40 h-full bg-slate-900 border-r border-slate-800 transition-all duration-300 ease-in-out flex-shrink-0
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isDesktopSidebarOpen ? 'md:w-64' : 'md:w-0 md:border-r-0 md:overflow-hidden'}
      `}>
        <Sidebar 
          activeStepId={activeStepId} 
          onSelectStep={(id) => {
            setActiveStepId(id);
            setIsMobileMenuOpen(false);
          }}
          onClose={() => setIsDesktopSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden pt-14 md:pt-0 relative bg-slate-950">
        
        {/* Floating Open Sidebar Button (Desktop Only) */}
        {!isDesktopSidebarOpen && (
          <button 
            onClick={() => setIsDesktopSidebarOpen(true)}
            className="hidden md:flex absolute top-3 left-3 z-50 p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 shadow-xl transition-all"
            title="Expand Sidebar"
          >
            <PanelLeftOpen size={20} />
          </button>
        )}

        <StepContent step={activeStep} />
      </main>
    </div>
  );
};

export default App;