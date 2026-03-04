
import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, MapPin } from 'lucide-react';
import { Language, PublicEventListItem, EventSlot } from '../types';
import { fetchEvents, getCachedEvents } from '../services/api';
import EventSlotCard from '../components/EventSlotCard';
import EventFilters from '../components/EventFilters';
import { EventCardSkeleton } from '../components/Skeleton';

const WORLD_REGIONS = [
  { id: 'JAPAN', label: '日本国内' },
  { id: 'CN_MAINLAND', label: '中国大陆' },
  { id: 'OVERSEAS', label: '海外分社' },
  { id: 'GLOBAL', label: '全球综合流' },
];

const REGION_GROUPS: Record<string, Record<string, string[]>> = {
  JAPAN: {
    '关东 (东京圈)': ['东京', '千葉', '埼玉', '神奈川', '浜松町', '幕张', 'ビッグサイト'],
    '关西 (京都/大阪)': ['京都', '大阪', '神戸', '兵庫'],
    '其他地区': ['北海道', '札幌', '名古屋', '博多', '静冈'],
  },
  CN_MAINLAND: {
    '华东': ['上海', '杭州', '苏州', '南京', 'CP', 'Comicup'],
    '其他': ['北京', '广州', '深圳', '成都', '武汉'],
  },
  OVERSEAS: {
    '亚洲': ['台北', '香港', '澳门', '曼谷', '首尔', 'Bangkok', 'Taipei', 'Seoul'],
    '欧美/其他': ['USA', 'Europe', 'Canada', 'London', 'Paris', 'Anime Expo'],
  }
};

const getRegionGroup = (region: string, location: string): string => {
  const groups = REGION_GROUPS[region] || {};
  for (const [group, keywords] of Object.entries(groups)) {
    if (keywords.some(k => location.toLowerCase().includes(k.toLowerCase()))) return group;
  }
  return '其他区域';
};

const ITEMS_PER_PAGE = 12; 

interface EventListViewProps {
  onSelect: (id: string) => void; 
  userLanguage?: Language;
  activeRegion: string;
}

