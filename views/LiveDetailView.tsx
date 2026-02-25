
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Info, Mic2, Ticket, ShoppingBag, MapPin, AlertTriangle, ExternalLink, Clock, LayoutList, Globe, FileText, Download } from 'lucide-react';
import { LIVES } from '../data';
import { Theme } from '../types';
import MapContainer from '../components/MapContainer';
import GuidelinesModal from '../components/GuidelinesModal';
import LiveDetailHero from '../components/live-detail/LiveDetailHero';

const LiveDetailView: React.FC<{ id: string, onBack: () => void; theme: Theme }> = ({ id, onBack, theme }) => {
  const live = LIVES.find(l => l.id === id);
  const [activeTab, setActiveTab] = useState<'LINEUP' | 'TICKET' | 'GOODS' | 'INFO'>('LINEUP');
  const [showGuidelines, setShowGuidelines] = useState(false);
  const isNewspaper = theme === 'newspaper';

  if (!live) return <div className="p-20 text-center font-bold">未找到演出信息</div>;

  const TabButton = ({ tab, label, icon: Icon }: { tab: 'LINEUP' | 'TICKET' | 'GOODS' | 'INFO', label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center justify-center py-4 px-2 sm:px-6 font-bold text-sm sm:text-base transition-all relative ${
        activeTab === tab 
          ? (isNewspaper ? 'bg-black text-white' : 'text-indigo-600') 
          : (isNewspaper ? 'bg-white text-black hover:bg-slate-100' : 'text-slate-500 hover:text-slate-800')
      } ${isNewspaper ? 'border-2 border-black flex-1' : 'flex-1 border-b-2 ' + (activeTab === tab ? 'border-indigo-600' : 'border-transparent')}`}
    >
      <Icon size={18} className="mr-2 hidden sm:block" />
      {label}
      {isNewspaper && activeTab === tab && <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rotate-45 z-0"></div>}
    </button>
  );

  return (
    <motion.div className={`min-h-screen pb-20 ${isNewspaper ? 'bg-[#FDFBF7]' : 'bg-slate-50'}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
      <div className={`sticky top-16 z-40 px-4 py-3 flex items-center justify-between border-b transition-colors ${isNewspaper ? 'bg-[#FDFBF7] border-black' : 'bg-white/90 backdrop-blur-md border-slate-200'}`}>
        <button onClick={onBack} className={`flex items-center text-sm font-bold uppercase tracking-tight transition-colors ${isNewspaper ? 'text-slate-900 hover:text-red-600 font-mono' : 'text-slate-600 hover:text-indigo-600'}`}>
          <ChevronLeft size={18} className="mr-1" /> 返回演出表
        </button>
        {isNewspaper && <div className="text-[10px] font-mono font-bold bg-black text-white px-2 py-0.5 transform -skew-x-12">LIVE 报导</div>}
      </div>

      <LiveDetailHero live={live} theme={theme} />

      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        <div className={`${isNewspaper ? 'bg-white border-4 border-black newspaper-shadow p-2' : 'bg-white rounded-3xl shadow-xl overflow-hidden'}`}>
          <div className={`flex flex-wrap ${isNewspaper ? 'gap-2 mb-8 px-4 pt-4' : 'bg-slate-50 border-b border-slate-200'}`}>
            <TabButton tab="LINEUP" label="出演名单" icon={Mic2} />
            <TabButton tab="TICKET" label="票务信息" icon={Ticket} />
            {live.goods && live.goods.length > 0 && <TabButton tab="GOODS" label="周边列表" icon={ShoppingBag} />}
            <TabButton tab="INFO" label="详情 & 交通" icon={Info} />
          </div>

          <div className={`p-4 sm:p-8 min-h-[400px] ${isNewspaper ? 'bg-[#fffdf5] border-2 border-black' : 'bg-white'}`}>
            <AnimatePresence mode="wait">
              {activeTab === 'INFO' && (
                <motion.div key="info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-6xl mx-auto">
                  <div className="grid md:grid-cols-12 gap-10">
                    <div className="md:col-span-7 space-y-12">
                      <section>
                        <h3 className={`font-bold mb-6 flex items-center ${isNewspaper ? 'text-xl font-header border-b-2 border-black inline-block' : 'text-slate-900'}`}>
                          <LayoutList size={20} className="mr-3 text-red-600"/> 时间轴 / Timetable
                        </h3>
                        {live.schedule && live.schedule.length > 0 ? (
                          <div className={`space-y-6 ml-2 border-l-2 pl-8 relative ${isNewspaper ? 'border-black' : 'border-indigo-200'}`}>
                            {live.schedule.map((item, i) => (
                              <div key={i} className="relative">
                                <div className={`absolute -left-[33px] top-1.5 w-4 h-4 rounded-full border-2 ${isNewspaper ? 'bg-red-600 border-black' : 'bg-indigo-600 border-white ring-2 ring-indigo-100'}`}></div>
                                <div className="font-mono font-black text-xl leading-none text-slate-900">{item.time}</div>
                                {item.artist && <div className={`text-xs font-black mt-1 ${isNewspaper ? 'text-slate-500 uppercase' : 'text-indigo-600'}`}>{item.artist}</div>}
                                <div className={`text-base mt-1 ${isNewspaper ? 'font-serif' : 'font-medium'}`}>{item.description}</div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className={`p-8 border-2 border-dashed flex flex-col items-center justify-center opacity-40 ${isNewspaper ? 'border-slate-300' : 'bg-slate-50 border-slate-200 rounded-xl'}`}>
                            <Clock size={32} className="mb-2"/>
                            <div className="text-sm font-serif italic">暂无详细时间表。</div>
                          </div>
                        )}
                      </section>
                      <section>
                        <h3 className={`font-bold mb-6 flex items-center ${isNewspaper ? 'text-xl font-header border-b-2 border-black inline-block' : 'text-slate-900'}`}>
                          <AlertTriangle size={20} className="mr-3 text-red-600"/> 参演注意事项
                        </h3>
                        {live.notes && live.notes.length > 0 ? (
                          <div className={`p-6 ${isNewspaper ? 'bg-white border-2 border-black newspaper-shadow-sm' : 'bg-slate-50 rounded-2xl'}`}>
                            <ul className="space-y-4">
                              {live.notes.map((note, i) => (
                                <li key={i} className={`flex items-start text-sm sm:text-base leading-relaxed ${isNewspaper ? 'font-serif' : 'text-slate-700'}`}>
                                  <div className={`mr-3 mt-1 shrink-0 w-1.5 h-1.5 rounded-full ${isNewspaper ? 'bg-red-600' : 'bg-indigo-500'}`}></div>
                                  {note}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : <div className="text-sm italic opacity-40">暂无注意事项</div>}
                      </section>
                    </div>
                    <div className="md:col-span-5 space-y-6">
                      <section>
                        <h3 className={`font-bold mb-4 flex items-center ${isNewspaper ? 'text-lg font-header' : 'text-slate-900 text-sm uppercase tracking-wider'}`}>
                          <MapPin size={18} className="mr-2 text-red-600"/> 场馆信息
                        </h3>
                        <div className={`aspect-[16/10] w-full bg-[#E5E5E5] mb-2 relative ${isNewspaper ? 'border-2 border-black shadow-sm' : 'rounded-2xl overflow-hidden'}`}>
                          {live.venueCoordinates ? <MapContainer lng={live.venueCoordinates[0]} lat={live.venueCoordinates[1]} /> : <div className="w-full h-full flex items-center justify-center opacity-20">无地图数据</div>}
                        </div>
                      </section>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {live.website && (
                          <a href={live.website} target="_blank" rel="noreferrer" className={`p-4 flex flex-col justify-between transition-all ${isNewspaper ? 'bg-white border-2 border-black newspaper-shadow-sm' : 'bg-white rounded-xl border border-slate-200'}`}>
                            <Globe size={20} className={isNewspaper ? 'text-red-600' : 'text-indigo-600'} />
                            <div className="text-xs font-black mt-2">官方网站</div>
                          </a>
                        )}
                        <button onClick={() => setShowGuidelines(true)} className={`p-4 flex flex-col justify-between transition-all text-left ${isNewspaper ? 'bg-white border-2 border-black newspaper-shadow-sm' : 'bg-indigo-600 text-white rounded-xl'}`}>
                          <FileText size={20} />
                          <div className="text-xs font-black mt-2">指南存档</div>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              {activeTab === 'LINEUP' && (
                <motion.div key="lineup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
                    {live.artists?.map((artist, idx) => (
                      <div key={idx} className="flex flex-col items-center text-center">
                        <div className={`w-full aspect-square mb-4 overflow-hidden ${isNewspaper ? 'border-2 border-black' : 'rounded-2xl shadow-md'}`}>
                          <img src={artist.image || null} className="w-full h-full object-cover" alt={artist.name} referrerPolicy="no-referrer" />
                        </div>
                        <h3 className={`font-bold ${isNewspaper ? 'font-header' : ''}`}>{artist.name}</h3>
                        <div className="text-xs text-slate-500">{artist.role}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
              {activeTab === 'TICKET' && (
                <motion.div key="ticket" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {live.ticketTiers && live.ticketTiers.length > 0 ? (
                    <div className="grid gap-6 max-w-3xl mx-auto">
                      {live.ticketTiers.map((tier, i) => (
                        <div key={i} className={`p-6 flex flex-col sm:flex-row justify-between items-center gap-4 ${isNewspaper ? 'bg-white border-2 border-black newspaper-shadow-sm' : 'bg-slate-50 rounded-2xl'}`}>
                          <div className="text-center sm:text-left">
                            <h4 className="text-xl font-black mb-1">{tier.name}</h4>
                            <div className="text-sm text-slate-500 uppercase tracking-widest font-bold">{tier.status}</div>
                          </div>
                          <div className="flex flex-col items-center sm:items-end">
                            <div className="text-2xl font-black text-red-600 mb-2">{tier.price}</div>
                            <button className={`px-6 py-2 text-xs font-black uppercase tracking-widest transition-all ${isNewspaper ? 'bg-black text-white hover:bg-red-600' : 'bg-indigo-600 text-white hover:bg-indigo-700 rounded-full'}`}>
                              立即购票
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50">
                      <div className="text-slate-400 mb-4 flex justify-center"><Ticket size={48} /></div>
                      <h3 className="text-xl font-black text-slate-900 mb-2">票务信息暂未发布</h3>
                      <p className="text-slate-500 mb-6 max-w-md mx-auto">该演出的详细票档和购票链接尚未公开，请关注官方公告或订阅提醒。</p>
                      <button className="px-6 py-2 bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-colors">
                        订阅开票提醒
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
              {activeTab === 'GOODS' && (
                <motion.div key="goods" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {live.goods && live.goods.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {live.goods.map((item) => (
                        <div key={item.id} className={`overflow-hidden group ${isNewspaper ? 'bg-white border-2 border-black newspaper-shadow-sm' : 'bg-white rounded-2xl shadow-sm'}`}>
                          <div className="aspect-square overflow-hidden bg-slate-100">
                            <img src={item.image || null} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} referrerPolicy="no-referrer" />
                          </div>
                          <div className="p-4">
                            <h4 className="font-bold text-sm truncate mb-1">{item.name}</h4>
                            <div className="text-red-600 font-black text-sm">{item.price}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50">
                      <div className="text-slate-400 mb-4 flex justify-center"><ShoppingBag size={48} /></div>
                      <h3 className="text-xl font-black text-slate-900 mb-2">周边列表暂无数据</h3>
                      <p className="text-slate-500 mb-6">该演出的物贩信息尚未公开。</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showGuidelines && <GuidelinesModal docs={live.docs || { attendee: [], circle: [] }} onClose={() => setShowGuidelines(false)} theme={theme} />}
      </AnimatePresence>
    </motion.div>
  );
};

export default LiveDetailView;
