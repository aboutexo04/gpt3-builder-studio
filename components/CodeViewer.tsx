
import React, { useState, useEffect, useRef } from 'react';
import { Copy, Terminal, BookOpen, PenTool, RotateCcw, Check, Save, Columns, Layout, Clipboard } from 'lucide-react';

interface CodeViewerProps {
  code: string;       // The solution
  skeleton: string;   // The skeleton/scaffolding
  filename: string;
  language: string;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ code, skeleton, filename, language }) => {
  const [activeTab, setActiveTab] = useState<'reference' | 'workspace'>('workspace');
  const [isSplitView, setIsSplitView] = useState(false);
  const [userCode, setUserCode] = useState<string>('');
  const [isSaved, setIsSaved] = useState(false);
  const [justCopied, setJustCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load saved code for this file from localStorage, or default to skeleton
  useEffect(() => {
    const saved = localStorage.getItem(`gpt_builder_code_${filename}`);
    if (saved) {
      setUserCode(saved);
    } else {
      setUserCode(skeleton);
    }
  }, [filename, skeleton]);

  // Save to localStorage whenever user types
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setUserCode(newValue);
    localStorage.setItem(`gpt_builder_code_${filename}`, newValue);
    
    // Quick save indicator reset
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 1000);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset your code to the skeleton? You will lose your changes.")) {
      setUserCode(skeleton);
      localStorage.setItem(`gpt_builder_code_${filename}`, skeleton);
    }
  };

  const handleCopyReferenceToWorkspace = () => {
    if (confirm("Replace your current code with the reference solution?")) {
      setUserCode(code);
      localStorage.setItem(`gpt_builder_code_${filename}`, code);
      setActiveTab('workspace');
    }
  };

  const handleCopyClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setJustCopied(true);
      setTimeout(() => setJustCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const value = e.currentTarget.value;
      
      e.currentTarget.value = value.substring(0, start) + '    ' + value.substring(end);
      e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 4;
      handleCodeChange(e as any);
    }
  };

  // Robust Syntax Highlighting
  const highlightCode = (codeStr: string) => {
    if (!codeStr) return '';

    // 1. Escape HTML entities first
    let safe = codeStr
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Placeholder system to protect strings and comments
    const placeholders: string[] = [];
    const store = (content: string, className: string) => {
      const key = `__TOKEN_${placeholders.length}__`;
      placeholders.push(`<span class="${className}">${content}</span>`);
      return key;
    };

    // 2. Mask Strings and Comments (So keywords/numbers inside them don't get highlighted)
    // Python Docstrings ("""...""" or '''...''')
    safe = safe.replace(/("""[\s\S]*?""")/g, (match) => store(match, "text-green-600"));
    safe = safe.replace(/('''[\s\S]*?''')/g, (match) => store(match, "text-green-600"));
    
    // Python Comments (# ...)
    safe = safe.replace(/(#.*)/g, (match) => store(match, "text-slate-500 italic"));

    // Single and Double Quoted Strings
    safe = safe.replace(/(".*?")/g, (match) => store(match, "text-green-400"));
    safe = safe.replace(/('.*?')/g, (match) => store(match, "text-green-400"));

    // 3. Highlight Numbers
    // CRITICAL: We do this BEFORE keywords, because keywords introduce "text-pink-400" classes.
    // If we highlighted numbers later, we would break the "400" in the class name.
    safe = safe.replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>');

    // 4. Highlight Keywords
    const keywords = /\b(class|def|import|from|return|if|else|elif|for|in|pass|assert|while|try|except|with|del|lambda|global|nonlocal|raise|yield)\b/g;
    safe = safe.replace(keywords, '<span class="text-pink-400 font-bold">$1</span>');

    // 5. Highlight Built-ins and Types
    const builtins = /\b(self|int|float|bool|str|list|dict|set|tuple|super|len|range|print|enumerate|zip|dataclass|map|filter|sum|min|max|None|True|False)\b/g;
    safe = safe.replace(builtins, '<span class="text-cyan-300">$1</span>');

    // 6. Highlight PyTorch/Library specific
    const libs = /\b(torch|nn|F|math|numpy|np|plt)\b/g;
    safe = safe.replace(libs, '<span class="text-yellow-400">$1</span>');

    // 7. Highlight Decorators
    safe = safe.replace(/(@\w+)/g, '<span class="text-yellow-200">$1</span>');

    // 8. Restore placeholders
    placeholders.forEach((html, i) => {
      safe = safe.replace(`__TOKEN_${i}__`, html);
    });

    return safe;
  };

  const getLineNumbers = (text: string) => {
    if (!text) return '1';
    return text.split('\n').map((_, i) => i + 1).join('\n');
  };

  const renderEditor = (readOnly: boolean, content: string, onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void) => {
    return (
      <div className="flex h-full overflow-hidden bg-[#0d1117]">
        {/* Line Numbers */}
        <div className="w-12 bg-[#0d1117] text-slate-600 text-right pr-3 pt-4 font-mono text-sm select-none border-r border-slate-800 leading-6">
          <pre>{getLineNumbers(content)}</pre>
        </div>
        
        {/* Content */}
        {readOnly ? (
          <div className="flex-1 overflow-auto bg-[#0d1117] relative group">
             <button 
               onClick={() => handleCopyClipboard(content)}
               className="absolute top-2 right-2 p-1.5 bg-slate-800 text-slate-400 rounded hover:text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
               title="Copy to clipboard"
             >
               {justCopied ? <Check size={14} className="text-green-500" /> : <Clipboard size={14} />}
             </button>
             {content ? (
                <pre className="p-4 font-mono text-sm leading-6 text-slate-300 whitespace-pre tab-4">
                   <code dangerouslySetInnerHTML={{ __html: highlightCode(content) }} />
                </pre>
             ) : (
                <div className="p-8 text-slate-500 text-center italic">
                  No reference code available.
                </div>
             )}
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            className="flex-1 bg-[#0d1117] text-slate-300 font-mono text-sm p-4 outline-none resize-none leading-6 w-full whitespace-pre tab-4"
          />
        )}
      </div>
    );
  };

  return (
    <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl my-6 flex flex-col h-[600px]">
      
      {/* Header / Tabs */}
      <div className="flex items-center justify-between bg-slate-900 border-b border-slate-800 px-2 pt-2">
        <div className="flex gap-1 items-end">
          <button
            onClick={() => { setActiveTab('workspace'); setIsSplitView(false); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors border-t border-l border-r ${
              activeTab === 'workspace' && !isSplitView
                ? 'bg-[#0d1117] border-slate-800 text-indigo-400 z-10' 
                : 'bg-slate-900 border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <PenTool size={14} />
            Your Workspace
            {isSaved && <Save size={12} className="text-emerald-500 animate-pulse ml-1" />}
          </button>
          
          <button
            onClick={() => { setActiveTab('reference'); setIsSplitView(false); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors border-t border-l border-r ${
              activeTab === 'reference' && !isSplitView
                ? 'bg-[#0d1117] border-slate-800 text-emerald-400 z-10' 
                : 'bg-slate-900 border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <BookOpen size={14} />
            Reference Solution
          </button>

          {/* Desktop Split View Toggle */}
          <div className="hidden md:block ml-2 border-l border-slate-700 pl-2 py-1">
             <button
               onClick={() => setIsSplitView(!isSplitView)}
               className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                 isSplitView 
                   ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/50' 
                   : 'text-slate-500 hover:text-white hover:bg-slate-800'
               }`}
             >
               <Columns size={14} />
               Split View
             </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-2 pb-2">
           <span className="text-xs text-slate-500 font-mono flex items-center gap-1 bg-slate-800 px-2 py-1 rounded border border-slate-700">
             <Terminal size={12} />
             {filename}
           </span>
        </div>
      </div>

      {/* Toolbar inside tab */}
      <div className="bg-[#0d1117] h-10 border-b border-slate-800 flex items-center justify-between px-4 flex-shrink-0">
        <div className="text-xs text-slate-500 flex items-center gap-2">
          {isSplitView ? (
             <span className="text-indigo-400 flex items-center gap-1">
               <Layout size={12} />
               Comparison Mode
             </span>
          ) : activeTab === 'workspace' ? (
            <span className="text-indigo-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              Editing Mode
            </span>
          ) : (
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Read-Only Mode
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          {(activeTab === 'workspace' || isSplitView) && (
            <button 
              onClick={handleReset}
              className="px-2 py-1 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors text-xs flex items-center gap-1"
              title="Reset to skeleton"
            >
              <RotateCcw size={12} />
              Reset
            </button>
          )}
          
          <button 
             onClick={handleCopyReferenceToWorkspace}
             className="px-2 py-1 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded transition-colors text-xs flex items-center gap-1"
             title="Use reference solution code"
           >
             <Copy size={12} />
             Copy Solution
           </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 relative bg-[#0d1117] overflow-hidden">
        
        {isSplitView ? (
          <div className="flex h-full">
            {/* Left: Reference */}
            <div className="flex-1 border-r border-slate-800 flex flex-col min-w-0">
               <div className="bg-slate-900/50 px-3 py-1 text-[10px] text-emerald-400 font-bold tracking-wider border-b border-slate-800 select-none">REFERENCE</div>
               <div className="flex-1 relative overflow-hidden">
                  {renderEditor(true, code)}
               </div>
            </div>
            {/* Right: Workspace */}
            <div className="flex-1 flex flex-col min-w-0">
               <div className="bg-slate-900/50 px-3 py-1 text-[10px] text-indigo-400 font-bold tracking-wider border-b border-slate-800 select-none">YOUR WORKSPACE</div>
               <div className="flex-1 relative overflow-hidden">
                  {renderEditor(false, userCode, handleCodeChange)}
               </div>
            </div>
          </div>
        ) : (
          <>
            {/* Workspace Mode */}
            <div className={`h-full ${activeTab === 'workspace' ? 'block' : 'hidden'}`}>
               {renderEditor(false, userCode, handleCodeChange)}
            </div>

            {/* Reference Mode */}
            <div className={`h-full ${activeTab === 'reference' ? 'block' : 'hidden'}`}>
               {renderEditor(true, code)}
            </div>
          </>
        )}
        
      </div>
      
      {/* Footer */}
      <div className="h-6 bg-slate-900 border-t border-slate-800 flex items-center px-4 justify-between select-none flex-shrink-0">
         <span className="text-[10px] text-slate-500 font-mono">Python 3.10 &bull; PyTorch</span>
         <span className="text-[10px] text-slate-500 font-mono">
           {isSplitView ? 'Split View Active' : `Ln ${activeTab === 'workspace' ? (userCode || '').split('\n').length : (code || '').split('\n').length}`}
         </span>
      </div>
    </div>
  );
};

export default CodeViewer;
