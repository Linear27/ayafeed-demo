
import React from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { NewsItem } from '../types';

interface NewsDetailModalProps {
  newsItem: NewsItem;
  onClose: () => void;
}

const NewsDetailModal: React.FC<NewsDetailModalProps> = ({ newsItem, onClose }) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 10 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="bg-[#FDFBF7] w-full max-w-lg border-2 border-black newspaper-shadow relative z-10"
      >
        <div className="px-6 py-4 border-b-2 border-black flex justify-between items-start bg-slate-100">
           <div>
              <div className="flex items-center gap-2 mb-1">
                 <span className="text-xs font-black font-mono uppercase bg-black text-white px-2 py-0.5">{newsItem.type || 'NEWS'}</span>
                 <span className="text-xs font-bold font-mono text-slate-600">{newsItem.date}</span>
              </div>
              <h3 className="text-xl font-black font-header leading-snug">{newsItem.title}</h3>
           </div>
           <button onClick={onClose} className="p-1 hover:bg-slate-200 border border-transparent hover:border-black transition-colors">
              <X size={24} className="text-black" />
           </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh] bg-white">
           <div className="prose prose-slate prose-sm max-w-none text-slate-800 font-serif leading-relaxed">
              {newsItem.content ? (
                  <p className="whitespace-pre-line">{newsItem.content}</p>
              ) : (
                  <p className="italic text-slate-400">No content available.</p>
              )}
           </div>
        </div>
        
        <div className="p-4 border-t-2 border-black flex justify-end bg-slate-50">
           {newsItem.url && newsItem.url !== '#' && (
              <a 
                href={newsItem.url} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-bold border-2 border-black hover:bg-red-700 hover:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                Source Link <ExternalLink size={14} />
              </a>
           )}
        </div>
      </motion.div>
    </div>
  );
};

export default NewsDetailModal;
