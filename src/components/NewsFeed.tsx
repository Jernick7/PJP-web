import React from 'react';
import { Rss, ChevronRight } from 'lucide-react';

const newsItems = [
  {
    id: 1,
    date: '2026-05-30',
    title: 'Youth Initiative Launched in Nagercoil',
    summary: 'The Ministry of Sports and Human Welfare has initiated a district-wide marathon for Kanyakumari youths, pledging 100% feline-approved hydration stations along the route.',
    link: '#'
  },
  {
    id: 2,
    date: '2026-05-28',
    title: 'CEO BS Vetoes Anti-Claw Regulation',
    summary: 'The supreme authority framework has officially denied the proposed claw-trimming mandate, citing "blatant disrespect to natural feline armaments".',
    link: '#'
  },
  {
    id: 3,
    date: '2026-05-25',
    title: 'New Shelter Protocol Active in Colachel',
    summary: 'Ministry of Cat and Animal Welfare announces advanced air-conditioned enclosures and automated feeding nodes for all rescued strays in the Colachel zone.',
    link: '#'
  },
  {
    id: 4,
    date: '2026-05-21',
    title: 'Mainframe Upgrades Complete',
    summary: 'Ministry of Communication confirms successful integration of the Gemini-2.5-Flash node. Tactical response times to citizen inquiries reduced by 400%.',
    link: '#'
  }
];

export function NewsFeed() {
  return (
    <div className="border border-[var(--color-pjp-green)] bg-[#050505] p-6 relative">
      <div className="flex items-center gap-3 mb-6 border-b border-[var(--color-pjp-green)] pb-3">
        <Rss size={24} className="text-[var(--color-pjp-orange)]" />
        <h3 className="font-sans font-bold text-xl text-white uppercase tracking-tight">
          Official PJP News Feed
        </h3>
      </div>

      <div className="space-y-6">
        {newsItems.map((item, index) => (
          <div key={item.id}>
            <div className="font-mono text-[10px] text-[var(--color-pjp-green)] mb-1">
              [TRANSMISSION LOG: {item.date}]
            </div>
            <h4 className="font-sans font-bold text-lg text-[var(--color-pjp-orange)] uppercase mb-2">
              {item.title}
            </h4>
            <p className="font-mono text-sm text-gray-400 mb-3 leading-relaxed">
              {item.summary}
            </p>
            <a 
              href={item.link}
              onClick={(e) => e.preventDefault()}
              className="inline-flex items-center gap-1 font-mono text-xs text-white hover:text-[var(--color-pjp-orange)] transition-colors border border-gray-800 hover:border-[var(--color-pjp-orange)] px-3 py-1 bg-black"
            >
              READ FULL DOSSIER <ChevronRight size={14} />
            </a>
            
            {index < newsItems.length - 1 && (
              <hr className="mt-6 border-t border-dashed border-[var(--color-pjp-green)] opacity-50" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
