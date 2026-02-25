
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, User, Twitter, ImageIcon, Globe, Youtube, Tag, MapPin } from 'lucide-react';
import { Circle, Theme } from '../types';
import { fetchCircleById } from '../services/api';

const CircleDetailView: React.FC<{ id: string, onBack: () => void; theme: Theme }> = ({ id, onBack, theme }) => {
   const [circle, setCircle] = useState<Circle | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const isNewspaper = theme === 'newspaper';

   useEffect(() => {
     const loadCircle = async () => {
       setIsLoading(true);
       try {
         const data = await fetchCircleById(id);
         setCircle(data);
       } catch (error) {
         console.error("Failed to fetch circle:", error);
       } finally {
         setIsLoading(false);
       }
     };
     loadCircle();
   }, [id]);

   if (isLoading) return <div className="p-20 text-center font-bold">加载中...</div>;
   if (!circle) return <div className="p-20 text-center font-bold">未找到社团信息</div>;

   // Helper for Social Icons to reduce duplication
   const SocialLink = ({ url, icon: Icon, label }: { url: string, icon: any, label: string }) => (
       <a href={url} target="_blank" rel="noreferrer" className={`w-10 h-10 flex items-center justify-center transition-all ${
           isNewspaper 
           ? 'bg-white border-2 border-black text-black hover:bg-black hover:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]' 
           : 'rounded-full bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900'
       }`}>
           <Icon size={18}/>
       </a>
   );

   return (
    <motion.div 
      className={`min-h-screen pb-20 pt-8 ${isNewspaper ? 'bg-[#FDFBF7]' : ''}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
    >
       <div className="max-w-5xl mx-auto px-4">
         <button onClick={onBack} className={`flex items-center mb-6 text-sm font-bold transition-colors ${isNewspaper ? 'text-black hover:text-red-600 font-mono uppercase' : 'text-slate-500 hover:text-slate-900 font-medium'}`}>
             <ChevronLeft size={16} className="mr-1" /> 返回列表
         </button>

         <div className={`${isNewspaper ? 'bg-white border-4 border-black newspaper-shadow' : 'bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100'}`}>
            {/* Banner */}
            <div className={`h-48 sm:h-64 relative ${isNewspaper ? 'bg-slate-100 border-b-4 border-black' : 'bg-slate-200'}`}>
               {circle.banner ? (
                   <img src={circle.banner || null} className={`w-full h-full object-cover`} />
               ) : <div className="w-full h-full bg-indigo-100"/>}
               
               {isNewspaper && (
                   <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-xs font-black uppercase tracking-widest skew-x-[-10deg]">
                       宣传资料
                   </div>
               )}
            </div>
            
            <div className="px-6 sm:px-8 pb-8">
               {/* Header Info */}
               <div className="flex flex-col sm:flex-row gap-6 -mt-12 mb-8 relative z-10">
                  <div className={`w-32 h-32 shrink-0 bg-white overflow-hidden ${
                      isNewspaper 
                      ? 'border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                      : 'rounded-2xl border-[4px] border-white shadow-lg'
                  }`}>
                     <img src={circle.image || null} className={`w-full h-full object-cover`} />
                  </div>
                  
                  <div className="pt-2 sm:pt-14 flex-1">
                     <h1 className={`text-3xl sm:text-4xl font-black mb-1 ${isNewspaper ? 'font-header text-slate-900' : 'text-slate-900'}`}>
                         {circle.name}
                     </h1>
                     <div className={`flex items-center font-medium ${isNewspaper ? 'text-slate-700 font-mono text-sm' : 'text-slate-500'}`}>
                        <User size={16} className="mr-1.5"/> {circle.penName}
                     </div>
                  </div>
                  
                  <div className="pt-0 sm:pt-14 flex gap-3">
                     {circle.socials.twitter && <SocialLink url={circle.socials.twitter} icon={Twitter} label="Twitter" />}
                     {circle.socials.pixiv && <SocialLink url={circle.socials.pixiv} icon={ImageIcon} label="Pixiv" />}
                     {circle.socials.website && <SocialLink url={circle.socials.website} icon={Globe} label="Web" />}
                     {circle.socials.youtube && <SocialLink url={circle.socials.youtube} icon={Youtube} label="YT" />}
                  </div>
               </div>

               <div className="grid lg:grid-cols-3 gap-10">
                  {/* Left Main Column */}
                  <div className="lg:col-span-2 space-y-10">
                     <section>
                        <h2 className={`text-lg font-bold mb-4 pb-2 ${isNewspaper ? 'border-b-2 border-black uppercase tracking-widest text-black' : 'text-slate-900 border-b border-slate-100'}`}>
                            关于社团
                        </h2>
                        <p className={`leading-relaxed whitespace-pre-line ${isNewspaper ? 'font-serif text-lg text-slate-800' : 'text-slate-600'}`}>{circle.description}</p>
                        
                        <div className="mt-4 flex flex-wrap gap-2">
                           {circle.tags?.map(t => (
                              <span key={t} className={`text-xs font-bold px-3 py-1 flex items-center ${
                                  isNewspaper 
                                  ? 'bg-white border border-black text-black' 
                                  : 'bg-slate-50 text-slate-600 rounded-full border border-slate-100'
                              }`}>
                                  <Tag size={12} className="mr-1"/> {t}
                              </span>
                           ))}
                        </div>
                     </section>

                     <section>
                        <h2 className={`text-lg font-bold mb-4 pb-2 ${isNewspaper ? 'border-b-2 border-black uppercase tracking-widest text-black' : 'text-slate-900 border-b border-slate-100'}`}>
                            参展履历
                        </h2>
                        <div className="space-y-4">
                           {circle.events.map((evt, i) => (
                              <div key={i} className={`flex gap-4 p-4 ${
                                  isNewspaper 
                                  ? 'bg-[#fffdf5] border border-black relative shadow-sm' 
                                  : 'rounded-xl bg-slate-50 border border-slate-100'
                              }`}>
                                 {isNewspaper && <div className="absolute top-2 right-2 w-2 h-2 bg-black rounded-full"></div>}
                                 <div className="flex-1">
                                    <div className={`font-bold ${isNewspaper ? 'text-black font-header' : 'text-slate-900'}`}>{evt.eventName}</div>
                                    <div className={`text-sm ${isNewspaper ? 'font-mono text-slate-600' : 'text-slate-500'}`}>{evt.date}</div>
                                 </div>
                                 <div className="text-right">
                                    <div className={`inline-block px-3 py-1 text-sm font-bold mb-1 ${
                                        isNewspaper 
                                        ? 'bg-black text-white' 
                                        : 'bg-white rounded-lg text-slate-700 shadow-sm border border-slate-100'
                                    }`}>
                                       {evt.spaceCode}
                                    </div>
                                    <div className={`text-xs font-bold uppercase ${
                                        evt.status === 'Upcoming' 
                                        ? (isNewspaper ? 'text-red-600 underline' : 'text-indigo-600') 
                                        : 'text-slate-400'
                                    }`}>
                                       {evt.status === 'Upcoming' ? '即将参加' : '已结束'}
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </section>
                  </div>
                  
                  {/* Right Sidebar Column */}
                  <div>
                     <section className={`${
                         isNewspaper 
                         ? 'bg-slate-100 border-2 border-black p-4' 
                         : 'bg-slate-50 rounded-2xl p-6 border border-slate-100'
                     }`}>
                        <h2 className={`text-lg font-bold mb-4 ${isNewspaper ? 'text-black uppercase tracking-widest' : 'text-slate-900'}`}>
                            作品展示
                        </h2>
                        <div className="grid grid-cols-2 gap-2">
                           {circle.gallery?.map((img, i) => (
                              <div key={i} className={`aspect-square overflow-hidden bg-white ${
                                  isNewspaper 
                                  ? 'border border-black p-1 shadow-md rotate-1 hover:rotate-0 transition-transform' 
                                  : 'rounded-lg border border-slate-200'
                              }`}>
                                 <div className="w-full h-full overflow-hidden relative">
                                    <img src={img || null} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                                    {isNewspaper && <div className="absolute inset-0 border border-black/10 pointer-events-none"></div>}
                                 </div>
                              </div>
                           ))}
                        </div>
                     </section>
                  </div>
               </div>
            </div>
         </div>
       </div>
    </motion.div>
   );
};

export default CircleDetailView;
