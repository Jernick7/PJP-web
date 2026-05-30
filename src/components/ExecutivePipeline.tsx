import React, { useState } from 'react';
import { Rss, Terminal, Send, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';

export function ExecutivePipeline() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorText, setErrorText] = useState('');
  const [receipt, setReceipt] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) return;

    try {
      setStatus('sending');
      setErrorText('');
      
      const res = await fetch('/api/executive/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch transmission.');
      }

      setReceipt(data);
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorText(err.message || 'Transmission pipeline connection failure.');
    }
  };

  return (
    <div id="executive-pipeline-root" className="space-y-8 max-w-4xl mx-auto">
      {/* Header Info */}
      <div className="border border-[var(--color-pjp-green)] bg-[#030703] p-6 rounded shadow-[0_0_15px_rgba(0,255,0,0.05)_inset]">
        <div className="flex items-center gap-3 text-[var(--color-pjp-orange)] mb-3">
          <Terminal className="w-6 h-6 animate-pulse" />
          <h2 className="text-2xl font-mono font-bold tracking-tight uppercase">
            Executive Pipeline Node
          </h2>
        </div>
        <p className="font-mono text-xs text-gray-400 leading-relaxed">
          SECRETARY DECREE: All submissions entering this port bypass general channels and route directly to the personal secure mailbox of <strong className="text-[var(--color-pjp-green)]">CEO BS</strong>. This is an elite communication channel monitored 24/7 by cyber felines. Divisive, untruthful or non-cooperative inputs will be dismissed with severe corporate prejudice.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left terminal metadata status cards */}
        <div className="md:col-span-1 space-y-4">
          <div className="border border-gray-800 bg-black p-4 font-mono text-[11px] text-gray-400 space-y-3 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]">
            <div className="text-[var(--color-pjp-orange)] font-bold border-b border-gray-800 pb-1 uppercase tracking-wider">
              System Directives
            </div>
            <div>
              <span className="text-[var(--color-pjp-green)] font-bold">NODE:</span> EP-KANYAKUMARI-ALPHA1
            </div>
            <div>
              <span className="text-[var(--color-pjp-green)] font-bold">STATUS:</span> <span className="text-green-500 font-bold">CONNECTED</span>
            </div>
            <div>
              <span className="text-[var(--color-pjp-green)] font-bold">CRYPTO:</span> TLS_AES_256_GCM_SHA384
            </div>
            <div className="border-t border-gray-800 pt-2 text-[10px] space-y-1">
              <span className="text-[var(--color-pjp-orange)] font-bold block">SECURITY PROTOCOL:</span>
              <span>• Strictly for Kanyakumari constituencies issues.</span>
              <span>• Spammers will have their credentials permanently blacklisted from PJP networks.</span>
            </div>
          </div>

          <div className="border border-gray-800 bg-[#050505] p-4 text-center font-mono">
            <div className="text-[32px] text-[var(--color-pjp-orange)] font-bold font-mono tracking-widest drop-shadow-[0_0_8px_rgba(255,153,51,0.5)]">
              100%
            </div>
            <div className="text-[10px] text-[var(--color-pjp-green)] uppercase tracking-wider mt-1">
              Direct Route Integrity
            </div>
          </div>
        </div>

        {/* The Intake Form */}
        <div className="md:col-span-2 border border-[var(--color-pjp-green)] bg-[#050505] p-6 shadow-[0_0_15px_rgba(0,100,0,0.1)_inset] relative">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-[var(--color-pjp-green)]">
            <Rss size={100} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-[var(--color-pjp-green)] mb-1 uppercase tracking-wider">Submitter ID / Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. COLACHEL CITIZEN"
                  className="w-full bg-black border border-gray-800 text-white font-mono p-2 focus:border-[var(--color-pjp-orange)] outline-none transition-colors shadow-[inset_0_0_5px_rgba(0,100,0,0.2)] placeholder-gray-700"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[var(--color-pjp-green)] mb-1 uppercase tracking-wider">Your Secure Email Route</label>
                <input
                  type="email"
                  required
                  placeholder="your.email@route.com"
                  className="w-full bg-black border border-gray-800 text-white font-mono p-2 focus:border-[var(--color-pjp-orange)] outline-none transition-colors shadow-[inset_0_0_5px_rgba(0,100,0,0.2)] placeholder-gray-700"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[var(--color-pjp-green)] mb-1 uppercase tracking-wider">Memorandum Subject</label>
              <input
                type="text"
                required
                placeholder="e.g., Stray adoption protection system upgrade proposal"
                className="w-full bg-black border border-gray-800 text-white font-mono p-2 focus:border-[var(--color-pjp-orange)] outline-none transition-colors shadow-[inset_0_0_5px_rgba(0,100,0,0.2)] placeholder-gray-700"
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[var(--color-pjp-green)] mb-1 uppercase tracking-wider">Detailed Secure Transmission</label>
              <textarea
                required
                rows={6}
                placeholder="Compose message targeting the executive office. Share specific coordinates, needs, stray statuses or policy proposals..."
                className="w-full bg-black border border-gray-800 text-white font-mono p-2 focus:border-[var(--color-pjp-orange)] outline-none transition-colors shadow-[inset_0_0_5px_rgba(0,100,0,0.2)] placeholder-gray-700 resize-none"
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
              ></textarea>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-[#001c00] border border-[var(--color-pjp-green)] hover:bg-[#002f00] text-[var(--color-pjp-orange)] font-bold font-mono uppercase p-3 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(0,255,0,0.1)] hover:shadow-[0_0_15px_rgba(255,153,51,0.3)]"
              >
                {status === 'sending' ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-[var(--color-pjp-orange)]" />
                    DISPATCHING TO CEO BS SECURE DECK...
                  </>
                ) : (
                  <>
                    <Send size={16} className="text-[var(--color-pjp-orange)]" />
                    TRANSMIT SECURE MEMORANDUM
                  </>
                )}
              </button>
            </div>

            {/* Verification Terminal Banner */}
            {status === 'success' && (
              <div className="mt-4 p-4 bg-[#001100] border border-green-500 rounded text-green-400 font-mono text-xs space-y-2 shadow-[0_0_15px_rgba(0,255,0,0.2)_inset]">
                <div className="flex items-center gap-2 text-green-300 font-bold border-b border-green-800 pb-1">
                  <ShieldCheck className="w-5 h-5" />
                  <span>[SECURE PIPELINE DISPATCH CONFIRMED]</span>
                </div>
                <p>
                  STATUS: Memorandum has been fully encrypted and dispatched securely to CEO BS's SMTP pipeline.
                </p>
                <div className="bg-black p-2 rounded text-[10px] text-green-500 border border-green-900 leading-relaxed font-mono">
                  RECEIPT_SIGIL: PJP-EP-RELAY-{receipt?.timestamp ? receipt.timestamp.replace(/[: -]/g, '') : 'SUCCESS'} <br />
                  TIMESTAMP    : {receipt?.timestamp || new Date().toISOString()} UTC <br />
                  DESTINATION  : Supreme Corporate Authority SMTP inbox <br />
                  LOG_ACTION   : Direct Executive Action Pending.
                </div>
              </div>
            )}

            {/* Error Terminal Banner */}
            {status === 'error' && (
              <div className="mt-4 p-4 bg-[#1a0505] border border-red-500 rounded text-red-400 font-mono text-xs space-y-2 shadow-[0_0_15px_rgba(255,0,0,0.2)_inset]">
                <div className="flex items-center gap-2 text-red-300 font-bold border-b border-red-900 pb-1">
                  <AlertCircle className="w-5 h-5" />
                  <span>[SYSTEM WARNING: TRANSMISSION FAULT]</span>
                </div>
                <p className="leading-relaxed">
                  ERROR DETECTED: {errorText}
                </p>
                <div className="text-[10px] text-red-500 border border-red-900 p-2 bg-black font-mono">
                  DIAGNOSTIC HINT: Please notify administrators to verify server .env SMTP_EMAIL and SMTP_PASSWORD credentials.
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
