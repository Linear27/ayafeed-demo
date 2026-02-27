import React, { useEffect, useRef, useState } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@tanstack/react-router';
import { Theme, Language } from '../types';
import BrandLogo from './BrandLogo';

interface NavbarProps {
  theme: Theme;
  language: Language;
  onSetLanguage: (lang: Language) => void;
}

const Navbar: React.FC<NavbarProps> = ({ theme, language, onSetLanguage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);

  const isNewspaper = theme === 'newspaper';

  const getBrandName = () => {
    if (language === 'zh') return '文文。快讯';
    if (language === 'ja') return '文々。速報';
    return 'AyaFeed';
  };

  const navBg = isNewspaper ? 'bg-[#FDFBF7] border-slate-900' : 'bg-white/90 backdrop-blur-md border-slate-200';
  const activeText = isNewspaper ? 'text-red-700' : 'text-indigo-600';
  const inactiveText = isNewspaper ? 'text-slate-800 hover:text-red-700' : 'text-slate-600 hover:text-indigo-600';
  const underlineColor = isNewspaper ? 'bg-red-600' : 'bg-indigo-600';

  useEffect(() => {
    if (!isLangMenuOpen) return;

    const handleDocumentMouseDown = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };

    const handleDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLangMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentMouseDown);
    document.addEventListener('keydown', handleDocumentKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleDocumentMouseDown);
      document.removeEventListener('keydown', handleDocumentKeyDown);
    };
  }, [isLangMenuOpen]);

  const NavItem = ({ to, label, className = '' }: { to: string; label: string; className?: string }) => (
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
            <span
              className={`absolute bottom-1 left-4 right-4 h-0.5 ${underlineColor} transform origin-left transition-transform duration-300 ${
                isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}
            ></span>
          )}
        </>
      )}
    </Link>
  );

  return (
    <nav className={`sticky top-0 z-50 w-full border-b-2 transition-colors duration-300 ${navBg}`}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-shrink-0 flex items-center gap-2 sm:gap-3 select-none"
            >
              <motion.div whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
                <BrandLogo size="sm" />
              </motion.div>

              <div className="flex flex-col leading-none">
                <span className={`font-black text-base sm:text-lg font-header tracking-tighter ${isNewspaper ? 'text-slate-900' : 'text-slate-800'}`}>
                  {getBrandName()}
                </span>
                <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest origin-left ${isNewspaper ? 'text-red-700' : 'text-slate-400'}`}>
                  EST. 1000 G.S.T
                </span>
              </div>
            </Link>

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
                className={`flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition-all border ${
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
                      { code: 'en', label: 'English' },
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
                aria-label={isMobileMenuOpen ? '关闭菜单' : '打开菜单'}
                className="p-2 transition-colors"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden border-t-2 ${isNewspaper ? 'bg-[#FDFBF7] border-slate-900' : 'bg-white border-slate-100'}`}
          >
            <div className="px-4 py-2 space-y-1 flex flex-col">
              <NavItem to="/events" label="展会名录" className="w-full text-left py-3 border-b border-slate-200/50" />
              <NavItem to="/events/exp" label="探索布局 (Beta)" className="w-full text-left py-3 border-b border-slate-200/50" />
              <NavItem to="/lives" label="演出快讯" className="w-full text-left py-3 border-b border-slate-200/50" />
              <NavItem to="/circles" label="社团检索" className="w-full text-left py-3" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
