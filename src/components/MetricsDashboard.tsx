import React, { useState, useEffect } from 'react';
import { ChevronDown, BarChart2, CheckCircle, Shield } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const ministries = [
  {
    title: "1. Ministry of Sports and Human Welfare",
    desc: "Overseeing athletic development and human enrichment programs to ensure peak performance for the Pride."
  },
  {
    title: "2. Ministry of Communication, Telecom & Technology",
    desc: "Regulating the flow of information, maintaining the Mainframe, and advancing Kanyakumari's digital infrastructure."
  },
  {
    title: "3. Ministry of Cat and Animal Welfare",
    desc: "CORE DIRECTIVE: Managing rescue operations, adoption drives, and maintaining state-of-the-art feline shelters."
  },
  {
    title: "4. Ministry of Home and Membership Affairs",
    desc: "Processing recruitments, verifying feline alignment, and issuing official PJP dossiers to citizens."
  },
  {
    title: "5. Ministry of BS Allied Party Defence & Law",
    desc: "Enforcing discipline, defending party integrity, and neutralizing threats against the progressive society agenda."
  },
  {
    title: "6. Ministry of Health and Happiness",
    desc: "Ensuring mental and physical well-being through mandatory pet therapy and accessible medical care."
  }
];

export function MetricsDashboard() {
  const [paws, setPaws] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchPaws = async () => {
      try {
        const res = await fetch('/api/metrics/paws');
        if (res.ok) {
          const data = await res.json();
          setPaws(data.count);
        }
      } catch (err) {
        console.error("Mainframe metrics retrieval failure:", err);
      }
    };

    fetchPaws();
    const interval = setInterval(fetchPaws, 3000); // Synchronize count status with backend every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      {/* Live Metrics Ticker */}
      <div className="border border-[var(--color-pjp-green)] bg-black p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-pjp-orange)] opacity-50"></div>
        <h2 className="font-mono text-xs uppercase text-[var(--color-pjp-green)] mb-2 flex items-center gap-2">
          <BarChart2 size={14} /> Live Feline Metrics
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
          <div className="p-3 border border-gray-800 bg-[#0a0a0a]">
            <div className="text-gray-500 text-xs mb-1">Paws Enrolled</div>
            <div className="text-2xl text-[var(--color-pjp-orange)]">{paws.toLocaleString()}+</div>
          </div>
          <div className="p-3 border border-gray-800 bg-[#0a0a0a]">
            <div className="text-gray-500 text-xs mb-1">Energy Grid</div>
            <div className="text-2xl text-[var(--color-pjp-green)] flex items-center gap-2">
              100% Cat Powered <CheckCircle size={18} className="text-[var(--color-pjp-green)]" />
            </div>
          </div>
          <div className="p-3 border border-gray-800 bg-[#0a0a0a]">
            <div className="text-gray-500 text-xs mb-1">Operational Sectors</div>
            <div className="text-2xl text-white">6 Regional Units</div>
          </div>
        </div>
      </div>

      <hr className="border-t border-[var(--color-pjp-green)] opacity-30" />

      {/* Accordions */}
      <div>
        <h3 className="font-sans font-bold text-xl mb-4 text-white uppercase tracking-tight">
          Official PJP Ministries
        </h3>
        <div className="border-t border-l border-r border-[var(--color-pjp-green)]">
          {ministries.map((min, idx) => (
            <div key={idx} className="border-b border-[var(--color-pjp-green)] bg-black">
              <button 
                onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                className="w-full text-left px-4 py-3 flex justify-between items-center hover:bg-[#050505] transition-colors"
              >
                <span className="font-sans font-semibold text-[var(--color-pjp-orange)]">{min.title}</span>
                <ChevronDown 
                  size={18} 
                  className={cn("text-[var(--color-pjp-green)] transition-transform duration-200", 
                    expandedIndex === idx ? "rotate-180" : ""
                  )} 
                />
              </button>
              <AnimatePresence>
                {expandedIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-[#050505]"
                  >
                    <div className="px-4 pb-4 pt-1 font-mono text-sm text-gray-300 border-l-2 border-[var(--color-pjp-orange)] ml-4">
                      {min.desc}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        
        {/* Social Awareness Commission */}
        <div className="mt-4 border border-dashed border-[var(--color-pjp-orange)] p-4 bg-[#0d0700] flex items-start gap-4">
          <Shield className="text-[var(--color-pjp-orange)] mt-1 flex-shrink-0" size={20} />
          <div>
            <h4 className="font-bold text-[var(--color-pjp-orange)] uppercase text-sm mb-1">
              Social Awareness Commission
            </h4>
            <p className="text-sm font-mono text-gray-400">
              Reporting directly to the leadership framework. Tasked with ideological alignment, neutralizing anti-feline propaganda, and ensuring the Kanyakumari district remains progressive.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
