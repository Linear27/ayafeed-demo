
import { createRootRoute, Outlet } from '@tanstack/react-router';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AIChat from '@/components/AIChat';
import { AppProvider, useAppContext } from '@/context/AppContext';
import { ViewState } from '@/types';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: ({ error, reset }) => {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center p-4 text-center bg-[#FDFBF7]">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 text-red-600">
          <AlertTriangle size={40} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-4 font-header uppercase tracking-tighter">
          镜头起雾了！(发生错误)
        </h1>
        <p className="text-slate-600 mb-8 max-w-md font-serif italic">
          报社的远程传输设备似乎遇到了一些干扰。别担心，我们的鸦天狗记者正在紧急抢修中。
        </p>
        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg mb-8 text-left max-w-lg overflow-auto">
          <code className="text-xs text-red-800 font-mono">
            {error instanceof Error ? error.message : '未知错误'}
          </code>
        </div>
        <button 
          onClick={() => reset()}
          className="flex items-center gap-2 px-8 py-3 bg-black text-white font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          <RefreshCcw size={18} />
          重新加载频道
        </button>
      </div>
    );
  }
});

function RootComponent() {
  const { theme, language, setLanguage, region, setRegion } = useAppContext();

  const getViewState = (pathname: string): ViewState => {
    if (pathname === '/') return 'LANDING';
    if (pathname.startsWith('/events/exp')) return 'EVENT_LIST_EXP';
    if (pathname.startsWith('/events/')) return 'EVENT_DETAIL';
    if (pathname.startsWith('/events')) return 'EVENT_LIST';
    if (pathname.startsWith('/lives/')) return 'LIVE_DETAIL';
    if (pathname.startsWith('/lives')) return 'LIVE_LIST';
    if (pathname.startsWith('/circles/')) return 'CIRCLE_DETAIL';
    if (pathname.startsWith('/circles')) return 'CIRCLE_LIST';
    if (pathname.startsWith('/showcase')) return 'COMPONENT_SHOWCASE';
    return 'LANDING';
  };

  const pathname = window.location.pathname;
  const currentView = getViewState(pathname);

  return (
    <div className="min-h-screen font-sans flex flex-col">
      <Navbar 
        currentView={currentView} 
        theme={theme} 
        language={language}
        onSetLanguage={setLanguage}
        region={region}
        onSetRegion={setRegion}
      />
      
      <main className="relative flex-1">
        <Outlet />
      </main>

      <Footer theme={theme} />
      <AIChat />
    </div>
  );
}
