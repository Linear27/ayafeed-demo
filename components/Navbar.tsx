import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Globe, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation } from '@tanstack/react-router';
import { Language, PreferredRegion, Theme, ViewState } from '../types';
import { getHeaderMotionState, type HeaderMotionState } from '../services/headerMotion';
import BrandLockup from './BrandLockup';

interface NavbarProps {
  currentView: ViewState;
  theme: Theme;
  language: Language;
  onSetLanguage: (lang: Language) => void;
  region: PreferredRegion;
  onSetRegion: (region: PreferredRegion) => void;
}

const REGION_OPTIONS: Array<{ code: PreferredRegion; label: string }> = [
  { code: 'GLOBAL', label: '全站版' },
  { code: 'JAPAN', label: '日本国内版' },
  { code: 'CN_MAINLAND', label: '中国大陆版' },
  { code: 'OVERSEAS', label: '海外版' },
];

const LANGUAGE_OPTIONS: Array<{ code: Language; label: string }> = [
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
  { code: 'en', label: 'English' },
];

const NAV_ITEMS = [
  { kind: 'route', label: '展会', to: '/events', match: '/events' },
  { kind: 'route', label: '演出', to: '/lives', match: '/lives' },
  { kind: 'route', label: '社团', to: '/circles', match: '/circles' },
] as const;

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7]';

const HEADER_COMPRESS_START = 48;
const HEADER_DOCK_START = 168;
const MASTHEAD_FALLBACK_BOTTOM = 320;
const HEADER_PROGRESS_EPSILON = 0.008;

