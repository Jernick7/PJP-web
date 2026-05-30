import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { Download, Loader2, Send, PawPrint } from 'lucide-react';
import { cn } from '../lib/utils';

const CONSTITUENCIES = [
  "Kanyakumari", "Nagercoil", "Colachel", "Vilavancode", "Killiyoor", "Padmanabhapuram"
];

export function IDCardFactory() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    constituency: 'Nagercoil',
    alignment: 'Cat Lover'
  });
  
  const [status, setStatus] = useState<'idle' | 'generating' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [generatedSerial, setGeneratedSerial] = useState('PJP-KK-2026-B23XOD');
  
  const cardRef = useRef<HTMLDivElement>(null);

  const generateSerial = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `PJP-KK-2026-${result}`;
  };

  const handleGenerateAndSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    
    try {
      setStatus('generating');
      setErrorMessage('');
      const serial = generateSerial();
      setGeneratedSerial(serial);

      // Increment live paws enrollment count on server
      try {
        await fetch('/api/metrics/paws/increment', { method: 'POST' });
      } catch (err) {
        console.warn("Mainframe count sync warning:", err);
      }
      
      // Let React render the new state offscreen
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!cardRef.current) throw new Error("Card reference not found.");
      
      // The massive fixed width/height forces a perfect capture
      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#000000',
        width: 640,
        height: 380,
        style: {
          transform: 'none',
          margin: '0',
          position: 'static'
        }
      });
      
      const link = document.createElement('a');
      link.download = `PJP_Dossier_${serial}.png`;
      link.href = dataUrl;
      link.click();
      
      setStatus('sending');
      
      const res = await fetch('/api/relay/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          attachmentName: `PJP_Dossier_${serial}.png`,
          attachmentData: dataUrl
        })
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to send email via SMTP relay.");
      }
      
      setStatus('success');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.message || 'An unknown error occurred.');
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Intake Form */}
        <div className="border border-[var(--color-pjp-green)] bg-[#050505] p-6 relative shadow-[0_0_15px_rgba(0,100,0,0.1)_inset]">
          <div className="absolute top-0 right-0 p-2 opacity-20">
            <PawPrint size={48} className="text-[var(--color-pjp-green)]" />
          </div>
          <h3 className="font-sans font-bold text-xl mb-6 text-[var(--color-pjp-orange)] uppercase tracking-tight border-b border-[var(--color-pjp-green)] pb-2 inline-block">
            Digital Intake Node
          </h3>
          
          <form onSubmit={handleGenerateAndSend} className="space-y-4 relative z-10">
            <div>
              <label className="block text-xs font-mono text-[var(--color-pjp-green)] mb-1">FULL NAME</label>
              <input 
                type="text" 
                required
                className="w-full bg-black border border-gray-800 text-white font-mono p-2 focus:border-[var(--color-pjp-orange)] outline-none transition-colors shadow-[0_0_5px_rgba(0,100,0,0.2)_inset]"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[var(--color-pjp-green)] mb-1">SECURE EMAIL ROUTE</label>
              <input 
                type="email" 
                required
                className="w-full bg-black border border-gray-800 text-white font-mono p-2 focus:border-[var(--color-pjp-orange)] outline-none transition-colors shadow-[0_0_5px_rgba(0,100,0,0.2)_inset]"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-[var(--color-pjp-green)] mb-1">CONSTITUENCY</label>
                <select 
                  className="w-full bg-black border border-gray-800 text-[var(--color-pjp-green)] font-mono font-bold p-2 focus:border-[var(--color-pjp-orange)] outline-none"
                  value={formData.constituency}
                  onChange={e => setFormData({ ...formData, constituency: e.target.value })}
                >
                  {CONSTITUENCIES.map(c => <option key={c} value={c} className="bg-black text-white">{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-[var(--color-pjp-green)] mb-1">FELINE ALIGNMENT</label>
                <select 
                  className="w-full bg-black border border-gray-800 text-[var(--color-pjp-orange)] font-mono font-bold p-2 focus:border-[var(--color-pjp-orange)] outline-none"
                  value={formData.alignment}
                  onChange={e => setFormData({ ...formData, alignment: e.target.value })}
                >
                  <option value="Cat Lover" className="bg-black text-white">CAT LOVER</option>
                  <option value="Non-Lover" className="bg-black text-white">NON-LOVER</option>
                </select>
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={status === 'generating' || status === 'sending'}
                className="w-full bg-[#002200] border border-[var(--color-pjp-green)] hover:bg-[#003300] text-[var(--color-pjp-orange)] font-bold uppercase p-3 transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(0,100,0,0.3)] hover:shadow-[0_0_15px_rgba(255,153,51,0.4)]"
              >
                {status === 'generating' && <><Loader2 size={18} className="animate-spin text-[var(--color-pjp-orange)]"/> Initializing Dossier...</>}
                {status === 'sending' && <><Send size={18} className="animate-pulse text-[var(--color-pjp-orange)]"/> Transmitting to Email...</>}
                {['idle', 'success', 'error'].includes(status) && <><Download size={18} className="text-[var(--color-pjp-orange)]"/> Generate ID & Relay</>}
              </button>
            </div>
            
            {status === 'success' && (
              <div className="mt-4 p-3 bg-[#001100] border border-green-500 font-mono text-xs text-green-400 drop-shadow-[0_0_3px_rgba(0,255,0,0.8)]">
                [SUCCESS] Dossier generated and transmitted to SMTP relay successfully. Check your inbox.
              </div>
            )}
            {status === 'error' && (
              <div className="mt-4 p-3 bg-[#220000] border border-red-500 font-mono text-xs text-red-400 drop-shadow-[0_0_3px_rgba(255,0,0,0.8)]">
                [SYSTEM WARNING] {errorMessage} <br />
                (File downloaded locally. SMTP transmission failed. Check credentials.)
              </div>
            )}
          </form>
        </div>

        {/* Scaled Preview of the Dossier */}
        <div className="w-full flex flex-col items-center justify-start overflow-hidden">
          <h4 className="font-mono text-[var(--color-pjp-green)] font-bold text-xs uppercase tracking-widest mb-4">Live Dossier Target View</h4>
          
          <div className="w-full max-w-[500px]">
             {/* Using transform scale to fit the 640x380 card perfectly in its container */}
             <div className="relative w-full pb-[59.375%] /* 380/640 */">
                <div className="absolute top-0 left-0 origin-top-left w-[640px] h-[380px] pointer-events-none" style={{ transform: 'scale(calc(100% / 640 * min(500, 100vw - 32px)))' }}>
                   
                   {/* ---- THE ACTUAL ID CARD RENDER TARGET ---- */}
                   <div 
                      ref={cardRef} 
                      className="absolute inset-0 bg-black font-mono overflow-hidden"
                      style={{ 
                        backgroundImage: 'linear-gradient(rgba(0, 100, 0, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 100, 0, 0.08) 1px, transparent 1px)', 
                        backgroundSize: '20px 20px' 
                      }}
                    >
                      {/* Sub-Border Glowing Elements */}
                      <div className="absolute inset-0 border-2 border-[var(--color-pjp-green)] m-[8px] pointer-events-none shadow-[0_0_15px_rgba(0,100,0,0.6)_inset]"></div>
                      <div className="absolute inset-0 border border-[var(--color-pjp-orange)] m-[14px] opacity-70 pointer-events-none shadow-[0_0_10px_rgba(255,153,51,0.5)]"></div>

                      <div className="p-8 w-full h-full flex flex-col relative z-10">
                        {/* Top Title Area */}
                        <div className="border-b-2 border-dashed border-[var(--color-pjp-green)] pb-3 mb-5 relative flex flex-col items-center drop-shadow-[0_0_5px_rgba(0,100,0,0.8)]">
                          <h2 className="text-[var(--color-pjp-green)] font-bold text-3xl font-mono leading-none tracking-widest drop-shadow-[0_0_10px_rgba(0,255,0,0.5)] z-10 relative">
                            POOCHA JANATHA PARTY (PJP)
                          </h2>
                          <div className="text-[12px] text-[var(--color-pjp-orange)] mt-[6px] font-mono tracking-[0.2em] font-bold z-10 relative">
                            OFFICIAL MEMBERSHIP DOSSIER
                          </div>
                          
                          {/* Glowing cat visual watermark */}
                          <div className="absolute top-[-10px] opacity-20 text-[var(--color-pjp-green)] drop-shadow-[0_0_8px_rgba(0,255,0,0.8)] flex justify-center w-full">
                            <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                               {/* Cat Head */}
                               <path d="M20 70 L20 30 L40 45 L60 45 L80 30 L80 70 Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/>
                               {/* Eyes */}
                               <circle cx="35" cy="55" r="4" fill="currentColor" />
                               <circle cx="65" cy="55" r="4" fill="currentColor" />
                               {/* Shawl */}
                               <path d="M10 70 L90 70 L50 95 Z" fill="var(--color-pjp-orange)" opacity="0.8" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                               {/* Whiskers */}
                               <path d="M5 55 L20 60 M5 65 L20 65 M5 75 L20 70" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                               <path d="M95 55 L80 60 M95 65 L80 65 M95 75 L80 70" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                          </div>
                        </div>
                        
                        {/* Grid Data Section */}
                        <div className="flex gap-8 h-[160px]">
                          {/* Left Column: Photo */}
                          <div className="w-[124px] h-[155px] border-2 border-[var(--color-pjp-green)] bg-[#020302] flex flex-col justify-center items-center text-center p-2 relative shadow-[inset_0_0_20px_rgba(0,100,0,0.5)]">
                            <div className="text-[10px] text-[var(--color-pjp-green)] font-mono font-bold uppercase tracking-wider opacity-80 leading-relaxed">APPLICANT<br/>PHOTO<br/>HERE</div>
                            
                            {/* Sniper brackets */}
                            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[var(--color-pjp-orange)] drop-shadow-[0_0_3px_rgba(255,153,51,0.8)]"></div>
                            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[var(--color-pjp-orange)] drop-shadow-[0_0_3px_rgba(255,153,51,0.8)]"></div>
                            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[var(--color-pjp-orange)] drop-shadow-[0_0_3px_rgba(255,153,51,0.8)]"></div>
                            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[var(--color-pjp-orange)] drop-shadow-[0_0_3px_rgba(255,153,51,0.8)]"></div>
                          </div>
                          
                          {/* Right Column: Key Details */}
                          <div className="flex-1 flex flex-col justify-center gap-[10px]">
                            <div className="flex items-end border-b border-[rgba(0,100,0,0.3)] pb-1">
                              <span className="text-[12px] text-[var(--color-pjp-green)] w-32 uppercase tracking-widest font-bold">NAME:</span>
                              <span className="text-white text-[18px] font-bold tracking-widest uppercase leading-none drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] truncate w-64">{formData.name}</span>
                            </div>
                            <div className="flex items-end border-b border-[rgba(0,100,0,0.3)] pb-1">
                              <span className="text-[12px] text-[var(--color-pjp-green)] w-32 uppercase tracking-widest font-bold">ID:</span>
                              <span className="text-[var(--color-pjp-orange)] text-[14px] font-bold tracking-widest leading-none drop-shadow-[0_0_5px_rgba(255,153,51,0.8)] truncate w-64">{generatedSerial}</span>
                            </div>
                            <div className="flex items-end border-b border-[rgba(0,100,0,0.3)] pb-1">
                              <span className="text-[12px] text-[var(--color-pjp-green)] w-32 uppercase tracking-widest font-bold">CONSTITUENCY:</span>
                              <span className="text-[var(--color-pjp-green)] text-[14px] font-bold tracking-widest leading-none drop-shadow-[0_0_6px_rgba(0,255,0,0.6)] uppercase truncate w-64">{formData.constituency}</span>
                            </div>
                            <div className="flex items-end border-b border-[rgba(0,100,0,0.3)] pb-1">
                              <span className="text-[12px] text-[var(--color-pjp-green)] w-32 uppercase tracking-widest font-bold">ALIGNMENT:</span>
                              <span className="text-[var(--color-pjp-orange)] text-[14px] font-bold tracking-widest leading-none drop-shadow-[0_0_6px_rgba(255,153,51,0.8)] uppercase truncate w-64">{formData.alignment}</span>
                            </div>
                            <div className="flex items-end mt-1">
                              <span className="text-[12px] text-[var(--color-pjp-green)] w-32 uppercase tracking-widest font-bold opacity-70">STATUS:</span>
                              <span className="text-[var(--color-pjp-green)] font-mono text-[12px] italic tracking-wider uppercase bg-[#001800] border border-[var(--color-pjp-green)] px-2 py-[2px] shadow-[0_0_8px_rgba(0,100,0,0.4)]">Signed & Verified by CEO BS</span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Section */}
                        <div className="absolute bottom-[20px] left-[32px] right-[32px] flex justify-between items-center z-10">
                          {/* Geometric Seal */}
                          <div className="w-[64px] h-[64px] rounded-full border-[2px] border-[var(--color-pjp-orange)] flex items-center justify-center relative bg-black shadow-[0_0_15px_rgba(255,153,51,0.6)]">
                            <div className="absolute w-[50px] h-[50px] rounded-full border border-dashed border-[var(--color-pjp-green)] animate-[spin_8s_linear_infinite]"></div>
                            <PawPrint size={26} className="text-[var(--color-pjp-orange)] drop-shadow-[0_0_5px_rgba(255,153,51,0.9)] relative z-10" />
                            <div className="absolute -bottom-6 text-[7px] text-center text-[var(--color-pjp-orange)] w-36 tracking-[0.1em] font-bold whitespace-nowrap">
                              OFFICIAL PJP SEAL<br/>EST. KANYAKUMARI
                            </div>
                          </div>
                          
                          {/* Motto */}
                          <div className="flex-1 flex justify-center ml-2 mr-2">
                            <div className="text-[var(--color-pjp-green)] text-[14px] font-bold font-mono tracking-[0.3em] drop-shadow-[0_0_8px_rgba(0,255,0,0.7)] mt-4 border-l border-r border-[#003300] px-3 border-opacity-50">
                              UNITY • DISCIPLINE • SERVICE
                            </div>
                          </div>
                          
                          {/* Barcode-like visual anchor */}
                          <div className="flex gap-[2px] opacity-80 h-[28px] mt-2 border border-[#003300] p-1 bg-[#000a00]">
                             {[4, 2, 4, 1, 3, 2, 4, 2, 1, 3, 4, 2].map((w, i) => (
                               <div key={i} className="bg-[var(--color-pjp-green)] h-full" style={{ width: `${w}px` }}></div>
                             ))}
                          </div>
                        </div>
                      </div>
                    </div>
                   {/* ---- END OF ID CARD RENDER TARGET ---- */}

                </div>
             </div>
          </div>
        </div>

      </div>
    </>
  );
}
