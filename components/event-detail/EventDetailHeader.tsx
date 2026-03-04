
import React from 'react';
import { ChevronLeft, ExternalLink, Calendar, MapPin, Users } from 'lucide-react';
import { PublicEventDetail, Theme } from '../../types';

import { AdaptedEventDetail } from '../../services/adapters';

interface EventDetailHeaderProps {
  event: AdaptedEventDetail;
  circleCount: number;
  onBack: () => void;
  onSelectCirclesTab: () => void;
}

const EventDetailHeader: React.FC<EventDetailHeaderProps> = ({ event, circleCount, onBack, onSelectCirclesTab }) => {
  const isLandscape = event.posterOrientation === 'landscape';

  return (
    <div className="bg-[var(--paper-surface)] border-b-2 border-[var(--paper-border)] relative z-10 pb-2">
      <div className="max-w-7xl mx-auto">
        <div className="px-4 py-3 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center text-[var(--paper-text)] hover:text-[var(--paper-accent)] text-xs sm:text-sm font-black font-mono uppercase tracking-tighter transition-colors">
            <ChevronLeft size={18} className="mr-1" /> 返回索引
          </button>
          <div className="text-xs sm:text-xs font-mono text-[var(--paper-text-muted)]/40">报告编号: {event.slug.toUpperCase()}</div>
        </div>

        <div className="px-4 pb-6 sm:pb-8 pt-2">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            {/* Poster Section */}
            {event.poster && (
              <div className={`w-full ${isLandscape ? 'md:w-96' : 'md:w-80'} shrink-0 relative flex justify-center`}>
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 ${isLandscape ? 'w-48' : 'w-40'} h-8 bg-[var(--paper-border)]/5 rotate-2 z-0`}></div>
                <div className={`${isLandscape ? 'aspect-video' : 'aspect-[3/4]'} w-full max-w-[320px] sm:max-w-none border-2 border-[var(--paper-border)] bg-[var(--paper-surface)] p-2 shadow-lg relative z-10 transform -rotate-1 transition-transform hover:rotate-0 duration-500`}>
                  <div className="w-full h-full bg-[var(--paper-bg-secondary)] overflow-hidden relative">
                    <img src={event.poster || null} className="w-full h-full object-cover" alt="Event Poster" />
                  </div>
                </div>
              </div>
            )}

            {/* Meta Section */}
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="bg-[var(--paper-accent)] text-[var(--paper-surface)] px-2 py-0.5 text-xs font-black uppercase tracking-wider">专题报导</span>
                {event.genres?.slice(0, 2).map((g: string) => (
                  <span key={g} className="px-2 py-0.5 text-xs font-black border border-[var(--paper-border)] uppercase tracking-tighter bg-[var(--paper-surface)] text-[var(--paper-text)]">{g}</span>
                ))}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[var(--paper-text)] leading-[1.05] mb-6 font-header border-b-4 border-double border-[var(--paper-border)]/20 pb-4">
                {event.title}
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 font-header">
                <div className="flex items-start gap-4 p-4 border-2 border-[var(--paper-border)] bg-[var(--paper-surface)] newspaper-shadow-sm">
                  <div className="p-2 shrink-0 bg-[var(--paper-accent)] text-[var(--paper-surface)]">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-[var(--paper-text-muted)] mb-1">举办日期</div>
                    <div className="text-xl sm:text-2xl font-black leading-none text-[var(--paper-text)]">{event.date}</div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 border-2 border-[var(--paper-border)] bg-[var(--paper-surface)] newspaper-shadow-sm">
                  <div className="p-2 shrink-0 bg-[var(--paper-border)] text-[var(--paper-surface)]">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-[var(--paper-text-muted)] mb-1">举办城市</div>
                    <div className="text-lg sm:text-xl font-black leading-tight flex flex-wrap items-center">
                      {event.location && (
                        <div className="mr-3 px-2 py-1 flex items-center bg-[var(--paper-surface)] border-2 border-[var(--paper-border)] shadow-[2px_2px_0px_0px_var(--paper-border)]">
                          <span className="text-base font-black tracking-[0.15em] text-[var(--paper-text)]">{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="prose prose-slate prose-lg max-w-none text-[var(--paper-text)] font-serif leading-relaxed mb-8 border-l-4 border-[var(--paper-accent)] pl-6 bg-[var(--paper-bg-secondary)]/10 py-2 italic">
                {event.description}
              </div>

              <div className="mt-auto flex flex-col sm:flex-row gap-4">
                {event.website && (
                  <a href={event.website} target="_blank" rel="noreferrer"
                    className="px-8 py-4 bg-[var(--paper-border)] text-[var(--paper-surface)] font-black text-sm border-2 border-transparent text-center hover:bg-[var(--paper-surface)] hover:text-[var(--paper-text)] hover:border-[var(--paper-border)] transition-all shadow-[6px_6px_0px_0px_var(--paper-accent)] flex items-center justify-center active:translate-y-1 active:shadow-none uppercase tracking-widest"
                  >
                    <ExternalLink size={18} className="mr-2" /> 官方网站
                  </a>
                )}
                <button onClick={onSelectCirclesTab}
                  className="px-8 py-4 bg-[var(--paper-surface)] text-[var(--paper-text)] font-black text-sm border-2 border-[var(--paper-border)] text-center hover:bg-[var(--paper-bg-secondary)]/30 transition-all flex items-center justify-center active:translate-y-1 uppercase tracking-widest"
                >
                  <Users size={18} className="mr-2" /> 检索社团 ({circleCount})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailHeader;