const Navbar: React.FC<NavbarProps> = ({
  currentView,
  theme,
  language,
  onSetLanguage,
  region,
  onSetRegion,
}) => {
  const location = useLocation();
  const pathname = location.pathname;
  const isNewspaper = theme === 'newspaper';
  const isLanding = currentView === 'LANDING' || pathname === '/';

  const [headerMotion, setHeaderMotion] = useState<HeaderMotionState>(() =>
    isLanding ? { phase: 'masthead', progress: 0 } : { phase: 'docked', progress: 1 },
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isRegionMenuOpen, setIsRegionMenuOpen] = useState(false);

  const mastheadRef = useRef<HTMLElement | null>(null);
  const rafIdRef = useRef<number | null>(null);

  const isDockVisible = !isLanding || headerMotion.phase !== 'masthead';

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsLanguageMenuOpen(false);
    setIsRegionMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const resetState = isLanding
      ? { phase: 'masthead', progress: 0 }
      : { phase: 'docked', progress: 1 };

    if (!isNewspaper) {
      setHeaderMotion(resetState);
      return;
    }

    if (!isLanding) {
      setHeaderMotion({ phase: 'docked', progress: 1 });
      return;
    }

    const updateHeaderMotion = () => {
      const nextState = getHeaderMotionState({
        isLanding,
        scrollY: window.scrollY,
        mastheadBottom: mastheadRef.current?.getBoundingClientRect().bottom ?? MASTHEAD_FALLBACK_BOTTOM,
        compressStart: HEADER_COMPRESS_START,
        dockStart: HEADER_DOCK_START,
      });

      setHeaderMotion((currentState) => {
        if (
          currentState.phase === nextState.phase &&
          Math.abs(currentState.progress - nextState.progress) < HEADER_PROGRESS_EPSILON
        ) {
          return currentState;
        }

        return nextState;
      });
    };

    const requestUpdate = () => {
      if (rafIdRef.current !== null) {
        return;
      }

      rafIdRef.current = window.requestAnimationFrame(() => {
        rafIdRef.current = null;
        updateHeaderMotion();
      });
    };

    updateHeaderMotion();
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
  }, [isLanding, isNewspaper]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsLanguageMenuOpen(false);
    setIsRegionMenuOpen(false);
  }, [isDockVisible]);

  const currentRegionLabel = useMemo(
    () => REGION_OPTIONS.find((item) => item.code === region)?.label ?? '全站版',
    [region],
  );

  const currentLanguageLabel = useMemo(
    () => LANGUAGE_OPTIONS.find((item) => item.code === language)?.label ?? '中文',
    [language],
  );

  const controlClassName =
    'inline-flex min-h-11 items-center gap-2 border border-[var(--paper-border)]/15 bg-[var(--paper-surface)] px-3 text-sm font-bold text-[var(--paper-text)] transition-[background-color,border-color,color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[var(--paper-hover)]';

  const dropdownMotionTransition = {
    duration: 0.24,
    ease: [0.16, 1, 0.3, 1] as const,
  };

  const dropdownPanelClassName =
    'absolute right-0 top-[calc(100%+10px)] z-50 overflow-hidden rounded-[2px] border border-[var(--paper-border)]/12 bg-[linear-gradient(180deg,var(--paper-surface)_0%,var(--paper-bg)_100%)] shadow-[0_16px_32px_-24px_rgba(26,26,26,0.38)]';

  const renderNavLinks = (compact = false) =>
    NAV_ITEMS.map((item) => {
      const isActive = pathname === item.to || pathname.startsWith(`${item.match}/`);
      const linkClassName = `inline-flex min-h-11 items-center ${compact ? 'px-2.5 text-sm' : 'px-3 text-[15px]'} font-bold tracking-[0.01em] transition-colors ${
        isActive
          ? 'text-[var(--paper-accent)]'
          : 'text-[var(--paper-text)] hover:text-[var(--paper-accent)]'
      } ${FOCUS_RING}`;

      return (
        <Link key={item.label} to={item.to} className={linkClassName}>
          {item.label}
        </Link>
      );
    });

  const renderRegionOptions = () =>
    REGION_OPTIONS.map((item) => (
      <button
        key={item.code}
        type="button"
        onClick={() => {
          onSetRegion(item.code);
          setIsRegionMenuOpen(false);
        }}
        className={`flex min-h-11 w-full items-center justify-between px-3.5 text-left text-sm font-bold tracking-[0.01em] text-[var(--paper-text)] transition-[background-color,color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[var(--paper-surface)] hover:translate-x-[1px] ${FOCUS_RING}`}
      >
        <span>{item.label}</span>
        {item.code === region ? <Check size={16} aria-hidden="true" /> : null}
      </button>
    ));

  const renderLanguageOptions = () =>
    LANGUAGE_OPTIONS.map((item) => (
      <button
        key={item.code}
        type="button"
        onClick={() => {
          onSetLanguage(item.code);
          setIsLanguageMenuOpen(false);
        }}
        className={`flex min-h-11 w-full items-center justify-between px-3.5 text-left text-sm font-bold tracking-[0.01em] text-[var(--paper-text)] transition-[background-color,color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[var(--paper-surface)] hover:translate-x-[1px] ${FOCUS_RING}`}
      >
        <span>{item.label}</span>
        {item.code === language ? <Check size={16} aria-hidden="true" /> : null}
      </button>
    ));

  const renderDesktopFeedbackCta = ({ compact = false, fullWidth = false } = {}) => (
    <Link
      to="/feedback"
      className={`inline-flex ${compact ? 'min-h-10 px-3 text-xs' : 'min-h-11 px-4 text-sm'} ${fullWidth ? 'w-full' : ''} items-center justify-center border-2 border-[var(--paper-border)] bg-[var(--paper-border)] font-black text-[var(--paper-surface)] transition-colors hover:bg-[var(--paper-accent)] ${FOCUS_RING}`}
    >
      提交活动情报
    </Link>
  );

  const renderDesktopRegionControl = ({
    compact = false,
    showSwitchLabel = false,
    menuVisible,
  }: {
    compact?: boolean;
    showSwitchLabel?: boolean;
    menuVisible: boolean;
  }) => (
    <div className="relative">
      <button
        type="button"
        aria-label="地区切换"
        aria-expanded={menuVisible}
        aria-haspopup="menu"
        onClick={() => {
          setIsRegionMenuOpen((open) => !open);
          setIsLanguageMenuOpen(false);
        }}
        className={`${controlClassName} ${compact ? 'min-h-10 px-3 text-xs tracking-[0.05em]' : 'tracking-[0.03em]'} ${menuVisible ? 'border-[var(--paper-border)]/25 bg-[var(--paper-bg)]' : ''} ${FOCUS_RING}`}
      >
        {showSwitchLabel ? <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--paper-text-muted)]">地区切换</span> : null}
        <span>{currentRegionLabel}</span>
        <ChevronDown
          size={compact ? 14 : 15}
          aria-hidden="true"
          className={`transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuVisible ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {menuVisible ? (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.992 }}
            transition={dropdownMotionTransition}
            className={`${dropdownPanelClassName} min-w-56 p-1.5`}
          >
            {renderRegionOptions()}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );

  const renderDesktopLanguageControl = ({
    compact = false,
    menuVisible,
  }: {
    compact?: boolean;
    menuVisible: boolean;
  }) => (
    <div className="relative">
      <button
        type="button"
        aria-label="语言切换"
        aria-expanded={menuVisible}
        aria-haspopup="menu"
        onClick={() => {
          setIsLanguageMenuOpen((open) => !open);
          setIsRegionMenuOpen(false);
        }}
        className={`${controlClassName} ${compact ? 'min-h-10 px-3 text-xs tracking-[0.05em]' : 'tracking-[0.03em]'} ${menuVisible ? 'border-[var(--paper-border)]/25 bg-[var(--paper-bg)]' : ''} ${FOCUS_RING}`}
      >
        <Globe size={compact ? 14 : 15} aria-hidden="true" />
        <span>{currentLanguageLabel}</span>
        <ChevronDown
          size={compact ? 14 : 15}
          aria-hidden="true"
          className={`transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuVisible ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {menuVisible ? (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.992 }}
            transition={dropdownMotionTransition}
            className={`${dropdownPanelClassName} min-w-44 p-1.5`}
          >
            {renderLanguageOptions()}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );

  const mastheadPaddingTop = 24 - headerMotion.progress * 10;
  const mastheadPaddingBottom = 24 - headerMotion.progress * 8;
  const mastheadBrandStyle = {
    transform: `translate3d(${(-220 * headerMotion.progress).toFixed(1)}px, ${(-18 * headerMotion.progress).toFixed(1)}px, 0) scale(${(1 - headerMotion.progress * 0.18).toFixed(3)})`,
    transformOrigin: 'center center' as const,
  };
  const mastheadMetaStyle = {
    opacity: Math.max(0, 1 - headerMotion.progress * 1.12),
    transform: `translate3d(${(-18 * headerMotion.progress).toFixed(1)}px, ${(-12 * headerMotion.progress).toFixed(1)}px, 0) scale(${(1 - headerMotion.progress * 0.04).toFixed(3)})`,
    transformOrigin: 'left center' as const,
  };
  const mastheadControlsStyle = {
    opacity: Math.max(0.88, 1 - headerMotion.progress * 0.08),
    transform: `translate3d(${(18 * headerMotion.progress).toFixed(1)}px, ${(-10 * headerMotion.progress).toFixed(1)}px, 0) scale(${(1 - headerMotion.progress * 0.05).toFixed(3)})`,
    transformOrigin: 'right center' as const,
  };
  const mastheadNavStyle = {
    opacity: Math.max(0.9, 1 - headerMotion.progress * 0.06),
    transform: `translate3d(0, ${(-18 * headerMotion.progress).toFixed(1)}px, 0) scale(${(1 - headerMotion.progress * 0.03).toFixed(3)})`,
    transformOrigin: 'center top' as const,
  };
  const dockShellStyle = isLanding
    ? {
        opacity: headerMotion.progress,
        transform: `translate3d(0, ${((1 - headerMotion.progress) * -10).toFixed(1)}px, 0) scale(${(0.985 + headerMotion.progress * 0.015).toFixed(3)})`,
        transformOrigin: 'center top' as const,
      }
    : undefined;

  return (
    <>
      {isLanding ? (
        <header
          ref={mastheadRef}
          data-aya-masthead="true"
          data-aya-state={headerMotion.phase}
          className="w-full border-b border-[var(--paper-border)]/12 bg-[var(--paper-surface)]"
        >
          <div className="hidden lg:block">
            <div
              className="mx-auto max-w-7xl px-6"
              style={{
                paddingTop: `${mastheadPaddingTop}px`,
                paddingBottom: `${mastheadPaddingBottom}px`,
              }}
            >
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6">
                <div
                  className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.18em] text-[var(--paper-text-muted)]"
                  style={mastheadMetaStyle}
                >
                  <span>第 13042 期</span>
                  <span className="opacity-35">/</span>
                  <span>Gensokyo Intelligence Network</span>
                </div>

                <Link to="/" className={`mx-auto inline-flex items-center ${FOCUS_RING}`}>
                  <div style={mastheadBrandStyle}>
                    <BrandLockup />
                  </div>
                </Link>

                <div className="flex items-center justify-end gap-3" style={mastheadControlsStyle}>
                  {renderDesktopRegionControl({
                    showSwitchLabel: true,
                    menuVisible: !isDockVisible && isRegionMenuOpen,
                  })}

                  {renderDesktopLanguageControl({
                    menuVisible: !isDockVisible && isLanguageMenuOpen,
                  })}

                  {renderDesktopFeedbackCta()}
                </div>
              </div>

              <div className="border-t border-[var(--paper-border)]/10" style={mastheadNavStyle}>
                <div className="mx-auto flex max-w-4xl items-center justify-center gap-2 px-4 py-2.5">
                  {renderNavLinks()}
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 lg:hidden">
            <Link to="/" className={`inline-flex items-center ${FOCUS_RING}`}>
              <BrandLockup compact />
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="地区切换"
                onClick={() => {
                  setIsRegionMenuOpen((open) => !open);
                  setIsLanguageMenuOpen(false);
                }}
                className={`${controlClassName} px-3 ${FOCUS_RING}`}
              >
                地区切换
              </button>
              <button
                type="button"
                aria-label={isMobileMenuOpen ? '关闭菜单' : '打开菜单'}
                onClick={() => setIsMobileMenuOpen((open) => !open)}
                className={`inline-flex min-h-11 items-center justify-center border border-[var(--paper-border)]/15 bg-[var(--paper-surface)] px-3 text-[var(--paper-text)] transition-colors hover:bg-[var(--paper-hover)] ${FOCUS_RING}`}
              >
                {isMobileMenuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
              </button>
            </div>
          </div>
        </header>
      ) : null}

      {isDockVisible ? (
        <div
          data-aya-dock="true"
          data-aya-state={headerMotion.phase}
          className="sticky top-0 z-40 border-b border-[var(--paper-border)]/12 bg-[var(--paper-surface)] shadow-[var(--paper-shadow-sm)]"
        >
          <div className="hidden lg:block">
            <div className="mx-auto max-w-7xl px-4 py-2.5" style={dockShellStyle}>
              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
                <Link to="/" className={`inline-flex items-center ${FOCUS_RING}`}>
                  <BrandLockup compact />
                </Link>

                <nav className="flex items-center justify-center gap-1">{renderNavLinks(true)}</nav>

                <div className="flex items-center gap-2">
                  {renderDesktopRegionControl({
                    compact: true,
                    menuVisible: isDockVisible && isRegionMenuOpen,
                  })}

                  {renderDesktopLanguageControl({
                    compact: true,
                    menuVisible: isDockVisible && isLanguageMenuOpen,
                  })}

                  {renderDesktopFeedbackCta({ compact: true })}
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 lg:hidden">
            <Link to="/" className={`inline-flex items-center ${FOCUS_RING}`}>
              <BrandLockup compact />
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="地区切换"
                onClick={() => {
                  setIsRegionMenuOpen((open) => !open);
                  setIsLanguageMenuOpen(false);
                }}
                className={`${controlClassName} px-3 ${FOCUS_RING}`}
              >
                地区切换
              </button>
              <button
                type="button"
                aria-label={isMobileMenuOpen ? '关闭菜单' : '打开菜单'}
                onClick={() => setIsMobileMenuOpen((open) => !open)}
                className={`inline-flex min-h-11 items-center justify-center border border-[var(--paper-border)]/15 bg-[var(--paper-surface)] px-3 text-[var(--paper-text)] transition-colors hover:bg-[var(--paper-hover)] ${FOCUS_RING}`}
              >
                {isMobileMenuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <AnimatePresence>
        {isRegionMenuOpen && !isMobileMenuOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-[var(--paper-border)]/12 bg-[var(--paper-bg)] lg:hidden"
          >
            <div className="mx-auto max-w-7xl px-4 py-3">
              <div className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--paper-text-muted)]">地区切换</div>
              <div className="grid gap-2 sm:grid-cols-2">{renderRegionOptions()}</div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isMobileMenuOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-[var(--paper-border)]/12 bg-[var(--paper-surface)] lg:hidden"
          >
            <div className="mx-auto max-w-7xl space-y-5 px-4 py-4">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--paper-text-muted)]">
                第 13042 期 / Gensokyo Intelligence Network
              </div>

              <nav className="grid gap-2">
                {NAV_ITEMS.map((item) => {
                  const linkClassName = `inline-flex min-h-11 items-center border border-[var(--paper-border)]/12 bg-[var(--paper-bg)] px-3 text-sm font-bold text-[var(--paper-text)] transition-colors hover:bg-[var(--paper-hover)] ${FOCUS_RING}`;

                  return (
                    <Link key={item.label} to={item.to} className={linkClassName}>
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div>
                <div className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--paper-text-muted)]">语言</div>
                <div className="grid gap-2">{renderLanguageOptions()}</div>
              </div>

              {renderDesktopFeedbackCta({ fullWidth: true })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
