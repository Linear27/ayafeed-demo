
import React from 'react';
import { ExternalLink, FileText } from 'lucide-react';
import { PublicEventDetail, Theme } from '../../types';

interface EventOverviewSectionProps {
  event: PublicEventDetail;
  onOpenGuidelines: () => void;
  onSelectSubEvent: (sub: any) => void;
  renderNewsArchiveItem: (news: any, isPreview?: boolean) => React.ReactNode;
}

const EventOverviewSection: React.FC<EventOverviewSectionProps> = ({ event, onOpenGuidelines, onSelectSubEvent, renderNewsArchiveItem }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <section>
          <div className="flex items-center justify-between mb-4 border-b-2 border-black pb-1">
            <h3 className="font-black text-xl sm:text-2xl font-header uppercase tracking-widest">最新公告</h3>
          </div>
          <div className="space-y-1">
            {event.news?.slice(0, 3).map((news, i) => (
              <React.Fragment key={i}>{renderNewsArchiveItem(news, true)}</React.Fragment>
            ))}
          </div>
        </section>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 sm:p-8 border-4 border-black newspaper-shadow h-fit">
          <h3 className="font-black text-lg sm:text-xl mb-6 bg-black text-white px-3 py-1 inline-block uppercase tracking-widest font-header">展会数据卡</h3>
          <div className="space-y-4 text-xs sm:text-sm font-mono">
            <div className="flex justify-between border-b border-slate-300 pb-2">
              <span className="text-slate-500 font-black uppercase">摊位规模</span>
              <span className="font-black">{event.boothCount > 0 ? `${event.boothCount} SP` : '未定'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-300 pb-2">
              <span className="text-slate-500 font-black uppercase">主办团体</span>
              <span className="font-black truncate max-w-[150px] text-right">{event.organizer}</span>
            </div>
            <div className="flex justify-between border-b border-slate-300 pb-2">
              <span className="text-slate-500 font-black uppercase">官方地址</span>
              <a href={event.website} target="_blank" rel="noreferrer" className="font-black text-red-600 hover:underline">访问 <ExternalLink size={12} className="inline ml-1"/></a>
            </div>
          </div>
        </div>
        {event.docs?.length > 0 && (
          <button onClick={onOpenGuidelines} className="w-full bg-slate-100 hover:bg-black hover:text-white border-2 border-slate-400 border-dashed p-6 flex flex-col items-center justify-center gap-2 font-black text-xs sm:text-sm text-slate-700 transition-all uppercase tracking-[0.2em] active:scale-95">
            <FileText size={28}/> 
            打开参展指南存档
          </button>
        )}
      </div>
    </div>
  );
};

export default EventOverviewSection;
