
import React from 'react';
import { motion } from 'framer-motion';
import { X, User, MapPin, FileText, ShoppingBag, ExternalLink, Twitter, Globe, ImageIcon, Sparkles, BookOpen } from 'lucide-react';
import { Circle, PublicCircleListItem } from '../types';

type CirclePreviewData = Circle | (PublicCircleListItem & Record<string, unknown>);

interface CirclePreviewModalProps {
  circle: CirclePreviewData;
  eventId: string;
  onClose: () => void;
  onNavigateToDetail: () => void;
}

const CirclePreviewModal: React.FC<CirclePreviewModalProps> = ({ circle, eventId, onClose, onNavigateToDetail }) => {
  const compatCircle = circle as any;
  const eventData = Array.isArray(compatCircle.events)
    ? compatCircle.events.find((e: any) => e.eventId === eventId)
    : null;
  const products = eventData?.products || [];
  const displayName = compatCircle.name || compatCircle.title || '未命名社团';
  const displayGenres = compatCircle.genre || compatCircle.tags || [];
  const displayImage =
    compatCircle.image ||
    compatCircle.avatar?.urls?.original ||
    compatCircle.poster?.urls?.original ||
    'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=400&auto=format&fit=crop';
  const displayBanner = compatCircle.banner || compatCircle.avatar?.urls?.lg || displayImage;
  const displayDescription = compatCircle.description || compatCircle.summary || '该社团暂未提供详细简介。';
  const displaySocials = compatCircle.socials || compatCircle.platformUrls || {};
  const displayGallery = compatCircle.gallery || [];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 30 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.9, opacity: 0, y: 30 }}
        className="w-full max-w-4xl max-h-[90vh] relative flex flex-col overflow-hidden pointer-events-auto bg-[#FDFBF7] border-4 border-black newspaper-shadow"
      >
        {/* Close Button */}
        <button 
             onClick={onClose} 
             className="absolute top-4 right-4 z-30 p-2 transition-all bg-black text-white hover:bg-red-600 border-2 border-black"
           >
             <X size={20} />
        </button>

        <div className="flex-1 overflow-y-auto scroll-smooth">
           {/* Banner Area */}
           <div className="relative h-40 sm:h-56 shrink-0 border-b-4 border-black">
              {displayBanner ? (
                <img src={displayBanner} className="w-full h-full object-cover" alt="Banner" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full bg-slate-200" />
              )}
              <div className="absolute inset-0 bg-black/20"></div>
              
              {/* STAMP: Space Code (Newspaper Style) */}
              {eventData?.spaceCode && (
                 <div className="absolute -bottom-6 right-8 z-20">
                    <div className="relative transform rotate-6 scale-110">
                        <div className="bg-red-600 text-white font-mono font-black text-2xl px-6 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                           {eventData.spaceCode}
                        </div>
                        <div className="absolute -top-3 -left-3 bg-white text-black text-[8px] font-black border border-black px-1.5 py-0.5 transform -rotate-12">
                           BOOTH NO.
                        </div>
                    </div>
                 </div>
              )}
           </div>

           <div className="px-6 sm:px-10 pb-10">
             {/* Profile Row */}
             <div className="flex flex-col sm:flex-row gap-6 -mt-12 mb-10 relative z-10">
                <div className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 overflow-hidden bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                   <img src={displayImage} className="w-full h-full object-cover" alt={displayName} referrerPolicy="no-referrer" />
                </div>
                
                <div className="pt-2 sm:pt-14 flex-1 min-w-0">
                   <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                      <div>
                        <div className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-1">Circle Profile</div>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight mb-1 font-header">{displayName}</h2>
                        <div className="flex items-center text-slate-500 font-bold text-sm sm:text-base">
                           <User size={16} className="mr-2 text-red-600" />
                           {circle.penName}
                        </div>
                      </div>
                   </div>
                   
                   <div className="flex flex-wrap gap-2 mt-4">
                      {circle.classification && (
                         <span className="bg-black text-white px-2 py-0.5 text-[10px] font-black uppercase">
                           {circle.classification.mainType}
                         </span>
                      )}
                      {displayGenres.map((g: string) => (
                         <span key={g} className="px-2 py-0.5 text-[10px] font-bold border transition-colors bg-white border-black text-black">
                           {g}
                         </span>
                      ))}
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
               {/* Left Column: Bio & Products */}
               <div className="lg:col-span-8 space-y-12">
                 <section>
                    <h3 className="font-black text-lg mb-4 flex items-center uppercase tracking-widest font-header border-b-2 border-black pb-1">
                      <FileText size={18} className="mr-2 text-red-600" /> About Circle
                    </h3>
                    <div className="leading-relaxed text-slate-800 font-serif text-lg italic border-l-4 border-red-600 pl-6">
                      <p className="whitespace-pre-line">{displayDescription}</p>
                    </div>
                 </section>

                 <section>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-black text-lg flex items-center uppercase tracking-widest font-header border-b-2 border-black pb-1">
                            <ShoppingBag size={18} className="mr-2 text-red-600" /> Menu / Catalog
                        </h3>
                        <span className="text-[10px] font-bold font-mono text-slate-500">
                            {products.length} Items Listed
                        </span>
                    </div>
                    
                    {products.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4">
                        {products.map(p => (
                          <div key={p.id} className="flex gap-5 p-3 transition-all bg-white border border-slate-300 hover:border-black hover:shadow-md">
                             <div className="w-24 h-28 sm:w-28 sm:h-32 bg-slate-100 overflow-hidden shrink-0 border border-black">
                                <img src={p.image || null} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={p.title} />
                             </div>
                             <div className="flex-1 min-w-0 flex flex-col py-1">
                                <div className="flex justify-between items-start gap-4 mb-2">
                                   <div className="font-black text-base sm:text-lg leading-tight truncate font-header">
                                      {p.title}
                                   </div>
                                   {p.type === 'New' && (
                                      <div className="shrink-0 flex items-center gap-1 font-black text-[10px] px-2 py-0.5 bg-red-600 text-white skew-x-[-10deg]">
                                        <Sparkles size={10} />
                                        <span>NEW</span>
                                      </div>
                                   )}
                                </div>
                                <div className="text-sm mb-auto line-clamp-2 font-serif text-slate-600 italic">
                                  {p.description || 'No description provided for this exhibit.'}
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                   <div className="text-xl font-black font-mono text-red-600 underline decoration-double underline-offset-4">
                                      {p.price}
                                   </div>
                                   <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                      {p.type}
                                   </div>
                                </div>
                             </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-12 text-center border-2 border-dashed border-slate-300 bg-slate-50 font-serif italic text-slate-400">
                         <BookOpen size={32} className="mx-auto mb-3 opacity-20" />
                         Catalog is currently under preparation.
                      </div>
                    )}
                 </section>
               </div>

               {/* Right Column: Sidebar */}
               <div className="lg:col-span-4 space-y-6">
                  {/* Links Card */}
                  <div className="p-6 bg-[#F3F1E6] border-2 border-black newspaper-shadow-sm">
                     <h3 className="font-black mb-6 text-sm uppercase tracking-[0.2em] text-black">Dispatch Links</h3>
                     <div className="space-y-4">
                        {displaySocials.twitter && (
                          <a href={displaySocials.twitter} target="_blank" rel="noreferrer" className="flex items-center text-sm font-black transition-all group text-slate-900 hover:text-red-600">
                            <Twitter size={18} className="mr-3 shrink-0" /> Twitter <ExternalLink size={12} className="ml-auto opacity-30 group-hover:opacity-100 transition-opacity" />
                          </a>
                        )}
                         {displaySocials.pixiv && (
                          <a href={displaySocials.pixiv} target="_blank" rel="noreferrer" className="flex items-center text-sm font-black transition-all group text-slate-900 hover:text-red-600">
                            <ImageIcon size={18} className="mr-3 shrink-0" /> Pixiv <ExternalLink size={12} className="ml-auto opacity-30 group-hover:opacity-100 transition-opacity" />
                          </a>
                        )}
                        {displaySocials.website && (
                          <a href={displaySocials.website} target="_blank" rel="noreferrer" className="flex items-center text-sm font-black transition-all group text-slate-900 hover:text-red-600">
                            <Globe size={18} className="mr-3 shrink-0" /> Official Site <ExternalLink size={12} className="ml-auto opacity-30 group-hover:opacity-100 transition-opacity" />
                          </a>
                        )}
                     </div>
                  </div>

                  {/* Portfolio Preview */}
                  {displayGallery && displayGallery.length > 0 && (
                     <div className="p-6 bg-white border-2 border-black">
                        <h3 className="font-black mb-4 text-xs uppercase tracking-widest text-black">Portfolio Snippet</h3>
                        <div className="grid grid-cols-2 gap-2">
                           {displayGallery.slice(0, 4).map((img: string, i: number) => (
                              <div key={i} className="aspect-square overflow-hidden bg-slate-100 border border-black">
                               <img src={img} className="w-full h-full object-cover hover:scale-110 transition-all duration-500" referrerPolicy="no-referrer" />
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {/* Newspaper Watermark */}
                  <div className="pt-8 text-center opacity-10 pointer-events-none select-none">
                     <div className="font-header text-4xl font-black leading-none mb-1">文々。新闻</div>
                     <div className="text-[10px] font-mono font-bold tracking-[0.3em]">BUNBUNMARU SHIMBUN</div>
                  </div>
               </div>
             </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CirclePreviewModal;
