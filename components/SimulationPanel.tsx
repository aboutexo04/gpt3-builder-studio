import React, { useState, useEffect } from 'react';
import { Play, Save, FolderOpen, Trash2, Bot, Loader2, FileText, AlertTriangle } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SimulationConfig } from '../types';

interface SimulationPanelProps {
  config?: SimulationConfig;
}

interface SavedNote {
  id: string;
  title: string;
  content: string;
  timestamp: number;
}

const SimulationPanel: React.FC<SimulationPanelProps> = ({ config }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>(() => {
    const saved = localStorage.getItem('gpt_builder_notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [showLoadMenu, setShowLoadMenu] = useState(false);

  useEffect(() => {
    localStorage.setItem('gpt_builder_notes', JSON.stringify(savedNotes));
  }, [savedNotes]);

  // Clear output when switching steps/configs
  useEffect(() => {
    setOutput('');
  }, [config]);

  const handleRun = async () => {
    if (!config || config.type === 'none' || !input.trim()) return;

    setLoading(true);
    setOutput('');

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `${config.systemPrompt}\n\nInput: ${input}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;

      setOutput(response.text() || "No response generated.");
    } catch (error) {
      setOutput("Error: Could not run simulation. Please check API Key.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!input.trim()) return;
    const title = input.split('\n')[0].substring(0, 20) + (input.length > 20 ? '...' : '');
    const newNote: SavedNote = {
      id: Date.now().toString(),
      title: title || 'Untitled Note',
      content: input,
      timestamp: Date.now()
    };
    setSavedNotes([newNote, ...savedNotes]);
  };

  const handleLoad = (note: SavedNote) => {
    setInput(note.content);
    setShowLoadMenu(false);
    setOutput(''); // Clear previous output on load
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedNotes(savedNotes.filter(n => n.id !== id));
  };

  if (!config) {
    return <div className="p-8 text-slate-500">Select a step to load the simulator.</div>;
  }

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200">
      {/* Toolbar */}
      <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900/50">
        <div className="flex items-center gap-2">
           <FileText className="text-indigo-400" size={18} />
           <span className="font-semibold text-sm">Smart Notepad</span>
           {config.type !== 'none' && (
             <span className="ml-2 px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs border border-indigo-500/30">
               Mode: {config.type.toUpperCase()}
             </span>
           )}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button 
              onClick={() => setShowLoadMenu(!showLoadMenu)}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors flex items-center gap-1"
              title="Load Note"
            >
              <FolderOpen size={16} />
              <span className="text-xs">Load</span>
            </button>
            
            {showLoadMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
                <div className="p-2 text-xs font-bold text-slate-500 border-b border-slate-700">SAVED NOTES</div>
                <div className="max-h-60 overflow-y-auto">
                  {savedNotes.length === 0 ? (
                    <div className="p-4 text-xs text-slate-500 text-center">No saved notes</div>
                  ) : (
                    savedNotes.map(note => (
                      <div 
                        key={note.id} 
                        onClick={() => handleLoad(note)}
                        className="px-4 py-3 hover:bg-slate-700 cursor-pointer border-b border-slate-700/50 last:border-0 group flex justify-between items-center"
                      >
                        <div>
                          <div className="text-sm font-medium text-slate-200 truncate w-40">{note.title}</div>
                          <div className="text-xs text-slate-500">{new Date(note.timestamp).toLocaleDateString()}</div>
                        </div>
                        <button 
                          onClick={(e) => handleDelete(note.id, e)}
                          className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          
          <button 
            onClick={handleSave}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors flex items-center gap-1"
            title="Save Note"
          >
            <Save size={16} />
            <span className="text-xs">Save</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto gap-6">
        
        {/* Step Description in Notepad Context */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-start gap-3">
          <div className={`mt-1 p-1.5 rounded-full ${config.type === 'none' ? 'bg-slate-700' : 'bg-green-500/20 text-green-400'}`}>
            {config.type === 'none' ? <AlertTriangle size={16} /> : <Bot size={16} />}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-200">Current Model Status</h4>
            <p className="text-sm text-slate-400 mt-1 leading-relaxed">
              {config.description}
            </p>
          </div>
        </div>

        {/* Input Area */}
        <div className="flex-1 flex flex-col min-h-[200px]">
          <label className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={config.placeholder}
            className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 font-mono resize-none text-sm leading-relaxed"
          />
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            onClick={handleRun}
            disabled={loading || config.type === 'none' || !input.trim()}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
              ${config.type === 'none' 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} fill="currentColor" />}
            {config.buttonLabel}
          </button>
        </div>

        {/* Output Area */}
        {(output || loading) && (
          <div className="min-h-[150px] border-t border-slate-800 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <label className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider flex items-center justify-between">
              <span>Model Output</span>
              {loading && <span className="text-indigo-400 text-[10px] animate-pulse">Processing...</span>}
            </label>
            <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 min-h-[100px] relative">
              {loading ? (
                <div className="space-y-2 opacity-50">
                  <div className="h-2 bg-slate-800 rounded w-3/4 animate-pulse"></div>
                  <div className="h-2 bg-slate-800 rounded w-1/2 animate-pulse"></div>
                  <div className="h-2 bg-slate-800 rounded w-5/6 animate-pulse"></div>
                </div>
              ) : (
                 <pre className="whitespace-pre-wrap font-mono text-sm text-green-400">
                   {output}
                 </pre>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulationPanel;
