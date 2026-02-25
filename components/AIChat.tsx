
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessageToGemini } from '../services/gemini';
import { ChatMessage } from '../types';

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "你好！我是 Niji-chan 🤖。正在寻找特定展会或需要推荐？尽管问我吧！" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    setIsLoading(true);

    const newMessages = [...messages, { role: 'user', text: userText } as ChatMessage];
    setMessages(newMessages);

    try {
      const responseText = await sendMessageToGemini(
        newMessages.map(m => ({ role: m.role, text: m.text })),
        userText
      );
      
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "抱歉，连接服务器时遇到点麻烦。" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Chat Window */}
      <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom right" }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="pointer-events-auto mb-4 w-[calc(100vw-2rem)] sm:w-96 h-[500px] max-h-[calc(100dvh-8rem)] bg-white rounded-2xl shadow-2xl border border-red-100 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-slate-900 p-4 flex justify-between items-center text-white">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-white/20 rounded-full">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Niji-chan AI</h3>
                <p className="text-xs text-red-100 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                  在线
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              aria-label="关闭对话"
              className="text-white/80 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-red-600 text-white rounded-br-none' 
                      : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm w-[70%] space-y-2">
                  <div className="h-2 w-full bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-2 w-3/4 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-2 w-1/2 bg-slate-200 rounded animate-pulse"></div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="relative flex items-center">
              <input
                id="chat-input"
                name="chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="询问关于展会的信息..."
                className="w-full bg-slate-100 text-slate-800 rounded-full py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-sm"
              />
              <motion.button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                whileTap={{ scale: 0.9 }}
                aria-label="发送消息"
                className="absolute right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "关闭 AI 助手" : "打开 AI 助手"}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`pointer-events-auto flex items-center justify-center w-14 h-14 rounded-full shadow-xl z-50 bg-gradient-to-r from-red-600 to-red-500 text-white`}
      >
        <MessageCircle size={28} />
      </motion.button>
    </div>
  );
};

export default AIChat;
