import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessageToGemini } from '../services/gemini';
import { ChatMessage } from '../types';
import { resolveLauncherAvoidance } from '../services/launcherAvoidance';

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white';

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLauncher, setShowLauncher] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '你好，我是 Niji-chan。你可以问我展会、演出或社团信息，我会给出检索与推荐。' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const launcherButtonRef = useRef<HTMLButtonElement>(null);
  const lastScrollYRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const [launcherOffset, setLauncherOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const pathname = window.location.pathname;
  const isLandingRoute = pathname === '/';
  const isLiveDetailRoute = /^\/lives\/[^/]+$/.test(pathname);
  const isEventOrCircleDetailRoute = /^\/(events|circles)\/[^/]+$/.test(pathname);
  const mobileBottomClass = isLiveDetailRoute
    ? 'bottom-[calc(env(safe-area-inset-bottom,0px)+152px)]'
    : isEventOrCircleDetailRoute
      ? 'bottom-[calc(env(safe-area-inset-bottom,0px)+96px)]'
      : 'bottom-[calc(env(safe-area-inset-bottom,0px)+72px)]';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (!isLandingRoute || isOpen) {
      setShowLauncher(true);
      return;
    }

    const DIRECTION_DELTA = 8;
    const SHOW_WHEN_SCROLL_TOP_LE = 120;

    const updateLauncherVisibility = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollYRef.current;

      if (currentScrollY <= SHOW_WHEN_SCROLL_TOP_LE || delta <= -DIRECTION_DELTA) {
        setShowLauncher(true);
      } else if (delta >= DIRECTION_DELTA) {
        setShowLauncher(false);
      }

      lastScrollYRef.current = currentScrollY;
    };

    const onScroll = () => {
      if (rafIdRef.current !== null) return;
      rafIdRef.current = window.requestAnimationFrame(() => {
        rafIdRef.current = null;
        updateLauncherVisibility();
      });
    };

    lastScrollYRef.current = window.scrollY;
    updateLauncherVisibility();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [isLandingRoute, isOpen]);

  useEffect(() => {
    if (!isLandingRoute || isOpen) {
      setLauncherOffset((prev) => (prev.x === 0 && prev.y === 0 ? prev : { x: 0, y: 0 }));
      return;
    }

    const targetId = 'landing-primary-cta';
    let rafId: number | null = null;

    const updateOffset = () => {
      const launcherButton = launcherButtonRef.current;
      const target = document.getElementById(targetId);
      if (!launcherButton || !target) {
        setLauncherOffset((prev) => (prev.x === 0 && prev.y === 0 ? prev : { x: 0, y: 0 }));
        return;
      }

      const next = resolveLauncherAvoidance({
        launcherRect: launcherButton.getBoundingClientRect(),
        targetRect: target.getBoundingClientRect(),
        viewport: { width: window.innerWidth, height: window.innerHeight },
      });
      setLauncherOffset((prev) =>
        prev.x === next.offsetX && prev.y === next.offsetY
          ? prev
          : { x: next.offsetX, y: next.offsetY },
      );
    };

    const requestUpdate = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        updateOffset();
      });
    };

    updateOffset();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    const mountNode = document.getElementById('main-content') ?? document.body;
    const observer = new MutationObserver(requestUpdate);
    observer.observe(mountNode, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      observer.disconnect();
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [isLandingRoute, isOpen]);

  const isLauncherVisible = showLauncher || isOpen;
  const launcherSizeClass = isLandingRoute ? 'h-11 w-11 sm:h-12 sm:w-12' : 'h-12 w-12';
  const hiddenTranslateY = isLauncherVisible ? 0 : 14;
  const translateX = launcherOffset.x;
  const translateY = hiddenTranslateY - launcherOffset.y;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    setIsLoading(true);

    const history = messages.map((message) => ({ role: message.role, text: message.text }));
    const newMessages = [...messages, { role: 'user', text: userText } as ChatMessage];
    setMessages(newMessages);

    try {
      const responseText = await sendMessageToGemini(
        history,
        userText,
      );
      setMessages((prev) => [...prev, { role: 'model', text: responseText }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'model', text: '抱歉，连接服务器时遇到点麻烦。' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={`pointer-events-none fixed right-[calc(env(safe-area-inset-right,0px)+16px)] ${mobileBottomClass} z-50 flex flex-col items-end sm:bottom-6 sm:right-6`}
      style={{
        transform: `translate3d(${translateX}px, ${translateY}px, 0)`,
        opacity: isLauncherVisible ? 1 : 0.18,
        transition:
          'transform var(--aya-motion-fast, 180ms) cubic-bezier(0.16, 1, 0.3, 1), opacity var(--aya-motion-fast, 180ms) ease-out',
      }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            role="dialog"
            aria-modal="false"
            aria-label="Niji-chan AI 对话窗口"
            className="pointer-events-auto mb-4 flex h-[500px] max-h-[calc(100dvh-8rem)] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-red-100 bg-white shadow-2xl sm:w-96"
          >
            <div className="flex items-center justify-between bg-gradient-to-r from-red-600 to-slate-900 p-4 text-white">
              <div className="flex items-center space-x-2">
                <div className="rounded-full bg-white/20 p-1.5">
                  <Bot aria-hidden="true" size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Niji-chan AI</h3>
                  <p className="flex items-center text-xs text-red-100">
                    <span className="mr-1 h-2 w-2 rounded-full bg-green-400" aria-hidden="true"></span>
                    在线
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="关闭对话"
                className={`text-white/80 transition-colors duration-200 hover:text-white ${FOCUS_RING}`}
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4" aria-live="polite">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      message.role === 'user'
                        ? 'rounded-br-none bg-red-600 text-white'
                        : 'rounded-bl-none border border-slate-100 bg-white text-slate-700'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{message.text}</p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="w-[70%] space-y-2 rounded-2xl rounded-bl-none border border-slate-100 bg-white px-4 py-3 shadow-sm">
                    <div className="h-2 w-full animate-pulse rounded bg-slate-200"></div>
                    <div className="h-2 w-3/4 animate-pulse rounded bg-slate-200"></div>
                    <div className="h-2 w-1/2 animate-pulse rounded bg-slate-200"></div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-slate-100 bg-white p-4">
              <label htmlFor="chat-input" className="sr-only">
                输入问题
              </label>
              <div className="relative flex items-center">
                <input
                  id="chat-input"
                  name="chat-input"
                  type="text"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyPress}
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="询问关于展会的信息…"
                  className={`w-full rounded-full bg-slate-100 py-3 pl-4 pr-12 text-sm text-slate-800 transition-colors duration-200 ${FOCUS_RING}`}
                />
                <motion.button
                  type="button"
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  whileTap={{ scale: 0.92 }}
                  aria-label="发送消息"
                  className={`absolute right-2 rounded-full bg-red-600 p-2 text-white transition-colors duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 ${FOCUS_RING}`}
                >
                  <Send aria-hidden="true" size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        ref={launcherButtonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? '关闭 AI 助手' : '打开 AI 助手'}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${isLauncherVisible ? 'pointer-events-auto' : 'pointer-events-none'} z-50 flex ${launcherSizeClass} items-center justify-center rounded-full border border-black/10 bg-red-600 text-white shadow-lg transition-colors duration-200 hover:bg-red-700 touch-manipulation ${FOCUS_RING}`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </div>
  );
};

export default AIChat;
