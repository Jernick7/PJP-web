import React, { useState, useEffect } from 'react';
import { Radio, Terminal, Send, Loader2, Sparkles, MessageSquare } from 'lucide-react';

interface VoiceMessage {
  id: string;
  name: string;
  message: string;
  timestamp: string;
}

export function WallOfVoices() {
  const [voices, setVoices] = useState<VoiceMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorText, setErrorText] = useState('');

  const fetchVoices = async () => {
    try {
      const res = await fetch('/api/voices');
      if (!res.ok) throw new Error('Could not pull voices from cyber registry.');
      const data = await res.json();
      setVoices(data);
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || 'System error pulling voices feed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVoices();
    // Auto-poll every 15 seconds to keep the terminal simulation alive
    const interval = setInterval(fetchVoices, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !message.trim()) return;

    try {
      setSubmitting(true);
      setErrorText('');
      const res = await fetch('/api/voices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: nickname, message })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Identity rejection from mainframe.');
      }

      setVoices(data.voices);
      setNickname('');
      setMessage('');
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || 'Failed to sync broadcast packet.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="wall-of-voices-root" className="space-y-8 max-w-4xl mx-auto">
      {/* Overview Block */}
      <div className="border border-[var(--color-pjp-green)] bg-[#030703] p-6 rounded shadow-[0_0_15px_rgba(0,255,0,0.05)_inset]">
        <div className="flex items-center gap-3 text-[var(--color-pjp-orange)] mb-3">
          <Radio className="w-6 h-6 animate-pulse" />
          <h2 className="text-2xl font-mono font-bold tracking-tight uppercase">
            The Wall of Voices
          </h2>
        </div>
        <p className="font-mono text-xs text-gray-400 leading-relaxed">
          PUBLIC TRANSMISSION REGISTER: Citizens of Kanyakumari District gather here. Post your concerns, solidarity claims, adoption success tales, or strategy advice. Your letters appear instantly in the scrolling terminal logging bank.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Broadcast Form (Left or Top Column) */}
        <div className="md:col-span-1 border border-[var(--color-pjp-green)] bg-[#050505] p-5 shadow-[inset_0_0_10px_rgba(0,100,0,0.1)] h-fit">
          <div className="flex items-center gap-2 text-[var(--color-pjp-orange)] font-mono font-bold text-sm uppercase mb-4 border-b border-gray-800 pb-2">
            <Sparkles className="w-4 h-4 text-[var(--color-pjp-orange)]" />
            <span>Broadcast to Pride</span>
          </div>

          <form onSubmit={handleBroadcast} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono text-[var(--color-pjp-green)] mb-1 uppercase">CITIZEN ALIAS</label>
              <input
                type="text"
                required
                maxLength={30}
                placeholder="e.g. Suresh_Ngrcoil"
                className="w-full bg-black border border-gray-800 text-white font-mono text-xs p-2 focus:border-[var(--color-pjp-orange)] outline-none"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[var(--color-pjp-green)] mb-1 uppercase">QUICK TRANSMISSION</label>
              <textarea
                required
                maxLength={300}
                rows={4}
                placeholder="Type public announcement (e.g. Feline shelter needed near Colachel road...)"
                className="w-full bg-black border border-gray-800 text-white font-mono text-xs p-2 focus:border-[var(--color-pjp-orange)] outline-none resize-none"
                value={message}
                onChange={e => setMessage(e.target.value)}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#001700] border border-[var(--color-pjp-green)] hover:bg-[#002800] text-[var(--color-pjp-orange)] text-xs font-bold font-mono uppercase p-2.5 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin text-[var(--color-pjp-orange)]" />
                  Broadcasting...
                </>
              ) : (
                <>
                  <Send size={14} className="text-[var(--color-pjp-orange)]" />
                  POST DOSSIER LOG
                </>
              )}
            </button>

            {errorText && (
              <div className="bg-[#2a0505] border border-red-900 p-2 text-red-400 font-mono text-[10px] leading-relaxed">
                ERROR: {errorText}
              </div>
            )}
          </form>
        </div>

        {/* Public Terminal Log Feed (Right, 2 Columns) */}
        <div className="md:col-span-2 flex flex-col h-[400px]">
          <div className="flex items-center justify-between bg-black border-t border-x border-[var(--color-pjp-green)] px-4 py-2 font-mono text-[11px] text-[var(--color-pjp-green)]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping"></span>
              <span className="font-bold">LIVE TELEMETRY INTAKE REGISTER</span>
            </div>
            <div className="text-gray-500 uppercase">SYS_LOG_MODE=ACTIVE</div>
          </div>

          <div 
            className="flex-1 bg-black border border-[var(--color-pjp-green)] p-4 overflow-y-auto font-mono text-xs text-gray-300 space-y-4 shadow-[0_0_20px_rgba(0,100,0,0.05)_inset]"
            style={{
              backgroundImage: 'linear-gradient(rgba(0, 100, 0, 0.03) 50%, rgba(0, 0, 0, 0.4) 50%)',
              backgroundSize: '100% 4px',
            }}
          >
            {loading ? (
              <div className="h-full flex flex-col justify-center items-center gap-2 text-gray-500">
                <Loader2 className="w-6 h-6 animate-spin text-[var(--color-pjp-green)]" />
                <span>DECRYPTING LOG REGISTRATION DATABANK...</span>
              </div>
            ) : voices.length === 0 ? (
              <div className="h-full flex justify-center items-center text-gray-600 italic">
                [SYSTEM STATS: REGISTRY IS EMPTY. INITIALIZE A BROADCAST]
              </div>
            ) : (
              <div className="space-y-3">
                {voices.map((v) => (
                  <div key={v.id} className="border-b border-[#0d2a0d] pb-2 last:border-none">
                    <p className="text-[11px] text-[var(--color-pjp-green)] leading-relaxed">
                      <span className="text-[var(--color-pjp-orange)] font-bold">
                        [SYS-LOG {v.timestamp}]
                      </span>{' '}
                      Citizen <strong className="text-green-400 font-bold bg-[#001700] px-1 border border-[#003c00]">{v.name}</strong>:{' '}
                      <span className="text-white bg-[#030303] px-1.5 py-0.5 rounded italic">"{v.message}"</span>
                    </p>
                  </div>
                ))}
                
                {/* Simulated terminal suffix */}
                <div className="text-gray-600 text-[10px] pt-2 border-t border-gray-900 border-dashed animate-pulse">
                  &gt;&gt; MONITORING KANYAKUMARI DISTRICT SIGNALS... READY FOR BROADCASTS...
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
