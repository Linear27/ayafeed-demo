
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Map as MapIcon, Users, Newspaper, Layout, ArrowRight, X
} from 'lucide-react';
import { fetchEventBySlug, fetchCircles } from '../services/api';
import GuidelinesModal from '../components/GuidelinesModal';
import CirclePreviewModal from '../components/CirclePreviewModal';
import NewsDetailModal from '../components/NewsDetailModal';
import SubEventModal from '../components/SubEventModal';
import EventDetailHeader from '../components/event-detail/EventDetailHeader';
import EventOverviewSection from '../components/event-detail/EventOverviewSection';
import EventCirclesSection from '../components/event-detail/EventCirclesSection';
import EventInfoSection from '../components/event-detail/EventInfoSection';
import EventAccessSection from '../components/event-detail/EventAccessSection';
import { PublicCircleListItem, PublicEventDetailResponse } from '../types';
import { adaptEventDetail, AdaptedEventNewsItem } from '../services/adapters';

type TabType = 'OVERVIEW' | 'CIRCLES' | 'INFO' | 'ACCESS';

const EventDetailView: React.FC<{ id: string, onBack: () => void, onSelectCircle: (id: string) => void }> = ({ id, onBack, onSelectCircle }) => {
  const [rawEventData, setRawEventData] = useState<PublicEventDetailResponse | null>(null);
  const [eventCircles, setEventCircles] = useState<PublicCircleListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('OVERVIEW');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedFocus, setSelectedFocus] = useState<string[]>([]);
  
  const [page, setPage] = useState(1);
  const [activeFloorMapIndex, setActiveFloorMapIndex] = useState(0);
  const [previewCircle, setPreviewCircle] = useState<PublicCircleListItem | null>(null);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [showFloorMapModal, setShowFloorMapModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState<AdaptedEventNewsItem | null>(null);
  const [selectedSubEvent, setSelectedSubEvent] = useState<unknown | null>(null);

  const ITEMS_PER_PAGE = 24;

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [eventData, circlesData] = await Promise.all([
          fetchEventBySlug(id),
          fetchCircles({ eventId: id })
        ]);
        setRawEventData(eventData);
        setEventCircles(circlesData);
      } catch (error) {
        console.error("Failed to load event detail:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id]);

  const event = useMemo(() => rawEventData ? adaptEventDetail(rawEventData) : null, [rawEventData]);
  
  const circleMetadata = useMemo(() => {
    return eventCircles.map(c => {
      return { id: c.id, focus: 'REGULAR', featuredProduct: null };
    });
  }, [eventCircles]);

  if (isLoading) return <div className="p-20 text-center font-bold">加载中...</div>;
  if (!event) return <div className="p-20 text-center font-bold">未找到展会信息</div>;

  const NewsArchiveItem: React.FC<{ news: AdaptedEventNewsItem; isPreview?: boolean }> = ({ news }) => {
    const dateLabel = news.date
      ? `${news.date.split('-')[1]}/${news.date.split('-')[2]}`
      : '--/--';

    return (
    <div onClick={() => setSelectedNews(news)} className="group flex gap-4 cursor-pointer items-center p-4 border border-[var(--paper-border)]/20 hover:border-[var(--paper-accent)] bg-[var(--paper-surface)] hover:bg-[var(--paper-bg-secondary)]/30 mb-2 transition-colors">
      <div className="flex flex-col items-center justify-center w-14 shrink-0 py-1 border-r border-[var(--paper-border)]/20">
        <span className="text-xs font-mono font-black leading-none text-[var(--paper-accent)]">{dateLabel}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-sm truncate leading-tight transition-colors text-[var(--paper-text)] group-hover:text-[var(--paper-accent)] font-header">{news.title}</h4>
      </div>
      <ArrowRight size={14} className="shrink-0 opacity-0 group-hover:opacity-100 transition-all text-[var(--paper-accent)]" />
    </div>
    );
  };

  const TabButton = ({ tab, label, icon: Icon }: { tab: TabType, label: string, icon: React.ComponentType<{ size?: number; className?: string }> }) => (
    <button onClick={() => setActiveTab(tab)} className={`relative px-5 py-4 text-sm font-black border-r-2 border-t-2 border-l-2 border-[var(--paper-border)] mr-[-2px] bg-[var(--paper-bg-secondary)]/50 transition-all z-10 rounded-t-lg shrink-0 ${activeTab === tab ? 'z-20 bg-[var(--paper-surface)] translate-y-[2px] pb-5' : 'text-[var(--paper-text-muted)] bg-[var(--paper-bg-secondary)]/30 hover:bg-[var(--paper-bg-secondary)]/50 top-[4px]'}`}>
      <div className="flex items-center">
         <Icon size={16} className={`mr-2 shrink-0 ${activeTab === tab ? 'text-[var(--paper-accent)]' : 'text-[var(--paper-text-muted)]/40'}`} />
         <span className="whitespace-nowrap uppercase tracking-tighter">{label}</span>
      </div>
    </button>
  );

  return (
    <motion.div className="min-h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="bg-[var(--paper-surface)] border-b-2 border-[var(--paper-border)] pb-4">
        <div className="max-w-[1200px] mx-auto">
          <EventDetailHeader event={event} circleCount={eventCircles.length} onBack={onBack} onSelectCirclesTab={() => setActiveTab('CIRCLES')} />
        </div>
      </div>

      <div className="bg-[var(--paper-surface)]">
        <div className="max-w-[1200px] mx-auto px-4 border-b-2 border-[var(--paper-border)] -mt-[2px] flex overflow-x-auto hide-scrollbar">
          <div className="flex shrink-0">
            <TabButton tab="OVERVIEW" label="内容总览" icon={Layout} />
            <TabButton tab="CIRCLES" label="参展社团" icon={Users} />
            <TabButton tab="INFO" label="展会公告" icon={Newspaper} />
            <TabButton tab="ACCESS" label="交通路线" icon={MapIcon} />
          </div>
          <div className="flex-1 border-b-2 border-[var(--paper-border)] min-w-[20px]"></div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-8 min-h-[500px]">
        <AnimatePresence mode="wait">
          {activeTab === 'OVERVIEW' && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <EventOverviewSection event={event} onOpenGuidelines={() => setShowGuidelines(true)} onSelectSubEvent={setSelectedSubEvent} renderNewsArchiveItem={(news) => <NewsArchiveItem news={news} />} />
            </motion.div>
          )}

          {activeTab === 'CIRCLES' && (
            <motion.div key="circles" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
               <EventCirclesSection circles={eventCircles} circleMetadata={circleMetadata} searchQuery={searchQuery} setSearchQuery={setSearchQuery} showFilters={showFilters} setShowFilters={setShowFilters} selectedFocus={selectedFocus} setSelectedFocus={setSelectedFocus} selectedLocations={selectedLocations} setSelectedLocations={setSelectedLocations} availableLocations={[]} displayedCircles={eventCircles.slice(0, page * ITEMS_PER_PAGE)} hasMore={page * ITEMS_PER_PAGE < eventCircles.length} onLoadMore={() => setPage(p => p + 1)} onPreviewCircle={setPreviewCircle} eventId={id} />
            </motion.div>
          )}

          {activeTab === 'INFO' && (
            <motion.div key="info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <EventInfoSection event={event} renderNewsArchiveItem={(news) => <NewsArchiveItem news={news} />} />
            </motion.div>
          )}

          {activeTab === 'ACCESS' && (
            <motion.div key="access" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <EventAccessSection event={event} setActiveFloorMapIndex={setActiveFloorMapIndex} setShowFloorMapModal={setShowFloorMapModal} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedNews && <NewsDetailModal newsItem={selectedNews} onClose={() => setSelectedNews(null)} />}
        {previewCircle && <CirclePreviewModal circle={previewCircle} eventId={id} onClose={() => setPreviewCircle(null)} onNavigateToDetail={() => onSelectCircle(previewCircle.id)} />}
        {showGuidelines && <GuidelinesModal docs={event.docs} onClose={() => setShowGuidelines(false)} />}
        {selectedSubEvent && <SubEventModal subEvent={selectedSubEvent} parentEvent={event} onClose={() => setSelectedSubEvent(null)} />}
        
        {showFloorMapModal && event.floorMapImages && event.floorMapImages.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--paper-border)]/90 p-4 sm:p-10"
            onClick={() => setShowFloorMapModal(false)}
          >
            <button className="absolute right-6 top-6 z-[110] text-[var(--paper-surface)] transition-colors hover:text-[var(--paper-accent)]">
              <X size={40} />
            </button>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-h-full w-full max-w-5xl overflow-auto border-4 border-[var(--paper-border)] bg-[var(--paper-surface)] p-[var(--space-sm)]"
              onClick={e => e.stopPropagation()}
            >
              <img 
                src={event.floorMapImages[activeFloorMapIndex] || null} 
                className="w-full h-auto" 
                alt={`Floor Map ${activeFloorMapIndex + 1}`} 
              />
              <div className="absolute bottom-4 left-4 bg-[var(--paper-border)] px-[var(--space-md)] py-[var(--space-sm)] text-sm font-black tracking-widest text-[var(--paper-surface)] uppercase">
                平面图 {activeFloorMapIndex + 1}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EventDetailView;
