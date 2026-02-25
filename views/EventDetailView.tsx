
import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import { PublicCircleListItem, Theme, PublicEventDetailResponse } from '../types';

type TabType = 'OVERVIEW' | 'CIRCLES' | 'INFO' | 'ACCESS';

const EventDetailView: React.FC<{ id: string, onBack: () => void, onSelectCircle: (id: string) => void }> = ({ id, onBack, onSelectCircle }) => {
  const [data, setData] = useState<PublicEventDetailResponse | null>(null);
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
  const [selectedNews, setSelectedNews] = useState<any | null>(null);
  const [selectedSubEvent, setSelectedSubEvent] = useState<any | null>(null);

  const ITEMS_PER_PAGE = 24;

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [eventData, circlesData] = await Promise.all([
          fetchEventBySlug(id),
          fetchCircles({ eventId: id })
        ]);
        setData(eventData);
        setEventCircles(circlesData);
      } catch (error) {
        console.error("Failed to load event detail:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id]);

  const event = data?.event;
  const location = data?.location;
  const meta = data?.meta;

  const city = location?.city || '';
  
  const circleMetadata = useMemo(() => {
    return eventCircles.map(c => {
      return { id: c.id, focus: 'REGULAR', featuredProduct: null };
    });
  }, [eventCircles]);

  if (isLoading) return <div className="p-20 text-center font-bold">加载中...</div>;
  if (!data || !event) return <div className="p-20 text-center font-bold">未找到展会信息</div>;

  const NewsArchiveItem: React.FC<{ news: any; isPreview?: boolean }> = ({ news, isPreview = false }) => (
    <div onClick={() => setSelectedNews(news)} className="group flex gap-4 cursor-pointer items-center p-4 border border-slate-200 hover:border-black bg-white hover:bg-slate-50 mb-2">
      <div className="flex flex-col items-center justify-center w-14 shrink-0 py-1 border-r border-black">
        <span className="text-xs font-mono font-black leading-none text-red-600">{news.date?.split('-')[1]}/{news.date?.split('-')[2]}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-sm truncate leading-tight transition-colors text-slate-900 group-hover:text-red-700 font-header">{news.title}</h4>
      </div>
      <ArrowRight size={14} className="shrink-0 opacity-0 group-hover:opacity-100 transition-all text-red-600" />
    </div>
  );

  const TabButton = ({ tab, label, icon: Icon }: { tab: TabType, label: string, icon: any }) => (
    <button onClick={() => setActiveTab(tab)} className={`relative px-5 py-4 text-sm font-black border-r-2 border-t-2 border-l-2 border-black mr-[-2px] bg-[#FDFBF7] transition-all z-10 rounded-t-lg shrink-0 ${activeTab === tab ? 'z-20 bg-white translate-y-[2px] pb-5' : 'text-slate-500 bg-slate-100 hover:bg-slate-50 top-[4px]'}`}>
      <div className="flex items-center">
         <Icon size={16} className={`mr-2 shrink-0 ${activeTab === tab ? 'text-red-600' : 'text-slate-400'}`} />
         <span className="whitespace-nowrap uppercase tracking-tighter">{label}</span>
      </div>
    </button>
  );

  return (
    <motion.div className="min-h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="bg-white border-b-2 border-black pb-4">
        <div className="max-w-[1200px] mx-auto">
          <EventDetailHeader event={event} city={city} circleCount={eventCircles.length} onBack={onBack} onSelectCirclesTab={() => setActiveTab('CIRCLES')} />
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-[1200px] mx-auto px-4 border-b-2 border-black -mt-[2px] flex overflow-x-auto hide-scrollbar">
          <div className="flex shrink-0">
            <TabButton tab="OVERVIEW" label="内容总览" icon={Layout} />
            <TabButton tab="CIRCLES" label="参展社团" icon={Users} />
            <TabButton tab="INFO" label="展会公告" icon={Newspaper} />
            <TabButton tab="ACCESS" label="交通路线" icon={MapIcon} />
          </div>
          <div className="flex-1 border-b-2 border-black min-w-[20px]"></div>
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
        
        {showFloorMapModal && event.floorMapImages && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10 bg-black/90"
            onClick={() => setShowFloorMapModal(false)}
          >
            <button className="absolute top-6 right-6 text-white hover:text-red-500 transition-colors z-[110]">
              <X size={40} />
            </button>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-full overflow-auto bg-white border-4 border-black p-2"
              onClick={e => e.stopPropagation()}
            >
              <img 
                src={event.floorMapImages[activeFloorMapIndex].url || null} 
                className="w-full h-auto" 
                alt={event.floorMapImages[activeFloorMapIndex].name} 
              />
              <div className="absolute bottom-4 left-4 bg-black text-white px-4 py-2 font-black uppercase tracking-widest text-sm">
                {event.floorMapImages[activeFloorMapIndex].name}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EventDetailView;
