import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, Server, XCircle, ChevronRight } from 'lucide-react';
import { Message } from '../types';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';

export function MainframeChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: "Mainframe Online. I operate under the direct authority of CEO BS. Identify your Kanyakumari constituency issue or state your inquiry."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const res = await fetch('/api/mainframe/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, history })
      });

      if (!res.ok) {
        throw new Error('Mainframe comms link severed.');
      }

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'model', content: data.text }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'model', content: `[CONNECTION ERROR] ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border border-[var(--color-pjp-green)] bg-black flex flex-col h-[500px] lg:h-[600px] shadow-[0_0_20px_rgba(0,100,0,0.1)]">
      {/* Header */}
      <div className="bg-[#050505] border-b border-[var(--color-pjp-green)] p-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Terminal size={18} className="text-[var(--color-pjp-orange)]" />
          <h3 className="font-sans font-bold text-sm tracking-widest uppercase text-white">Secure Mainframe Link</h3>
        </div>
        <div className="flex items-center gap-4 font-mono text-[10px] text-gray-500">
          <span className="flex items-center gap-1"><Server size={10} className="text-[var(--color-pjp-green)]" /> NODE: ACTIVE</span>
          <span className="flex items-center gap-1"><XCircle size={10} className="text-[var(--color-pjp-orange)]" /> GEMINI-2.5-FLASH</span>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 terminal-scroll relative"
        style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.9), rgba(0,0,0,0.9)), repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 100, 0, 0.03) 2px, rgba(0, 100, 0, 0.03) 4px)' }}
      >
        {messages.map((msg, idx) => (
          <div key={idx} className={cn(
            "flex flex-col max-w-[85%]",
            msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
          )}>
            <div className={cn(
              "text-[10px] uppercase font-mono mb-1",
              msg.role === 'user' ? "text-[var(--color-pjp-green)]" : "text-[var(--color-pjp-orange)]"
            )}>
              {msg.role === 'user' ? 'GUEST_CITIZEN' : 'SYS_MAINFRAME'}
            </div>
            <div className={cn(
              "p-3 font-mono text-sm shadow-sm",
              msg.role === 'user' 
                ? "bg-[#002200] border border-[var(--color-pjp-green)] text-green-50" 
                : "bg-[#1a0f00] border border-[var(--color-pjp-orange)] text-orange-50 max-w-none"
            )}>
              {msg.role === 'user' ? (
                msg.content
              ) : (
                <div className="markdown-body font-mono text-sm leading-relaxed [&>p]:mb-3 [&>h1]:text-lg [&>h1]:font-bold [&>h1]:mb-4 [&>h2]:text-md [&>h2]:font-bold [&>h2]:mb-3 [&>h3]:text-sm [&>h3]:font-bold [&>h3]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-3 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-3 [&>li]:mb-1 [&>a]:text-[var(--color-pjp-orange)] [&>a]:underline [&>strong]:text-[var(--color-pjp-orange)]">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex flex-col mr-auto items-start max-w-[85%]">
             <div className="text-[10px] uppercase font-mono mb-1 text-[var(--color-pjp-orange)]">SYS_MAINFRAME</div>
             <div className="p-3 bg-[#1a0f00] border border-[var(--color-pjp-orange)] text-orange-50 font-mono text-xs flex items-center gap-2">
               <span className="animate-pulse w-2 h-4 bg-[var(--color-pjp-orange)] inline-block"></span> Processing Request...
             </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-[var(--color-pjp-green)] bg-[#050505] p-3 flex gap-2">
        <div className="flex-1 relative">
          <ChevronRight size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-pjp-green)]" />
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Awaiting command input..."
            className="w-full bg-black border border-gray-800 text-[var(--color-pjp-green)] font-mono text-sm py-3 pl-9 pr-4 focus:border-[var(--color-pjp-orange)] outline-none transition-colors focus:ring-1 focus:placeholder-opacity-50 placeholder-[var(--color-pjp-green)]"
            disabled={isLoading}
          />
        </div>
        <button 
          type="submit" 
          disabled={isLoading || !input.trim()}
          className="bg-[var(--color-pjp-green)] text-black px-6 hover:bg-[var(--color-pjp-orange)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
