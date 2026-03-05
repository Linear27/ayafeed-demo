import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Globe, ImageIcon, MapPin, Tag, Twitter, User, Youtube } from 'lucide-react';
import { Circle, Theme } from '../types';
import { fetchCircleById } from '../services/api';

const CircleDetailView: React.FC<{ id: string; onBack: () => void; theme: Theme }> = ({
  id,
  onBack,
  theme: _theme,
}) => {
  const [circle, setCircle] = useState<Circle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCircle = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCircleById(id);
        setCircle(data);
      } catch (error) {
        console.error('Failed to fetch circle:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCircle();
  }, [id]);

  if (isLoading) {
    return (
      <div className="p-20 text-center text-sm font-bold text-[var(--paper-text-muted)]">
        加载中...
      </div>
    );
  }

  if (!circle) {
    return (
      <div className="p-20 text-center text-sm font-bold text-[var(--paper-text-muted)]">
        未找到社团信息
      </div>
    );
  }

  const SocialLink = ({
    url,
    icon: Icon,
    label,
  }: {
    url: string;
    icon: React.ComponentType<{ size?: number }>;
    label: string;
  }) => (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center border-2 border-[var(--paper-border)] bg-[var(--paper-surface)] text-[var(--paper-text)] shadow-[var(--paper-shadow-sm)] transition-colors hover:bg-[var(--paper-hover)]"
    >
      <Icon size={18} />
    </a>
  );

  return (
    <motion.div
      className="min-h-screen bg-[var(--paper-bg)] pb-20 pt-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mx-auto max-w-5xl px-4">
        <button
          onClick={onBack}
          className="mb-[var(--space-lg)] flex items-center text-sm font-bold text-[var(--paper-text)] transition-colors hover:text-[var(--paper-accent)]"
        >
          <ChevronLeft size={16} className="mr-[var(--space-xs)]" /> 返回列表
        </button>

        <div className="overflow-hidden border-4 border-[var(--paper-border)] bg-[var(--paper-surface)] shadow-[var(--paper-shadow-lg)]">
          <div className="relative h-48 border-b-4 border-[var(--paper-border)] bg-[var(--paper-bg-secondary)] sm:h-64">
            {circle.banner ? (
              <img
                src={circle.banner}
                alt={`${circle.name} banner`}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="h-full w-full bg-[var(--paper-bg-secondary)]" />
            )}

            <div className="absolute left-[var(--space-md)] top-[var(--space-md)] border border-[var(--paper-border)] bg-[var(--paper-border)] px-[var(--space-sm)] py-[var(--space-xs)] text-xs font-black tracking-widest text-[var(--paper-surface)] uppercase">
              宣传资料
            </div>
          </div>

          <div className="px-[var(--space-lg)] pb-[var(--space-xl)] sm:px-[var(--space-xl)]">
            <div className="relative z-10 -mt-12 mb-[var(--space-xl)] flex flex-col gap-[var(--space-lg)] sm:flex-row">
              <div className="h-32 w-32 shrink-0 overflow-hidden border-4 border-[var(--paper-border)] bg-[var(--paper-surface)] shadow-[var(--paper-shadow-md)]">
                {circle.image ? (
                  <img
                    src={circle.image}
                    alt={circle.name}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="h-full w-full bg-[var(--paper-bg-secondary)]" />
                )}
              </div>

              <div className="flex-1 pt-2 sm:pt-14">
                <h1 className="mb-[var(--space-xs)] font-header text-3xl font-black text-[var(--paper-text)] sm:text-4xl">
                  {circle.name}
                </h1>
                <div className="flex items-center text-sm font-medium text-[var(--paper-text-muted)]">
                  <User size={16} className="mr-[var(--space-xs)]" /> {circle.penName}
                </div>
              </div>

              <div className="flex gap-[var(--space-sm)] pt-0 sm:pt-14">
                {circle.socials.twitter && (
                  <SocialLink url={circle.socials.twitter} icon={Twitter} label="Twitter" />
                )}
                {circle.socials.pixiv && (
                  <SocialLink url={circle.socials.pixiv} icon={ImageIcon} label="Pixiv" />
                )}
                {circle.socials.website && (
                  <SocialLink url={circle.socials.website} icon={Globe} label="Website" />
                )}
                {circle.socials.youtube && (
                  <SocialLink url={circle.socials.youtube} icon={Youtube} label="YouTube" />
                )}
              </div>
            </div>

            <div className="grid gap-[var(--space-xl)] lg:grid-cols-3">
              <div className="space-y-[var(--space-xl)] lg:col-span-2">
                <section>
                  <h2 className="mb-[var(--space-md)] border-b-2 border-[var(--paper-border)] pb-[var(--space-sm)] text-lg font-bold tracking-widest text-[var(--paper-text)] uppercase">
                    关于社团
                  </h2>
                  <p className="whitespace-pre-line font-serif text-lg leading-relaxed text-[var(--paper-text)]">
                    {circle.description}
                  </p>

                  <div className="mt-[var(--space-md)] flex flex-wrap gap-[var(--space-sm)]">
                    {circle.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center border border-[var(--paper-border)] bg-[var(--paper-surface)] px-[var(--space-sm)] py-[var(--space-xs)] text-xs font-bold text-[var(--paper-text)]"
                      >
                        <Tag size={12} className="mr-[var(--space-xs)]" /> {tag}
                      </span>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="mb-[var(--space-md)] border-b-2 border-[var(--paper-border)] pb-[var(--space-sm)] text-lg font-bold tracking-widest text-[var(--paper-text)] uppercase">
                    参展履历
                  </h2>
                  <div className="space-y-[var(--space-md)]">
                    {circle.events.map((event, index) => (
                      <div
                        key={`${event.eventId}-${index}`}
                        className="relative flex gap-[var(--space-md)] border border-[var(--paper-border)] bg-[var(--paper-bg-secondary)] p-[var(--space-md)]"
                      >
                        <div className="flex-1">
                          <div className="font-header font-bold text-[var(--paper-text)]">
                            {event.eventName}
                          </div>
                          <div className="text-sm text-[var(--paper-text-muted)]">{event.date}</div>
                        </div>
                        <div className="text-right">
                          <div className="mb-[var(--space-xs)] inline-block border border-[var(--paper-border)] bg-[var(--paper-border)] px-[var(--space-sm)] py-[var(--space-xs)] text-sm font-bold text-[var(--paper-surface)]">
                            {event.spaceCode}
                          </div>
                          <div
                            className={`text-xs font-bold uppercase ${
                              event.status === 'Upcoming'
                                ? 'text-[var(--paper-accent)] underline'
                                : 'text-[var(--paper-text-muted)]'
                            }`}
                          >
                            {event.status === 'Upcoming' ? '即将参加' : '已结束'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div>
                <section className="border-2 border-[var(--paper-border)] bg-[var(--paper-bg-secondary)] p-[var(--space-md)]">
                  <h2 className="mb-[var(--space-md)] text-lg font-bold tracking-widest text-[var(--paper-text)] uppercase">
                    作品展示
                  </h2>
                  <div className="grid grid-cols-2 gap-[var(--space-sm)]">
                    {circle.gallery?.map((image, index) => (
                      <div
                        key={`${circle.id}-gallery-${index}`}
                        className="group aspect-square overflow-hidden border border-[var(--paper-border)] bg-[var(--paper-surface)] p-[var(--space-xs)] shadow-[var(--paper-shadow-sm)]"
                      >
                        <div className="relative h-full w-full overflow-hidden">
                          <img
                            src={image}
                            alt={`${circle.name} gallery ${index + 1}`}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          <div className="pointer-events-none absolute inset-0 border border-[var(--paper-border)]/10" />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {circle.events.length > 0 ? (
                  <section className="mt-[var(--space-lg)] border-2 border-[var(--paper-border)] bg-[var(--paper-surface)] p-[var(--space-md)]">
                    <h3 className="mb-[var(--space-sm)] flex items-center text-sm font-black text-[var(--paper-text)] uppercase tracking-[0.12em]">
                      <MapPin size={14} className="mr-[var(--space-xs)]" />
                      近期出没
                    </h3>
                    <p className="text-sm text-[var(--paper-text-muted)]">
                      {circle.events[0]?.eventName ?? '暂无活动记录'}
                    </p>
                  </section>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CircleDetailView;
