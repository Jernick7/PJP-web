import React, { useState } from 'react';
import { MetricsDashboard } from './components/MetricsDashboard';
import { NewsFeed } from './components/NewsFeed';
import { IDCardFactory } from './components/IDCardFactory';
import { MainframeChat } from './components/MainframeChat';
import { ExecutivePipeline } from './components/ExecutivePipeline';
import { WallOfVoices } from './components/WallOfVoices';
import { PawPrint, Terminal, Radio, LayoutDashboard, Lock, ShieldCheck, Instagram, Mail } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'mainframe' | 'executive' | 'voices'>('mainframe');

  return (
    <div className="min-h-screen bg-[var(--color-pjp-black)] text-white w-full selection:bg-[var(--color-pjp-orange)] selection:text-black">
      {/* Top Status Banner */}
      <div className="bg-[#050505] border-b-2 border-[var(--color-pjp-orange)] py-1.5 px-4 relative z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] font-mono tracking-widest text-[var(--color-pjp-green)]">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping inline-block"></span>
            SYS STATUS: ONLINE • KANYAKUMARI MAINFRAME
          </span>
          <span className="hidden sm:inline">UNITY • DISCIPLINE • SERVICE</span>
          <span>EST. 2026</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* Unified Cyber Head Block */}
        <section className="text-center space-y-4">
          <div className="inline-block p-4 border border-[var(--color-pjp-green)] rounded-full bg-black shadow-[0_0_15px_rgba(0,255,0,0.15)]">
            <PawPrint size={48} className="text-[var(--color-pjp-orange)] animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-6xl font-sans font-bold uppercase tracking-tight text-white leading-none">
            <span className="text-[var(--color-pjp-orange)] drop-shadow-[0_0_8px_rgba(255,153,51,0.4)]">Poocha</span> Janatha Party
          </h1>
          <p className="text-sm font-mono text-gray-400 max-w-2xl mx-auto border-t border-b border-gray-800/60 py-3 mt-2">
            Automated Strategic Command. Built strictly open to all citizens regardless of age, nationality, or alignment. Serving Kanyakumari.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-mono mt-4">
            <a 
              href="https://www.instagram.com/poocha.janatha.party_official?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 bg-[#001100] text-[var(--color-pjp-green)] hover:text-white border border-[var(--color-pjp-green)]/40 hover:border-[var(--color-pjp-green)] transition-all shadow-[0_0_8px_rgba(0,255,0,0.1)] hover:shadow-[0_0_12px_rgba(0,255,0,0.3)] rounded-md font-bold"
            >
              <Instagram className="w-3.5 h-3.5 text-[var(--color-pjp-orange)]" />
              <span>@poocha.janatha.party_official</span>
            </a>
            <a 
              href="mailto:poochajanathapartypjp@gmail.com" 
              className="flex items-center gap-2 px-3 py-1.5 bg-[#110000] text-[var(--color-pjp-orange)] hover:text-white border border-[var(--color-pjp-orange)]/40 hover:border-[var(--color-pjp-orange)] transition-all shadow-[0_0_8px_rgba(255,153,51,0.1)] hover:shadow-[0_0_12px_rgba(255,153,51,0.3)] rounded-md font-bold"
            >
              <Mail className="w-3.5 h-3.5 text-[var(--color-pjp-green)]" />
              <span>poochajanathapartypjp@gmail.com</span>
            </a>
          </div>
        </section>

        {/* Global Terminal Segmented Navigator */}
        <section id="navigation-terminal-nodes" className="max-w-3xl mx-auto">
          <div className="grid grid-cols-3 gap-2 p-1 bg-black border border-gray-800 rounded shadow-[inset_0_0_15px_rgba(0,0,0,0.9)]">
            <button
              onClick={() => setActiveTab('mainframe')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-3 font-mono text-xs font-bold uppercase transition-all duration-150 border rounded ${
                activeTab === 'mainframe'
                  ? 'bg-[#001400] text-[var(--color-pjp-green)] border-[var(--color-pjp-green)] shadow-[0_0_10px_rgba(0,255,0,0.2)]'
                  : 'text-gray-400 border-transparent hover:text-white hover:bg-[#070707]'
              }`}
            >
              <LayoutDashboard size={14} />
              <span className="text-center">Mainframe Desk</span>
            </button>
            <button
              onClick={() => setActiveTab('executive')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-3 font-mono text-xs font-bold uppercase transition-all duration-150 border rounded ${
                activeTab === 'executive'
                  ? 'bg-[#140000] text-[var(--color-pjp-orange)] border-[var(--color-pjp-orange)] shadow-[0_0_10px_rgba(255,153,51,0.2)]'
                  : 'text-gray-400 border-transparent hover:text-white hover:bg-[#070707]'
              }`}
            >
              <Lock size={14} />
              <span className="text-center">Executive Deck</span>
            </button>
            <button
              onClick={() => setActiveTab('voices')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-3 font-mono text-xs font-bold uppercase transition-all duration-150 border rounded ${
                activeTab === 'voices'
                  ? 'bg-[#000a14] text-blue-400 border-blue-500/50 shadow-[0_0_10px_rgba(0,100,255,0.2)]'
                  : 'text-gray-400 border-transparent hover:text-white hover:bg-[#070707]'
              }`}
            >
              <Radio size={14} />
              <span className="text-center">Wall of Voices</span>
            </button>
          </div>
        </section>

        {/* Dynamic Display Area */}
        <section id="terminal-content-grid" className="pt-6">
          {activeTab === 'mainframe' && (
            <div className="space-y-24">
              {/* Module A: Live Feline Metrics */}
              <div className="space-y-4">
                <div className="border-b border-gray-800 pb-2">
                  <h3 className="font-mono text-xs text-[var(--color-pjp-green)] uppercase tracking-widest font-bold">NODE R1 // DEPLOYMENT TELEMETRY</h3>
                  <p className="text-xs text-gray-500 font-mono">Real-time intelligence from Kanyakumari constituencies.</p>
                </div>
                <MetricsDashboard />
              </div>

              {/* News Feed Module */}
              <div className="space-y-4">
                <div className="border-b border-gray-800 pb-2">
                  <h3 className="font-mono text-xs text-[var(--color-pjp-green)] uppercase tracking-widest font-bold">NODE R2 // TRANSMISSION LOGS</h3>
                  <p className="text-xs text-gray-500 font-mono">Official strategic briefings and progressive campaigns.</p>
                </div>
                <NewsFeed />
              </div>

              {/* Module B & C: Official Dossier Maker */}
              <div className="space-y-4">
                <div className="border-b border-gray-800 pb-2">
                  <h3 className="font-mono text-xs text-[var(--color-pjp-green)] uppercase tracking-widest font-bold">NODE R3 // ID FACTORY</h3>
                  <p className="text-xs text-gray-500 font-mono">Generate and register your Poocha Janatha Party Official Dossier.</p>
                </div>
                <IDCardFactory />
              </div>

              {/* Module D: Mainframe Direct Contact Link */}
              <div className="space-y-4">
                <div className="border-b border-gray-800 pb-2">
                  <h3 className="font-mono text-xs text-[var(--color-pjp-green)] uppercase tracking-widest font-bold">NODE R4 // COMMAND MATRIX</h3>
                  <p className="text-xs text-gray-500 font-mono">Talk to the PJP Mainframe. Ask regional questions or report stray animal problems.</p>
                </div>
                <MainframeChat />
              </div>
            </div>
          )}

          {activeTab === 'executive' && (
            <div className="animate-fadeIn">
              <ExecutivePipeline />
            </div>
          )}

          {activeTab === 'voices' && (
            <div className="animate-fadeIn">
              <WallOfVoices />
            </div>
          )}
        </section>
        
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-pjp-green)]/30 bg-[#050505] py-12 mt-24">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <div className="flex justify-center items-center gap-2 mb-2 text-[var(--color-pjp-orange)] opacity-50">
            <PawPrint size={24} />
          </div>
          <p className="font-mono text-xs text-gray-500 font-bold tracking-wider">OFFICIAL PJP COMMUNICATIONS NETWORK</p>
          
          <div className="flex flex-wrap justify-center gap-6 font-mono text-xs pb-4">
            <a 
              href="https://www.instagram.com/poocha.janatha.party_official?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[var(--color-pjp-green)] hover:text-white transition-colors flex items-center gap-2"
            >
              <Instagram className="w-4 h-4 text-[var(--color-pjp-orange)]" />
              <span>Instagram: @poocha.janatha.party_official</span>
            </a>
            <a 
              href="mailto:poochajanathapartypjp@gmail.com" 
              className="text-[var(--color-pjp-orange)] hover:text-white transition-colors flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-[var(--color-pjp-green)]" />
              <span>Email: poochajanathapartypjp@gmail.com</span>
            </a>
          </div>

          <p className="font-mono text-xs text-gray-600">POOCHA JANATHA PARTY (PJP) • MAIN CONTROL FRAMEWORK</p>
          <p className="font-mono text-[10px] text-gray-700 max-w-2xl mx-auto leading-relaxed">
            This platform is an automated structural entity. Inspiration drawn from The Cockroach Janta Party (thecockroachjantaparty.org.in). Not a real political entity. Please treat all animals with kindness.
          </p>
        </div>
      </footer>
    </div>
  );
}
