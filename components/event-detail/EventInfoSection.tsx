
import React from 'react';
import { PublicEventDetail, Theme } from '../../types';

interface EventInfoSectionProps {
  event: PublicEventDetail;
  renderNewsArchiveItem: (news: any) => React.ReactNode;
}

const EventInfoSection: React.FC<EventInfoSectionProps> = ({ event, renderNewsArchiveItem }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-5 sm:p-8 border-2 border-black newspaper-shadow-sm h-fit">
        <h3 className="font-black text-xl sm:text-2xl mb-6 font-header border-b-2 border-black pb-2 uppercase tracking-widest">公告存档</h3>
        <div className="space-y-1">
          {event.news?.map((news, i) => (
            <React.Fragment key={i}>{renderNewsArchiveItem(news)}</React.Fragment>
          ))}
          {(!event.news || event.news.length === 0) && (
             <div className="text-center py-12 text-slate-400 italic text-sm font-serif">
                尚无发布的公告存档。
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventInfoSection;