const EventListView: React.FC<EventListViewProps> = ({ onSelect, userLanguage, activeRegion }) => {
  const [events, setEvents] = useState<PublicEventListItem[]>(() => getCachedEvents() ?? []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  const [timeFilter, setTimeFilter] = useState<'UPCOMING' | 'PAST'>('UPCOMING');
  const [selectedLocalRegions, setSelectedLocalRegions] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(() => getCachedEvents() === null);

  const MOCK_TODAY = useMemo(() => new Date().toISOString().split('T')[0], []);

  const [hasAutoSwitched, setHasAutoSwitched] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const cached = getCachedEvents();

    if (cached) {
      setEvents(cached);
      setIsLoading(false);
    }

    const loadEvents = async () => {
      if (!cached) setIsLoading(true);
      try {
        const data = await fetchEvents({}, { forceRefresh: Boolean(cached) });
        if (!isMounted) return;
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        if (!isMounted) return;
        if (!cached) setIsLoading(false);
      }
    };
    loadEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setSelectedLocalRegions([]);
  }, [activeRegion]);

  // Auto-switch to PAST if UPCOMING is empty on initial load
  useEffect(() => {
    if (!isLoading && events.length > 0 && !hasAutoSwitched && timeFilter === 'UPCOMING') {
      const upcomingCount = events.filter(event => {
        const evRegion = event.marketRegion || 'JAPAN';
        if (activeRegion !== 'GLOBAL' && evRegion !== activeRegion) return false;
        const isPast = (event.startAt || '').split('T')[0] < MOCK_TODAY;
        return !isPast;
      }).length;

      if (upcomingCount === 0) {
        const pastCount = events.filter(event => {
          const evRegion = event.marketRegion || 'JAPAN';
          if (activeRegion !== 'GLOBAL' && evRegion !== activeRegion) return false;
          const isPast = (event.startAt || '').split('T')[0] < MOCK_TODAY;
          return isPast;
        }).length;

        if (pastCount > 0) {
          setTimeFilter('PAST');
          setHasAutoSwitched(true);
        }
      }
    }
  }, [isLoading, events, activeRegion, timeFilter, MOCK_TODAY, hasAutoSwitched]);

  const filteredRawEvents = useMemo(() => {
     return events.filter(event => {
        if (activeRegion !== 'GLOBAL') {
          const evRegion = event.marketRegion || 'JAPAN';
          if (evRegion !== activeRegion) return false;
        }
        const q = searchTerm.toLowerCase().trim();
        const matchSearch = !q || (
            (event.title?.toLowerCase().includes(q) ?? false) || 
            (event.summary?.toLowerCase().includes(q) ?? false) || 
            (event.location?.name?.toLowerCase().includes(q) ?? false)
        );
        if (!matchSearch) return false;
        
        const isPast = (event.startAt || '').split('T')[0] < MOCK_TODAY;
        if (timeFilter === 'UPCOMING' && isPast) return false;
        if (timeFilter === 'PAST' && !isPast) return false;
        
        if (activeRegion !== 'GLOBAL' && selectedLocalRegions.length > 0 && !selectedLocalRegions.includes(getRegionGroup(activeRegion, event.location?.name || ''))) return false;
        return true;
     }).sort((a, b) => (a.startAt || '').localeCompare(b.startAt || ''));
  }, [events, searchTerm, timeFilter, activeRegion, selectedLocalRegions, selectedGenres, MOCK_TODAY]);

  const processedSlots = useMemo(() => {
    const slotsMap = filteredRawEvents.reduce((acc, event) => {
      const date = (event.startAt || '0000-00-00').split('T')[0];
      const loc = event.location?.name || 'Unknown';
      const key = `${date} · ${loc}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(event);
      return acc;
    }, {} as Record<string, PublicEventListItem[]>);

    return Object.keys(slotsMap).map((key) => {
      const events = slotsMap[key];
      const parts = key.split(' · ');
      return { 
        key, 
        dateStr: parts[0], 
        locationStr: parts[1], 
        events: [...events].sort((a, b) => (b.boothCount || 0) - (a.boothCount || 0)) 
      } as EventSlot;
    }).sort((a, b) => {
        if (timeFilter === 'PAST') return b.dateStr.localeCompare(a.dateStr); 
        return a.dateStr.localeCompare(b.dateStr); 
    });
  }, [filteredRawEvents, timeFilter]);

  /**
   * 报业风格标题解析逻辑
   */
  const getJournalisticLabels = (region: string) => {
    switch (region) {
      case 'JAPAN':
        return { badge: 'HQ BUREAU', title: '日本国内本部特刊' };
      case 'CN_MAINLAND':
        return { badge: 'CN BUREAU', title: '中国大陆频道特刊' };
      case 'OVERSEAS':
        return { badge: 'OVERSEA BUREAU', title: '海外分社联合特刊' };
      case 'GLOBAL':
        return { badge: 'GLOBAL FEED', title: '全球综合情报特报' };
      default:
        return { badge: 'AYA FEED', title: '同人展会特报' };
    }
  };

  const labels = getJournalisticLabels(activeRegion);
  const regionContextLabel = WORLD_REGIONS.find((r) => r.id === activeRegion)?.label ?? '幻想乡全域';

  return (
    <motion.div className="max-w-[1200px] mx-auto px-4 py-8 min-h-[100dvh]" initial={false} animate={{ opacity: 1 }}>
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b-4 border-[var(--paper-border)] pb-4">
        <div>
            <div className="bg-[var(--paper-accent)] text-[var(--paper-surface)] px-2 py-0.5 text-xs font-black uppercase tracking-widest mb-2 inline-block">
              {labels.badge}
            </div>
           <h1 className="text-3xl font-black font-header text-[var(--paper-text)]">
             {labels.title}
           </h1>
           <div className="mt-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--paper-text-muted)]">
             当前地区：{regionContextLabel}
           </div>
        </div>
        {hasAutoSwitched && (
          <div className="mt-4 md:mt-0 bg-[var(--paper-accent)]/10 border border-[var(--paper-accent)]/20 px-3 py-1.5 text-xs font-bold text-[var(--paper-accent)] flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--paper-accent)] animate-pulse"></span>
            当前时段暂无新展会，已自动切换至过往存档
          </div>
        )}
      </div>

      <div className="mb-12 sticky top-[68px] z-30 py-2 transition-all bg-[var(--paper-bg)]/95">
         <div className="flex gap-3">
            <div className="relative flex-1 group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-[var(--paper-text)]" size={18} />
                <input 
                  id="event-search"
                  name="event-search"
                  type="text" 
                  placeholder={activeRegion === 'GLOBAL' ? "搜索全球展会..." : `在 ${labels.title} 中检索...`}
                  className="w-full pl-12 pr-12 py-3.5 text-sm font-bold focus:outline-none transition-all bg-[var(--paper-surface)] border-2 border-[var(--paper-border)] focus:ring-4 focus:ring-[var(--paper-accent)]/10 shadow-[4px_4px_0px_0px_var(--paper-border)] text-[var(--paper-text)] placeholder-[var(--paper-text-muted)]/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button 
              onClick={() => setFiltersOpen(!filtersOpen)} 
              aria-label="打开筛选"
              className="px-5 flex items-center justify-center font-bold text-sm border-2 border-[var(--paper-border)] bg-[var(--paper-surface)] text-[var(--paper-text)] hover:bg-[var(--paper-border)] hover:text-[var(--paper-surface)] transition-colors"
            >
               <SlidersHorizontal size={18} />
            </button>
         </div>

         <EventFilters 
            isOpen={filtersOpen} timeFilter={timeFilter} setTimeFilter={setTimeFilter}
            selectedRegions={selectedLocalRegions} setSelectedRegions={setSelectedLocalRegions}
            selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres}
            availableRegionGroups={activeRegion === 'GLOBAL' ? [] : Object.keys(REGION_GROUPS[activeRegion] || {})}
            availableGenres={{ ips: [], types: [] }}
            onClearAll={() => { setSelectedLocalRegions([]); setSelectedGenres([]); setSearchTerm(''); }}
         />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8"><EventCardSkeleton count={4} /></div>
      ) : (
        <>
          {processedSlots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {processedSlots.slice(0, visibleCount).map(slot => (
                <div key={slot.key} className="relative">
                  <EventSlotCard slot={slot} onSelect={onSelect} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-[var(--paper-border)]/20 rounded-xl bg-[var(--paper-surface)]/50">
              <div className="text-[var(--paper-text-muted)]/40 mb-4 flex justify-center"><Search size={48} /></div>
              <h3 className="text-xl font-black text-[var(--paper-text)] mb-2">未找到相关展会</h3>
              <p className="text-[var(--paper-text-muted)] mb-6">尝试更换搜索词或调整筛选（地区可在顶部导航切换）</p>
              <button 
                onClick={() => { 
                  setSearchTerm(''); 
                  setSelectedLocalRegions([]);
                  setSelectedGenres([]);
                  setTimeFilter('PAST');
                }}
                className="px-6 py-2 bg-[var(--paper-border)] text-[var(--paper-surface)] text-xs font-black uppercase tracking-widest hover:bg-[var(--paper-accent)] transition-colors"
              >
                重置筛选并查看存档
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default EventListView;
