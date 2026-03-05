import React, { useEffect, useRef, useState } from 'react';
import { Menu, X, Globe, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from '@tanstack/react-router';
import { ViewState, Theme, Language, PreferredRegion } from '../types';
import BrandLogo from './BrandLogo';

interface NavbarProps {
  currentView: ViewState;
  theme: Theme;
  language: Language;
  onSetLanguage: (lang: Language) => void;
  region: PreferredRegion;
  onSetRegion: (region: PreferredRegion) => void;
}

type NewspaperHeaderState = 'top' | 'scrolled';

const REGION_OPTIONS: Array<{ code: PreferredRegion; label: string }> = [
  { code: 'GLOBAL', label: '全球版' },
  { code: 'JAPAN', label: '日本国内版' },
  { code: 'CN_MAINLAND', label: '中国大陆版' },
  { code: 'OVERSEAS', label: '海外分社版' },
];

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-(--paper-bg)';

const LanguageBadgeIcon = ({ size = 14 }: { size?: number }) => (
  <svg
    aria-hidden="true"
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <rect x="1" y="2" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" />
    <path d="M8 2.6V13.4" stroke="currentColor" strokeWidth="1" />
    <text x="4.5" y="10.6" textAnchor="middle" fontSize="6" fontWeight="700" fill="currentColor">
      A
    </text>
    <text x="11.5" y="10.6" textAnchor="middle" fontSize="5.5" fontWeight="700" fill="currentColor">
      文
    </text>
  </svg>
);

const Navbar: React.FC<NavbarProps> = ({
  currentView,
  theme,
  language,
  onSetLanguage,
  region,
  onSetRegion,
}) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isRegionMenuOpen, setIsRegionMenuOpen] = useState(false);
  const [headerState, setHeaderState] = useState<NewspaperHeaderState>('top');

  const mastheadRef = useRef<HTMLElement | null>(null);
  const langMenuRef = useRef<HTMLDivElement | null>(null);
  const regionMenuRef = useRef<HTMLDivElement | null>(null);
  const headerStateRef = useRef<NewspaperHeaderState>('top');
  const isDockPhaseRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  const isNewspaper = theme === 'newspaper';

  useEffect(() => {
    if (!isNewspaper) {
      headerStateRef.current = 'top';
      isDockPhaseRef.current = false;
      setHeaderState('top');
      return;
    }

    const SHOW_DOCK_WHEN_MASTHEAD_BOTTOM_LE = -24;
    const HIDE_DOCK_WHEN_MASTHEAD_BOTTOM_GE = 72;
    const TOP_SNAP_SCROLL_Y = 20;

    const setNextState = (nextState: NewspaperHeaderState) => {
      if (nextState === headerStateRef.current) return;
      headerStateRef.current = nextState;
      setHeaderState(nextState);
    };

    const updateHeaderState = () => {
      const masthead = mastheadRef.current;
      if (!masthead) return;

      const scrollY = window.scrollY;
      const mastheadBottom = masthead.getBoundingClientRect().bottom;
      let nextDockPhase = isDockPhaseRef.current;

      if (!nextDockPhase && mastheadBottom <= SHOW_DOCK_WHEN_MASTHEAD_BOTTOM_LE) {
        nextDockPhase = true;
      } else if (nextDockPhase && mastheadBottom >= HIDE_DOCK_WHEN_MASTHEAD_BOTTOM_GE) {
        nextDockPhase = false;
      }

      isDockPhaseRef.current = nextDockPhase;

      if (!nextDockPhase || scrollY <= TOP_SNAP_SCROLL_Y) {
        setNextState('top');
        return;
      }
      setNextState('scrolled');
    };

    const requestUpdate = () => {
      if (rafIdRef.current !== null) return;
      rafIdRef.current = window.requestAnimationFrame(() => {
        rafIdRef.current = null;
        updateHeaderState();
      });
    };

    updateHeaderState();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [isNewspaper]);

  useEffect(() => {
    if (headerState === 'top' && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [headerState, isMobileMenuOpen]);

  useEffect(() => {
    if (!isLangMenuOpen && !isRegionMenuOpen) return;

    const handleDocumentMouseDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (langMenuRef.current && !langMenuRef.current.contains(target)) {
        setIsLangMenuOpen(false);
      }

      if (regionMenuRef.current && !regionMenuRef.current.contains(target)) {
        setIsRegionMenuOpen(false);
      }
    };

    const handleDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLangMenuOpen(false);
        setIsRegionMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentMouseDown);
    document.addEventListener('keydown', handleDocumentKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleDocumentMouseDown);
      document.removeEventListener('keydown', handleDocumentKeyDown);
    };
  }, [isLangMenuOpen, isRegionMenuOpen]);

  const getBrandName = () => {
    if (language === 'zh') return '文文。速报';
    if (language === 'ja') return '文々。速報';
    return 'AyaFeed';
  };

  const getRegionLabel = () => {
    if (region === 'GLOBAL') return '全球版';
    if (region === 'JAPAN') return '日本国内版';
    if (region === 'CN_MAINLAND') return '中国大陆版';
    if (region === 'OVERSEAS') return '海外分社版';
    return '幻想乡全域版';
  };

  const navBg = isNewspaper ? 'bg-(--paper-bg) border-(--paper-border)' : 'bg-white/90 backdrop-blur-md border-slate-200';
  const activeText = isNewspaper ? 'text-(--paper-accent)' : 'text-indigo-600';
  const inactiveText = isNewspaper ? 'text-(--paper-text) hover:text-(--paper-accent)' : 'text-slate-600 hover:text-indigo-600';
  const underlineColor = isNewspaper ? 'bg-(--paper-accent)' : 'bg-indigo-600';
  const isDockVisible = headerState === 'scrolled';
  const isLandingRoute = location.pathname === '/';

  const handleBrandClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    setIsMobileMenuOpen(false);
    setIsLangMenuOpen(false);
    setIsRegionMenuOpen(false);

    if (!isLandingRoute) return;

    event.preventDefault();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  const NavItem = ({ to, label, className = '' }: { to: string; label: string; className?: string }) => (
    <Link
      to={to}
      onClick={() => setIsMobileMenuOpen(false)}
      className={`relative px-4 py-2 text-sm font-bold tracking-wide transition-colors duration-200 group ${className} ${FOCUS_RING}`}
      activeProps={{ className: activeText }}
      inactiveProps={{ className: inactiveText }}
    >
      {({ isActive }) => (
        <>
          {label}
          {!className.includes('w-full') && (
            <span
              aria-hidden="true"
              className={`absolute bottom-1 left-4 right-4 h-0.5 origin-left transform ${underlineColor} transition-transform duration-200 ${
                isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}
            ></span>
          )}
        </>
      )}
    </Link>
  );

  const BrandLink = ({
    compact = false,
    showText = true,
    textClassName = '',
    className = '',
  }: {
    compact?: boolean;
    showText?: boolean;
    textClassName?: string;
    className?: string;
  }) => (
    <Link
      to="/"
      onClick={handleBrandClick}
      className={`flex items-center gap-2 select-none ${className} ${FOCUS_RING}`}
      aria-label="返回首页"
    >
      <BrandLogo size={compact ? 'xs' : 'lg'} className={compact ? '' : 'hidden md:block'} />
      {showText ? (
        <span
          className={`font-brand ${compact ? 'text-sm md:text-base' : 'text-3xl md:text-6xl'} font-black uppercase leading-none tracking-tight ${textClassName}`}
        >
          {getBrandName()}
        </span>
      ) : null}
    </Link>
  );

  if (isNewspaper) {
    return (
      <>
        <header
          ref={mastheadRef}
          data-aya-masthead="true"
          data-aya-state={headerState}
          data-current-view={currentView}
          className={`w-full border-b border-(--paper-border) ${navBg}`}
        >
          <div className="mx-auto flex max-w-350 items-center justify-between px-6 py-4 md:py-6 text-(--paper-text)">
            <div className="hidden md:block md:flex-1" />

            <div className="flex flex-col items-center gap-2">
              <BrandLink />
              <div className="text-[10px] font-black uppercase tracking-[0.24em] opacity-45 md:mt-1">Gensokyo Intelligence Network / Est. 1000</div>
            </div>

            <div className="hidden md:block md:flex-1" />
          </div>

          <div className="hidden border-t border-(--paper-border)/10 md:block">
            <div className="mx-auto flex max-w-350 items-center gap-3 px-6 py-2">
              <div className="flex items-center md:w-56 lg:w-72">
                <div className="hidden items-center gap-3 whitespace-nowrap text-xs font-bold uppercase tracking-[0.12em] text-(--paper-text-muted) xl:flex">
                  <span>
                    {new Date().toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-(--paper-text)"></span>
                  <span>今日情报 / Today's Intelligence</span>
                </div>
              </div>

              <div className="flex flex-1 items-center justify-center md:flex">
                <NavItem to="/events" label="展会名录" className="text-xs tracking-[0.13em]" />
                <div className="mx-2 h-4 w-px bg-(--paper-border)/20" aria-hidden="true"></div>
                <NavItem to="/lives" label="演出快讯" className="text-xs tracking-[0.13em]" />
                <div className="mx-2 h-4 w-px bg-(--paper-border)/20" aria-hidden="true"></div>
                <NavItem to="/circles" label="社团检索" className="text-xs tracking-[0.13em]" />
              </div>

              <div className="flex items-center justify-end gap-4 text-xs font-bold uppercase tracking-[0.12em] text-(--paper-text-muted) md:w-56 lg:w-72">
                <div className="relative" ref={regionMenuRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLangMenuOpen(false);
                      setIsRegionMenuOpen((prev) => !prev);
                    }}
                    aria-label="切换地区"
                    aria-haspopup="menu"
                    aria-expanded={isRegionMenuOpen}
                    className={`flex items-center gap-1 whitespace-nowrap transition-colors duration-200 hover:text-(--paper-accent) ${FOCUS_RING}`}
                  >
                    <Globe aria-hidden="true" size={12} />
                    <span className="hidden lg:inline">{getRegionLabel()}</span>
                    <span className="lg:hidden">区域</span>
                    <ChevronDown
                      aria-hidden="true"
                      size={11}
                      className={`transition-transform duration-150 ${isRegionMenuOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isRegionMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        role="menu"
                        className="absolute right-0 top-full z-50 mt-2 w-44 border-2 border-(--paper-border) bg-(--paper-surface) text-(--paper-text) shadow-[4px_4px_0px_0px_var(--paper-border)]"
                      >
                        {REGION_OPTIONS.map((option) => (
                          <button
                            key={option.code}
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              onSetRegion(option.code);
                              setIsRegionMenuOpen(false);
                            }}
                            className={`flex w-full items-center justify-between border-b border-(--paper-border) px-4 py-2 text-left text-xs font-black transition-colors duration-200 last:border-0 hover:bg-(--paper-accent) hover:text-white ${
                              region === option.code ? 'bg-black/5' : ''
                            } ${FOCUS_RING}`}
                          >
                            <span>{option.label}</span>
                            {region === option.code ? <Check aria-hidden="true" size={11} /> : null}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative" ref={langMenuRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegionMenuOpen(false);
                      setIsLangMenuOpen((prev) => !prev);
                    }}
                    aria-label="切换语言"
                    aria-haspopup="menu"
                    aria-expanded={isLangMenuOpen}
                    className={`flex items-center gap-1 whitespace-nowrap transition-colors duration-200 hover:text-(--paper-accent) ${FOCUS_RING}`}
                  >
                    <LanguageBadgeIcon size={12} />
                    <span className="hidden lg:inline">Language: {language.toUpperCase()}</span>
                    <span className="lg:hidden">{language.toUpperCase()}</span>
                  </button>

                  <AnimatePresence>
                    {isLangMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        role="menu"
                        className="absolute right-0 top-full z-50 mt-2 w-32 border-2 border-(--paper-border) bg-(--paper-surface) text-(--paper-text) shadow-[4px_4px_0px_0px_var(--paper-border)]"
                      >
                        {[
                          { code: 'zh', label: '简体中文' },
                          { code: 'ja', label: '日本語' },
                          { code: 'en', label: 'English' },
                        ].map((langOption) => (
                          <button
                            key={langOption.code}
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              onSetLanguage(langOption.code as Language);
                              setIsLangMenuOpen(false);
                            }}
                            className={`w-full border-b border-(--paper-border) px-4 py-2 text-left text-xs font-black transition-colors duration-200 last:border-0 hover:bg-(--paper-accent) hover:text-white ${
                              language === langOption.code ? 'bg-black/5' : ''
                            } ${FOCUS_RING}`}
                          >
                            {langOption.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-(--paper-border)/10 md:hidden">
            <div className="flex items-center justify-center gap-1 px-4 py-2">
              <NavItem to="/events" label="展会" className="px-3 py-3 text-xs" />
              <NavItem to="/lives" label="演出" className="px-3 py-3 text-xs" />
              <NavItem to="/circles" label="社团" className="px-3 py-3 text-xs" />
            </div>
          </div>
        </header>

        <nav
          data-aya-dock="true"
          data-aya-state={headerState}
          aria-hidden={!isDockVisible}
          className="fixed left-0 right-0 top-0 z-50 w-full border-b border-(--paper-border) bg-(--aya-color-bg) shadow-(--aya-shadow-1) will-change-transform"
          style={{
            transform:
              headerState === 'scrolled'
                ? 'translate3d(0, 0, 0)'
                : 'translate3d(0, calc(var(--aya-header-height-compact, 46px) * -1 - 12px), 0)',
            visibility: headerState === 'top' ? 'hidden' : 'visible',
            pointerEvents: isDockVisible ? 'auto' : 'none',
            transition: 'transform var(--aya-motion-medium, 200ms) cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div className="border-t border-(--paper-border)/5 py-1">
            <div className="mx-auto flex max-w-350 items-center gap-3 px-6">
              <BrandLink compact showText={false} className="md:hidden" />

              <div className="hidden items-center md:flex md:w-56">
                <BrandLink
                  compact
                  textClassName="hidden xl:inline text-sm opacity-85 text-(--paper-text)"
                  className={`gap-2 transition-[opacity,transform] duration-150 ease-out ${
                    isDockVisible ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 pointer-events-none'
                  }`}
                />
              </div>

              <div className="hidden md:flex md:flex-1 md:items-center md:justify-center">
                <NavItem to="/events" label="展会名录" />
                <div className="mx-2 h-4 w-px bg-(--paper-border)/20" aria-hidden="true"></div>
                <NavItem to="/lives" label="演出快讯" />
                <div className="mx-2 h-4 w-px bg-(--paper-border)/20" aria-hidden="true"></div>
                <NavItem to="/circles" label="社团检索" />
              </div>

              <div className="ml-auto flex items-center gap-3 md:ml-0 md:w-56 md:justify-end">
                <button
                  type="button"
                  className={`p-2.5 md:hidden text-(--paper-text) ${FOCUS_RING}`}
                  aria-label={isMobileMenuOpen ? '关闭菜单' : '打开菜单'}
                  onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden border-t-4 border-(--paper-border) bg-(--paper-bg) md:hidden"
              >
                <div className="flex flex-col space-y-6 px-6 py-8">
                  <NavItem to="/events" label="展会名录" className="w-full border-b-2 border-black/5 py-2 text-2xl" />
                  <NavItem to="/lives" label="演出快讯" className="w-full border-b-2 border-black/5 py-2 text-2xl" />
                  <NavItem to="/circles" label="社团检索" className="w-full py-2 text-2xl" />

                  <div className="flex flex-col gap-4 pt-8">
                    <div className="text-xs font-black uppercase tracking-widest opacity-40 text-(--paper-text)">Language</div>
                    <div className="flex gap-2">
                      {['zh', 'ja', 'en'].map((langCode) => (
                        <button
                          key={langCode}
                          type="button"
                          onClick={() => {
                            onSetLanguage(langCode as Language);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`border-2 border-(--paper-border) px-4 py-2 text-xs font-black uppercase transition-colors duration-200 ${
                            language === langCode ? 'bg-(--paper-border) text-(--paper-surface)' : 'bg-(--paper-surface) text-(--paper-text) hover:bg-(--paper-border) hover:text-(--paper-surface)'
                          } ${FOCUS_RING}`}
                        >
                          {langCode}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </>
    );
  }

  return (
    <nav data-current-view={currentView} className={`sticky top-0 z-50 w-full border-b-2 transition-colors duration-300 ${navBg}`}>
      <div className="mx-auto flex h-16 max-w-300 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link to="/" onClick={handleBrandClick} className={`flex items-center gap-3 ${FOCUS_RING}`} aria-label="返回首页">
            <motion.div whileHover={{ scale: 1.06 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
              <BrandLogo size="sm" />
            </motion.div>
            <div className="flex flex-col leading-none">
              <span className="font-brand text-lg font-black tracking-tight text-(--paper-text)">{getBrandName()}</span>
              <span className="origin-left text-xs font-bold uppercase tracking-widest text-(--paper-text-muted)">EST. 1000 G.S.T</span>
            </div>
          </Link>

          <div className="hidden items-center space-x-1 md:flex">
            <NavItem to="/events" label="展会" />
            <NavItem to="/lives" label="演出" />
            <NavItem to="/circles" label="社团" />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative" ref={langMenuRef}>
            <button
              type="button"
              onClick={() => setIsLangMenuOpen((prev) => !prev)}
              aria-label="语言切换"
              aria-haspopup="menu"
              aria-expanded={isLangMenuOpen}
              aria-controls="language-menu"
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-[background-color,border-color,color] duration-200 ${
                isNewspaper ? 'border-(--paper-border) bg-(--paper-surface) text-(--paper-text)' : 'border-slate-200 bg-white text-slate-600'
              } ${FOCUS_RING}`}
            >
              <LanguageBadgeIcon size={14} />
              <span className="hidden uppercase sm:inline">{language}</span>
            </button>

            <AnimatePresence>
              {isLangMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  id="language-menu"
                  role="menu"
                  className="absolute right-0 top-full z-50 mt-2 w-32 border-2 border-(--paper-border) bg-(--paper-surface) shadow-[4px_4px_0px_0px_var(--paper-border)]"
                >
                  {[
                    { code: 'zh', label: '简体中文' },
                    { code: 'ja', label: '日本語' },
                    { code: 'en', label: 'English' },
                  ].map((langOption) => (
                    <button
                      key={langOption.code}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        onSetLanguage(langOption.code as Language);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full border-b border-(--paper-border) px-4 py-2 text-left text-xs font-black transition-colors duration-200 last:border-0 hover:bg-(--paper-accent) hover:text-white ${
                        language === langOption.code ? 'bg-black/5' : ''
                      } ${FOCUS_RING}`}
                    >
                      {langOption.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={isMobileMenuOpen ? '关闭菜单' : '打开菜单'}
            className={`p-2.5 transition-colors duration-200 md:hidden text-(--paper-text) ${FOCUS_RING}`}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`border-t-2 md:hidden ${isNewspaper ? 'border-(--paper-border) bg-(--paper-bg)' : 'border-slate-100 bg-white'}`}
          >
            <div className="flex flex-col space-y-4 px-4 py-6">
              <NavItem to="/events" label="展会名录" className={`w-full border-b py-4 text-left ${isNewspaper ? 'border-(--paper-border)/10' : 'border-slate-100'}`} />
              <NavItem to="/events/exp" label="探索布局 (Beta)" className={`w-full border-b py-4 text-left ${isNewspaper ? 'border-(--paper-border)/10' : 'border-slate-100'}`} />
              <NavItem to="/lives" label="演出快讯" className={`w-full border-b py-4 text-left ${isNewspaper ? 'border-(--paper-border)/10' : 'border-slate-100'}`} />
              <NavItem to="/circles" label="社团检索" className={`w-full border-b py-4 text-left ${isNewspaper ? 'border-(--paper-border)/10' : 'border-slate-100'}`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
