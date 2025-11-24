import React, { useState } from 'react';
import { LearningStep } from '../types';
import CodeViewer from './CodeViewer';
import AITutor from './AITutor';
import SimulationPanel from './SimulationPanel';
import { PanelRightOpen, PanelRightClose, PenLine, Code2, Smartphone, Lightbulb } from 'lucide-react';

interface StepContentProps {
  step: LearningStep;
}

type Tab = 'code' | 'app';

const StepContent: React.FC<StepContentProps> = ({ step }) => {
  const [showTutor, setShowTutor] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('code');
  const [notes, setNotes] = useState<string>(() => localStorage.getItem(`notes-${step.id}`) || '');

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setNotes(newVal);
    localStorage.setItem(`notes-${step.id}`, newVal);
  };

  const codeContext = step.codeSnippets.map(s => s.code).join('\n');

  return (
    <div className="flex h-full overflow-hidden bg-slate-950">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-800 bg-slate-900 px-6 pt-2 flex-shrink-0">
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 text-sm font-medium transition-colors ${
              activeTab === 'code' 
                ? 'border-indigo-500 text-white' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 size={16} />
            Implementation
          </button>
          <button
            onClick={() => setActiveTab('app')}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 text-sm font-medium transition-colors ${
              activeTab === 'app' 
                ? 'border-indigo-500 text-white' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone size={16} />
            Live Preview (Notepad)
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto relative">
          
          {activeTab === 'code' && (
            <div className="max-w-6xl mx-auto p-8 pb-32">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">{step.title}</h1>
                <p className="text-xl text-indigo-400">{step.subtitle}</p>
              </div>

              <div className="prose prose-invert prose-slate max-w-none mb-10">
                {step.content}
                <div className="mt-6 bg-slate-900/50 border-l-4 border-indigo-500 p-4 rounded-r-lg">
                   <p className="text-slate-300 text-sm italic">{step.description}</p>
                </div>
              </div>

              <div className="space-y-12">
                {step.codeSnippets.map((snippet, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                         Interactive Code Implementation
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
                        <Lightbulb size={12} />
                        Tip: Use 'Split View' to see the solution while typing!
                      </div>
                    </div>
                    
                    <CodeViewer 
                      key={snippet.filename} 
                      code={snippet.code} 
                      skeleton={snippet.skeleton}
                      language={snippet.language} 
                      filename={snippet.filename} 
                    />
                  </div>
                ))}
              </div>

              {/* Learning Notes */}
              <div className="mt-16 pt-8 border-t border-slate-800">
                <div className="flex items-center gap-2 mb-4 text-slate-400">
                  <PenLine size={18} />
                  <span className="font-semibold text-sm uppercase tracking-wider">Learning Notes</span>
                </div>
                <textarea
                  value={notes}
                  onChange={handleNoteChange}
                  placeholder={`Jot down what you learned about ${step.title}...`}
                  className="w-full h-32 bg-slate-900 border border-slate-800 rounded-lg p-4 text-slate-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition-all placeholder-slate-600 font-mono text-sm"
                />
              </div>
              
              {/* Call to Action for Next Tab */}
              {step.simulation?.type !== 'none' && (
                <div className="mt-8 flex justify-end">
                   <button 
                     onClick={() => setActiveTab('app')}
                     className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-lg shadow-indigo-900/20"
                   >
                     <Smartphone size={18} />
                     Test this code in Notepad
                   </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'app' && (
            <div className="h-full">
              <SimulationPanel config={step.simulation} />
            </div>
          )}
        </div>
      </div>

      {/* AI Tutor Toggle */}
      <div className={`relative transition-all duration-300 ease-in-out border-l border-slate-800 bg-slate-900 ${showTutor ? 'w-80 md:w-96' : 'w-0'}`}>
         <div className="absolute -left-10 top-14 z-10">
            <button 
              onClick={() => setShowTutor(!showTutor)}
              className="p-2 bg-slate-800 border border-slate-700 text-slate-400 hover:text-white rounded-l-lg shadow-lg"
              title={showTutor ? "Close AI Tutor" : "Open AI Tutor"}
            >
              {showTutor ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
            </button>
         </div>
         <div className="h-full w-full overflow-hidden">
            <AITutor context={step.description} codeContext={codeContext} />
         </div>
      </div>
    </div>
  );
};

export default StepContent;