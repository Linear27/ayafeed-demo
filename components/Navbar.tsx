
import React, { useEffect, useRef, useState } from 'react';
import { Menu, X, Globe, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from '@tanstack/react-router';
import { ViewState, Theme, Language } from '../types';
import BrandLogo from './BrandLogo';

interface NavbarProps {
  currentView: ViewState;
  theme: Theme;
  language: Language;
  onSetLanguage: (lang: Language) => void;
  region: string;
  onSetRegion: (region: string) => void;
}

const REGION_OPTIONS = [
  { code: 'JAPAN', label: '日本国内版' },
  { code: 'CN_MAINLAND', label: '中国大陆版' },
  { code: 'OVERSEAS', label: '海外分社版' }
];

const Navbar: React.FC<NavbarProps> = ({ currentView, theme, language, onSetLanguage, region, onSetRegion }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isRegionMenuOpen, setIsRegionMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const mastheadRef = useRef<HTMLElement | null>(null);
  const langMenuRef = useRef<HTMLDivElement | null>(null);
  const regionMenuRef = useRef<HTMLDivElement | null>(null);
  const isCollapsedRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);
  const navigate = useNavigate();
  
  const isNewspaper = theme === 'newspaper';

  useEffect(() => {
    if (!isNewspaper) {
      isCollapsedRef.current = false;
      setIsCollapsed(false);
      return;
    }

    // NYT-like dock behavior: a fixed top dock stays mounted and only
    // switches visibility based on masthead position with hysteresis.
    const SHOW_DOCK_WHEN_MASTHEAD_BOTTOM_LE = -24;
    const HIDE_DOCK_WHEN_MASTHEAD_BOTTOM_GE = 72;

    const updateDockVisibility = () => {
      const masthead = mastheadRef.current;
      if (!masthead) return;

      const mastheadBottom = masthead.getBoundingClientRect().bottom;
      let nextCollapsed = isCollapsedRef.current;

      if (!isCollapsedRef.current && mastheadBottom <= SHOW_DOCK_WHEN_MASTHEAD_BOTTOM_LE) {
        nextCollapsed = true;
      } else if (isCollapsedRef.current && mastheadBottom >= HIDE_DOCK_WHEN_MASTHEAD_BOTTOM_GE) {
        nextCollapsed = false;
      }

      if (nextCollapsed !== isCollapsedRef.current) {
        isCollapsedRef.current = nextCollapsed;
        setIsCollapsed(nextCollapsed);
      }

    };

    const requestUpdate = () => {
      if (rafIdRef.current !== null) return;
      rafIdRef.current = window.requestAnimationFrame(() => {
        rafIdRef.current = null;
        updateDockVisibility();
      });
    };

    updateDockVisibility();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isNewspaper]);

  const getBrandName = () => {
    if (language === 'zh') return '文文。快讯';
    if (language === 'ja') return '文々。速報';
    return 'AyaFeed';
  };

  const getRegionLabel = () => {
    if (region === 'JAPAN') return '日本国内版';
    if (region === 'CN_MAINLAND') return '中国大陆版';
    if (region === 'OVERSEAS') return '海外分社版';
    return '幻想乡全域版';
  };

  const navBg = isNewspaper ? 'bg-[#FDFBF7] border-slate-900' : 'bg-white/90 backdrop-blur-md border-slate-200';
  const activeText = isNewspaper ? 'text-red-700' : 'text-indigo-600';
  const inactiveText = isNewspaper ? 'text-slate-800 hover:text-red-700' : 'text-slate-600 hover:text-indigo-600';
  const underlineColor = isNewspaper ? 'bg-red-600' : 'bg-indigo-600';

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

  const NavItem = ({ to, label, className = "" }: { to: string, label: string, className?: string }) => (
    <Link
      to={to}
      onClick={() => setIsMobileMenuOpen(false)}
      className={`relative px-4 py-2 text-sm font-bold transition-colors font-header tracking-wide group ${className}`}
      activeProps={{ className: activeText }}
      inactiveProps={{ className: inactiveText }}
    >
      {({ isActive }) => (
        <>
          {label}
          {!className.includes('w-full') && (
            <span className={`absolute bottom-1 left-4 right-4 h-0.5 ${underlineColor} transform origin-left transition-transform duration-300 ${
               isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
            }`}></span>
          )}
        </>
      )}
    </Link>
  );

  if (isNewspaper) {
    return (
      <>
        <header ref={mastheadRef} data-aya-masthead="true" className={`w-full border-black border-b ${navBg}`}>
          <div className="max-w-[1400px] mx-auto px-6 py-4 md:py-6 flex justify-between items-center">
            <div className="hidden md:block md:flex-1" />

            <div
              className="flex flex-col items-center gap-2 cursor-pointer select-none"
              onClick={() => navigate({ to: '/' })}
            >
              <div className="flex items-center gap-4">
                <BrandLogo size="lg" className="hidden md:block" />
                <h1 className="text-3xl md:text-6xl font-black font-header uppercase tracking-tight leading-none">
                  {getBrandName()}
                </h1>
              </div>
              <div className="text-[9px] font-black uppercase tracking-[0.32em] opacity-45 md:mt-1.5">
                Gensokyo Intelligence Network / Est. 1000
              </div>
            </div>

            <div className="hidden md:block md:flex-1" />
          </div>

          <div className="hidden md:block border-t border-black/10">
            <div className="max-w-[1400px] mx-auto px-6 py-2 flex items-center gap-3">
              <div className="md:w-56 lg:w-72 flex items-center">
                <div className="hidden xl:flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600 whitespace-nowrap">
                  <span>{new Date().toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <span className="w-1 h-1 bg-black rounded-full"></span>
                  <span>Today's Intelligence</span>
                </div>
              </div>

              <div className="md:flex md:flex-1 md:items-center md:justify-center">
                <NavItem to="/events" label="展会名录" className="text-xs tracking-[0.16em]" />
                <div className="w-px h-4 bg-black/20 mx-2"></div>
                <NavItem to="/lives" label="演出快讯" className="text-xs tracking-[0.16em]" />
                <div className="w-px h-4 bg-black/20 mx-2"></div>
                <NavItem to="/circles" label="社团检索" className="text-xs tracking-[0.16em]" />
              </div>

              <div className="md:w-56 lg:w-72 flex items-center justify-end gap-4 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600">
                <div className="relative" ref={regionMenuRef}>
                  <button
                    onClick={() => {
                      setIsLangMenuOpen(false);
                      setIsRegionMenuOpen(!isRegionMenuOpen);
                    }}
                    className="hover:text-red-600 transition-colors flex items-center gap-1 whitespace-nowrap"
                  >
                    <Globe size={12} />
                    <span className="hidden lg:inline">{getRegionLabel()}</span>
                    <span className="lg:hidden">区域</span>
                    <ChevronDown size={11} className={`transition-transform duration-150 ${isRegionMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isRegionMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute right-0 top-full mt-2 w-40 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 text-black"
                      >
                        {REGION_OPTIONS.map((opt) => (
                          <button
                            key={opt.code}
                            onClick={() => {
                              onSetRegion(opt.code);
                              setIsRegionMenuOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-[10px] font-black hover:bg-red-600 hover:text-white transition-colors border-b border-black last:border-0 flex items-center justify-between ${
                              region === opt.code ? 'bg-slate-100' : ''
                            }`}
                          >
                            <span>{opt.label}</span>
                            {region === opt.code ? <Check size={11} /> : null}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative" ref={langMenuRef}>
                  <button
                    onClick={() => {
                      setIsRegionMenuOpen(false);
                      setIsLangMenuOpen(!isLangMenuOpen);
                    }}
                    className="hover:text-red-600 transition-colors whitespace-nowrap"
                  >
                    <span className="hidden lg:inline">Language: {language.toUpperCase()}</span>
                    <span className="lg:hidden">{language.toUpperCase()}</span>
                  </button>
                  <AnimatePresence>
                    {isLangMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute right-0 top-full mt-2 w-32 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 text-black"
                      >
                        {[
                          { code: 'zh', label: '简体中文' },
                          { code: 'ja', label: '日本語' },
                          { code: 'en', label: 'English' }
                        ].map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              onSetLanguage(lang.code as Language);
                              setIsLangMenuOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-[10px] font-black hover:bg-red-600 hover:text-white transition-colors border-b border-black last:border-0 ${language === lang.code ? 'bg-slate-100' : ''}`}
                          >
                            {lang.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          <div className="md:hidden border-t border-black/10">
            <div className="px-4 py-2 flex items-center justify-center gap-1">
              <NavItem to="/events" label="展会" className="px-2 text-xs" />
              <NavItem to="/lives" label="演出" className="px-2 text-xs" />
              <NavItem to="/circles" label="社团" className="px-2 text-xs" />
            </div>
          </div>
        </header>

        <nav
          data-aya-dock="true"
          aria-hidden={!isCollapsed}
          className="fixed left-0 right-0 top-0 z-50 w-full border-b border-black bg-[#FDFBF7] shadow-[0_0_5px_1px_rgba(0,0,0,0.28)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-transform"
          style={{
            transform: isCollapsed ? 'translate3d(0, 0, 0)' : 'translate3d(0, -70px, 0)',
            visibility: isCollapsed ? 'visible' : 'hidden',
            pointerEvents: isCollapsed ? 'auto' : 'none'
          }}
        >
          <div className="border-t border-black/5 py-1">
            <div className="max-w-[1400px] mx-auto px-6 flex items-center gap-3">
              <div
                className="md:hidden flex items-center gap-2 cursor-pointer select-none"
                onClick={() => navigate({ to: '/' })}
              >
                <BrandLogo size="xs" />
                <span className="font-black text-sm font-header uppercase tracking-tight">
                  {getBrandName()}
                </span>
              </div>

              <div className="hidden md:flex md:w-56 items-center">
                <div
                  className={`flex items-center gap-3 cursor-pointer transition-[opacity,transform] duration-150 ease-out ${
                    isCollapsed ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'
                  }`}
                  onClick={() => navigate({ to: '/' })}
                >
                  <BrandLogo size="xs" />
                  <span className="font-black text-sm md:text-base font-header uppercase tracking-tight">
                    {getBrandName()}
                  </span>
                </div>
              </div>

              <div className="hidden md:flex md:flex-1 md:items-center md:justify-center">
                <NavItem to="/events" label="展会名录" />
                <div className="w-px h-4 bg-black/20 mx-2"></div>
                <NavItem to="/lives" label="演出快讯" />
                <div className="w-px h-4 bg-black/20 mx-2"></div>
                <NavItem to="/circles" label="社团检索" />
              </div>

              <div className="ml-auto md:ml-0 flex items-center gap-3 md:w-56 md:justify-end">
                <button
                  className="md:hidden p-2"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
                className="md:hidden border-t-4 border-black bg-[#FDFBF7] overflow-hidden"
              >
                <div className="px-6 py-8 space-y-6 flex flex-col">
                  <NavItem to="/events" label="展会名录" className="w-full text-2xl py-2 border-b-2 border-black/5" />
                  <NavItem to="/lives" label="演出快讯" className="w-full text-2xl py-2 border-b-2 border-black/5" />
                  <NavItem to="/circles" label="社团检索" className="w-full text-2xl py-2" />

                  <div className="pt-8 flex flex-col gap-4">
                    <div className="text-xs font-black uppercase tracking-widest opacity-40">Language</div>
                    <div className="flex gap-2">
                      {['zh', 'ja', 'en'].map(l => (
                        <button
                          key={l}
                          onClick={() => { onSetLanguage(l as Language); setIsMobileMenuOpen(false); }}
                          className={`px-4 py-2 border-2 border-black font-black text-xs uppercase ${language === l ? 'bg-black text-white' : 'bg-white'}`}
                        >
                          {l}
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
    <nav className={`sticky top-0 z-50 w-full border-b-2 transition-colors duration-300 ${navBg}`}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0 flex items-center gap-3 select-none">
              {/* Logo with hover scale effect */}
              <motion.div 
                className="cursor-pointer"
                onClick={() => navigate({ to: '/' })}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <BrandLogo size="sm" />
              </motion.div>

              {/* Static Brand Text area */}
              <div 
                className="flex flex-col leading-none cursor-pointer"
                onClick={() => navigate({ to: '/' })}
              >
                <span className={`font-black text-lg font-header tracking-tighter ${isNewspaper ? 'text-slate-900' : 'text-slate-800'}`}>
                  {getBrandName()}
                </span>
                <span className={`text-xs font-bold uppercase tracking-widest origin-left ${isNewspaper ? 'text-red-700' : 'text-slate-400'}`}>
                   EST. 1000 G.S.T
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-1">
              <NavItem to="/events" label="展会" />
              <NavItem to="/lives" label="演出" />
              <NavItem to="/circles" label="社团" />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
             <div className="relative" ref={langMenuRef}>
                <button 
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  aria-label="语言切换"
                  aria-haspopup="menu"
                  aria-expanded={isLangMenuOpen}
                  aria-controls="language-menu"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    isNewspaper ? 'bg-white border-black text-slate-900' : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <Globe size={14} />
                  <span className="uppercase hidden sm:inline">{language}</span>
                </button>

                <AnimatePresence>
                  {isLangMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      id="language-menu"
                      role="menu"
                      className="absolute right-0 top-full mt-2 w-32 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50"
                    >
                      {[
                        { code: 'zh', label: '简体中文' },
                        { code: 'ja', label: '日本語' },
                        { code: 'en', label: 'English' }
                      ].map((lang) => (
                        <button
                          key={lang.code}
                          role="menuitem"
                          onClick={() => {
                            onSetLanguage(lang.code as Language);
                            setIsLangMenuOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-xs font-black hover:bg-red-600 hover:text-white transition-colors border-b border-black last:border-0 ${language === lang.code ? 'bg-slate-100' : ''}`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>

             <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                aria-label={isMobileMenuOpen ? "关闭菜单" : "打开菜单"}
                className="p-2 transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden border-t-2 ${isNewspaper ? 'bg-[#FDFBF7] border-slate-900' : 'bg-white border-slate-100'}`}
          >
            <div className="px-4 py-6 space-y-4 flex flex-col">
              <NavItem to="/events" label="展会名录" className="w-full text-left py-4 border-b border-slate-100" />
              <NavItem to="/events/exp" label="探索布局 (Beta)" className="w-full text-left py-4 border-b border-slate-100" />
              <NavItem to="/lives" label="演出快讯" className="w-full text-left py-4 border-b border-slate-100" />
              <NavItem to="/circles" label="社团检索" className="w-full text-left py-4 border-b border-slate-100" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
