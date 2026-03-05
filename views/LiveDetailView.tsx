import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  ChevronLeft,
  Clock,
  FileText,
  Globe,
  Info,
  LayoutList,
  MapPin,
  Mic2,
  ShoppingBag,
  Ticket,
} from 'lucide-react';
import { LIVES } from '../data';
import { Theme } from '../types';
import MapContainer from '../components/MapContainer';
import GuidelinesModal from '../components/GuidelinesModal';
import LiveDetailHero from '../components/live-detail/LiveDetailHero';

type TabKey = 'LINEUP' | 'TICKET' | 'GOODS' | 'INFO';

const LiveDetailView: React.FC<{ id: string; onBack: () => void; theme: Theme }> = ({
  id,
  onBack,
  theme: _theme,
}) => {
  const live = LIVES.find((item) => item.id === id);
  const [activeTab, setActiveTab] = useState<TabKey>('LINEUP');
  const [showGuidelines, setShowGuidelines] = useState(false);

  if (!live) {
    return (
      <div className="p-20 text-center font-bold text-[var(--paper-text-muted)]">
        未找到演出信息
      </div>
    );
  }

  const TabButton = ({
    tab,
    label,
    icon: Icon,
  }: {
    tab: TabKey;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }) => {
    const active = activeTab === tab;
    return (
      <button
        onClick={() => setActiveTab(tab)}
        className={`relative flex flex-1 items-center justify-center border-2 border-[var(--paper-border)] px-[var(--space-sm)] py-[var(--space-md)] text-sm font-black transition-colors sm:px-[var(--space-lg)] sm:text-base ${
          active
            ? 'bg-[var(--paper-border)] text-[var(--paper-surface)]'
            : 'bg-[var(--paper-surface)] text-[var(--paper-text)] hover:bg-[var(--paper-hover)]'
        }`}
      >
        <Icon size={18} className="mr-[var(--space-sm)] hidden sm:block" />
        {label}
        {active ? (
          <div className="absolute -bottom-3 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-[var(--paper-border)]" />
        ) : null}
      </button>
    );
  };

  return (
    <motion.div
      className="min-h-screen bg-[var(--paper-bg)] pb-20"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
    >
      <div className="sticky top-16 z-40 flex items-center justify-between border-b border-[var(--paper-border)] bg-[var(--paper-bg)] px-4 py-[var(--space-sm)] transition-colors">
        <button
          onClick={onBack}
          className="flex items-center text-sm font-bold tracking-tight text-[var(--paper-text)] transition-colors hover:text-[var(--paper-accent)]"
        >
          <ChevronLeft size={18} className="mr-[var(--space-xs)]" /> 返回演出表
        </button>
        <div className="bg-[var(--paper-border)] px-[var(--space-sm)] py-[var(--space-xs)] text-[10px] font-mono font-bold text-[var(--paper-surface)]">
          LIVE 报导
        </div>
      </div>

      <LiveDetailHero live={live} theme={_theme} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-[var(--space-xl)]">
        <div className="border-4 border-[var(--paper-border)] bg-[var(--paper-surface)] p-[var(--space-sm)] shadow-[var(--paper-shadow-lg)]">
          <div className="mb-[var(--space-xl)] flex flex-wrap gap-[var(--space-sm)] px-[var(--space-md)] pt-[var(--space-md)]">
            <TabButton tab="LINEUP" label="出演名单" icon={Mic2} />
            <TabButton tab="TICKET" label="票务信息" icon={Ticket} />
            {live.goods && live.goods.length > 0 ? (
              <TabButton tab="GOODS" label="周边列表" icon={ShoppingBag} />
            ) : null}
            <TabButton tab="INFO" label="详情 & 交通" icon={Info} />
          </div>

          <div className="min-h-[400px] border-2 border-[var(--paper-border)] bg-[var(--paper-bg-secondary)] p-[var(--space-md)] sm:p-[var(--space-xl)]">
            <AnimatePresence mode="wait">
              {activeTab === 'INFO' ? (
                <motion.div
                  key="info"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mx-auto max-w-6xl"
                >
                  <div className="grid gap-[var(--space-xl)] md:grid-cols-12">
                    <div className="space-y-[var(--space-xl)] md:col-span-7">
                      <section>
                        <h3 className="mb-[var(--space-lg)] inline-flex items-center border-b-2 border-[var(--paper-border)] pb-[var(--space-sm)] font-header text-xl font-bold text-[var(--paper-text)]">
                          <LayoutList size={20} className="mr-[var(--space-sm)] text-[var(--paper-accent)]" />
                          时间轴 / Timetable
                        </h3>
                        {live.schedule && live.schedule.length > 0 ? (
                          <div className="relative ml-[var(--space-sm)] space-y-[var(--space-lg)] border-l-2 border-[var(--paper-border)] pl-[var(--space-xl)]">
                            {live.schedule.map((item, index) => (
                              <div key={`${item.time}-${index}`} className="relative">
                                <div className="absolute -left-[35px] top-1.5 h-4 w-4 rounded-full border-2 border-[var(--paper-border)] bg-[var(--paper-accent)]" />
                                <div className="font-mono text-xl leading-none font-black text-[var(--paper-text)]">
                                  {item.time}
                                </div>
                                {item.artist ? (
                                  <div className="mt-[var(--space-xs)] text-xs font-black text-[var(--paper-text-muted)] uppercase">
                                    {item.artist}
                                  </div>
                                ) : null}
                                <div className="mt-[var(--space-xs)] font-serif text-base text-[var(--paper-text)]">
                                  {item.description}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center border-2 border-dashed border-[var(--paper-border)]/30 p-[var(--space-xl)] text-[var(--paper-text-muted)]/60">
                            <Clock size={32} className="mb-[var(--space-sm)]" />
                            <div className="text-sm font-serif italic">暂无详细时间表</div>
                          </div>
                        )}
                      </section>

                      <section>
                        <h3 className="mb-[var(--space-lg)] inline-flex items-center border-b-2 border-[var(--paper-border)] pb-[var(--space-sm)] font-header text-xl font-bold text-[var(--paper-text)]">
                          <AlertTriangle
                            size={20}
                            className="mr-[var(--space-sm)] text-[var(--paper-accent)]"
                          />
                          参演注意事项
                        </h3>
                        {live.notes && live.notes.length > 0 ? (
                          <div className="border-2 border-[var(--paper-border)] bg-[var(--paper-surface)] p-[var(--space-lg)] shadow-[var(--paper-shadow-sm)]">
                            <ul className="space-y-[var(--space-md)]">
                              {live.notes.map((note, index) => (
                                <li
                                  key={`${note}-${index}`}
                                  className="flex items-start text-sm leading-relaxed text-[var(--paper-text)] sm:text-base"
                                >
                                  <div className="mr-[var(--space-sm)] mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--paper-accent)]" />
                                  <span className="font-serif">{note}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <div className="text-sm italic text-[var(--paper-text-muted)]/70">
                            暂无注意事项
                          </div>
                        )}
                      </section>
                    </div>

                    <div className="space-y-[var(--space-lg)] md:col-span-5">
                      <section>
                        <h3 className="mb-[var(--space-md)] flex items-center font-header text-lg font-bold text-[var(--paper-text)]">
                          <MapPin size={18} className="mr-[var(--space-sm)] text-[var(--paper-accent)]" />
                          场馆信息
                        </h3>
                        <div className="relative mb-[var(--space-sm)] aspect-[16/10] w-full overflow-hidden border-2 border-[var(--paper-border)] bg-[var(--paper-bg-secondary)]">
                          {live.venueCoordinates ? (
                            <MapContainer lng={live.venueCoordinates[0]} lat={live.venueCoordinates[1]} />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[var(--paper-text-muted)]/50">
                              无地图数据
                            </div>
                          )}
                        </div>
                      </section>

                      <div className="grid grid-cols-1 gap-[var(--space-sm)] sm:grid-cols-2">
                        {live.website ? (
                          <a
                            href={live.website}
                            target="_blank"
                            rel="noreferrer"
                            className="flex flex-col justify-between border-2 border-[var(--paper-border)] bg-[var(--paper-surface)] p-[var(--space-md)] shadow-[var(--paper-shadow-sm)] transition-colors hover:bg-[var(--paper-hover)]"
                          >
                            <Globe size={20} className="text-[var(--paper-accent)]" />
                            <div className="mt-[var(--space-sm)] text-xs font-black">官方网站</div>
                          </a>
                        ) : null}
                        <button
                          onClick={() => setShowGuidelines(true)}
                          className="flex flex-col justify-between border-2 border-[var(--paper-border)] bg-[var(--paper-surface)] p-[var(--space-md)] text-left shadow-[var(--paper-shadow-sm)] transition-colors hover:bg-[var(--paper-hover)]"
                        >
                          <FileText size={20} className="text-[var(--paper-accent)]" />
                          <div className="mt-[var(--space-sm)] text-xs font-black">指南存档</div>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : null}

              {activeTab === 'LINEUP' ? (
                <motion.div key="lineup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="grid grid-cols-2 gap-[var(--space-lg)] sm:grid-cols-3 lg:grid-cols-4">
                    {live.artists?.map((artist, index) => (
                      <div key={`${artist.name}-${index}`} className="flex flex-col items-center text-center">
                        <div className="mb-[var(--space-md)] aspect-square w-full overflow-hidden border-2 border-[var(--paper-border)] bg-[var(--paper-surface)] shadow-[var(--paper-shadow-sm)]">
                          <img
                            src={artist.image || null}
                            className="h-full w-full object-cover"
                            alt={artist.name}
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <h3 className="font-header text-base font-bold text-[var(--paper-text)]">
                          {artist.name}
                        </h3>
                        <div className="text-xs text-[var(--paper-text-muted)]">{artist.role}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : null}

              {activeTab === 'TICKET' ? (
                <motion.div key="ticket" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {live.ticketTiers && live.ticketTiers.length > 0 ? (
                    <div className="mx-auto grid max-w-3xl gap-[var(--space-lg)]">
                      {live.ticketTiers.map((tier, index) => (
                        <div
                          key={`${tier.name}-${index}`}
                          className="flex flex-col items-center justify-between gap-[var(--space-md)] border-2 border-[var(--paper-border)] bg-[var(--paper-surface)] p-[var(--space-lg)] shadow-[var(--paper-shadow-sm)] sm:flex-row"
                        >
                          <div className="text-center sm:text-left">
                            <h4 className="mb-[var(--space-xs)] text-xl font-black text-[var(--paper-text)]">
                              {tier.name}
                            </h4>
                            <div className="text-sm font-bold tracking-widest text-[var(--paper-text-muted)] uppercase">
                              {tier.status}
                            </div>
                          </div>
                          <div className="flex flex-col items-center sm:items-end">
                            <div className="mb-[var(--space-sm)] text-2xl font-black text-[var(--paper-accent)]">
                              {tier.price}
                            </div>
                            <button className="border-2 border-[var(--paper-border)] bg-[var(--paper-border)] px-[var(--space-lg)] py-[var(--space-sm)] text-xs font-black tracking-widest text-[var(--paper-surface)] uppercase transition-colors hover:bg-[var(--paper-accent)]">
                              立即购票
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center border-2 border-dashed border-[var(--paper-border)]/30 bg-[var(--paper-surface)]/50">
                      <div className="mb-[var(--space-md)] flex justify-center text-[var(--paper-text-muted)]/50">
                        <Ticket size={48} />
                      </div>
                      <h3 className="mb-[var(--space-sm)] text-xl font-black text-[var(--paper-text)]">
                        票务信息暂未发布
                      </h3>
                      <p className="mx-auto mb-[var(--space-lg)] max-w-md text-[var(--paper-text-muted)]">
                        该演出的详细票档和购票链接尚未公开，请关注官方公告或订阅提醒。
                      </p>
                      <button className="border-2 border-[var(--paper-border)] bg-[var(--paper-border)] px-[var(--space-lg)] py-[var(--space-sm)] text-xs font-black tracking-widest text-[var(--paper-surface)] uppercase transition-colors hover:bg-[var(--paper-accent)]">
                        订阅开票提醒
                      </button>
                    </div>
                  )}
                </motion.div>
              ) : null}

              {activeTab === 'GOODS' ? (
                <motion.div key="goods" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {live.goods && live.goods.length > 0 ? (
                    <div className="grid grid-cols-2 gap-[var(--space-lg)] md:grid-cols-4">
                      {live.goods.map((item) => (
                        <div
                          key={item.id}
                          className="group overflow-hidden border-2 border-[var(--paper-border)] bg-[var(--paper-surface)] shadow-[var(--paper-shadow-sm)]"
                        >
                          <div className="aspect-square overflow-hidden bg-[var(--paper-bg-secondary)]">
                            <img
                              src={item.image || null}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              alt={item.name}
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="p-[var(--space-md)]">
                            <h4 className="mb-[var(--space-xs)] truncate text-sm font-bold text-[var(--paper-text)]">
                              {item.name}
                            </h4>
                            <div className="text-sm font-black text-[var(--paper-accent)]">{item.price}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center border-2 border-dashed border-[var(--paper-border)]/30 bg-[var(--paper-surface)]/50">
                      <div className="mb-[var(--space-md)] flex justify-center text-[var(--paper-text-muted)]/50">
                        <ShoppingBag size={48} />
                      </div>
                      <h3 className="mb-[var(--space-sm)] text-xl font-black text-[var(--paper-text)]">
                        周边列表暂无数据
                      </h3>
                      <p className="text-[var(--paper-text-muted)]">该演出的物贩信息尚未公开。</p>
                    </div>
                  )}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showGuidelines ? (
          <GuidelinesModal
            docs={live.docs || { attendee: [], circle: [] }}
            onClose={() => setShowGuidelines(false)}
            theme={_theme}
          />
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
};

export default LiveDetailView;
