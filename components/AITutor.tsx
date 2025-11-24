import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

interface AITutorProps {
  context: string;
  codeContext: string;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const AITutor: React.FC<AITutorProps> = ({ context, codeContext }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hi! I'm your GPT Architect assistant. Ask me anything about the code on the left." }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
        You are an expert AI Engineer tutor.
        Context: The user is learning to build GPT-3 in PyTorch.
        Current Topic: ${context}
        Current Code:
        ${codeContext}

        User Question: ${userMsg}

        Answer clearly, concisely, and focus on the technical details of the implementation.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;

      setMessages(prev => [...prev, { role: 'model', text: response.text() || "I couldn't generate a response." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Error connecting to AI Tutor. Please check your API key." }]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800">
      <div className="p-4 border-b border-slate-800 flex items-center gap-2 bg-slate-800/30">
        <div className="p-1.5 bg-indigo-500 rounded-lg">
          <Bot size={18} className="text-white" />
        </div>
        <div>
          <h3 className="font-bold text-white text-sm">AI Tutor</h3>
          <p className="text-xs text-indigo-400 flex items-center gap-1">
            <Sparkles size={10} />
            Powered by Gemini
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-slate-800 rounded-2xl rounded-tl-none px-4 py-3 border border-slate-700">
               <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
             </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-900">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about the code..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="absolute right-2 top-2 p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-indigo-600"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITutor;
