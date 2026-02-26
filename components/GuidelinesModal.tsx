
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, X, FileText, ExternalLink, ArrowLeft, FolderOpen, FileCheck, ShieldAlert, Stamp, Users } from 'lucide-react';
import { Theme } from '../types';

interface ExtendedDoc {
  title: string;
  url: string;
  type: 'PDF' | 'Link';
  category: 'Attendee' | 'Circle';
  order: number;
}

const GuidelinesModal: React.FC<{ 
  docs: unknown; 
  onClose: () => void; 
  theme?: Theme;
}> = ({ docs, onClose }) => {
  const allDocs: ExtendedDoc[] = React.useMemo(() => {
    if (Array.isArray(docs)) {
      return docs
        .map((doc: any, idx) => ({
          title: doc.label || `文档 ${idx + 1}`,
          url: doc.url || '#',
          type: doc.type === 'PDF' ? 'PDF' : 'Link',
          category: doc.category === 'Circle' ? 'Circle' : 'Attendee',
          order: typeof doc.order === 'number' ? doc.order : idx + 1,
        }))
        .sort((a, b) => a.order - b.order);
    }

    if (docs && typeof docs === 'object') {
      const raw = docs as { attendee?: any[]; circle?: any[] };
      const attendeeDocs = (raw.attendee || []).map((doc, idx) => ({
        title: doc.title || `Attendee Doc ${idx + 1}`,
        url: doc.url || '#',
        type: doc.type === 'PDF' ? 'PDF' : 'Link',
        category: 'Attendee' as const,
        order: idx + 1,
      }));
      const circleDocs = (raw.circle || []).map((doc, idx) => ({
        title: doc.title || `Circle Doc ${idx + 1}`,
        url: doc.url || '#',
        type: doc.type === 'PDF' ? 'PDF' : 'Link',
        category: 'Circle' as const,
        order: attendeeDocs.length + idx + 1,
      }));
      return [...attendeeDocs, ...circleDocs];
    }

    return [];
  }, [docs]);

  const [selectedDoc, setSelectedDoc] = useState<ExtendedDoc | null>(null);

  // Auto-select first document on desktop if available
  React.useEffect(() => {
    if (window.innerWidth >= 768 && allDocs.length > 0 && !selectedDoc) {
      setSelectedDoc(allDocs[0]);
    }
  }, []);

  if (!docs) return null;

  // --- CONTENT MOCK ---
  const getMockContent = (doc: ExtendedDoc) => {
    return (
      <div className="space-y-6 leading-relaxed font-serif text-slate-800">
        <div className="p-8 min-h-[600px] max-w-[800px] mx-auto relative bg-[#fffef9] shadow-sm border border-slate-200">
          {/* Watermark for Newspaper */}
          <div className="absolute top-10 right-10 opacity-10 pointer-events-none rotate-[-20deg]">
             <Stamp size={150} className="text-red-600" />
          </div>

          <div className="border-b-2 pb-4 mb-8 border-black">
            <h1 className="text-3xl font-bold mb-2 font-header text-black">{doc.title}</h1>
            <div className="text-sm flex justify-between uppercase tracking-wider font-mono font-bold text-slate-500">
              <span>Category: {doc.category}</span>
              <span>Format: {doc.type}</span>
            </div>
          </div>
          
          <p className="mb-4">
            <strong>1. Introduction</strong><br/>
            This document serves as the official guideline for {doc.title}. All participants are expected to review this information thoroughly.
          </p>
          <p className="mb-4">
            <strong>2. General Protocols</strong><br/>
            Compliance with event regulations is mandatory. Please follow staff instructions at all times.
          </p>
          
          <div className="p-4 my-6 border-l-4 border-red-600 bg-red-50 italic text-slate-900">
             <div className="flex items-center gap-2 font-bold mb-1"><ShieldAlert size={16}/> Important Note</div>
             "Safety and courtesy are paramount. Let's create a wonderful event together."
          </div>

          <div className="mt-12 pt-8 border-t text-center text-sm border-slate-300 font-mono text-slate-400">
             Document ID: {Math.random().toString(36).substr(2, 9).toUpperCase()} • Verified
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="w-full max-w-6xl h-full md:h-[85vh] relative flex overflow-hidden z-10 bg-[#FDFBF7] md:border-4 md:border-black md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
      >
        {/* Mobile: View State Management (List vs Detail) */}
        <div className={`flex w-full h-full ${selectedDoc ? 'md:flex' : 'flex'}`}>
          
          {/* SIDEBAR / LIST VIEW */}
          <div className={`w-full md:w-80 lg:w-96 flex-shrink-0 flex flex-col z-20 bg-[#F3F1E6] border-r-2 border-black ${selectedDoc ? 'hidden md:flex' : 'flex'}`}>
            
            {/* Sidebar Header */}
            <div className="p-5 flex justify-between items-center sticky top-0 z-10 bg-[#FDFBF7] border-b-2 border-black">
               <div>
                   <div className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-1">CLASSIFIED</div>
                   <h3 className="font-bold flex items-center text-xl font-header text-black">
                     <FolderOpen size={20} className="mr-2 text-black" /> 
                     Official Docs
                   </h3>
               </div>
               <button onClick={onClose} className="p-1.5 rounded-full md:hidden bg-black text-white">
                 <X size={20} />
               </button>
            </div>
            
            {/* List Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-8">
              {(['Attendee', 'Circle'] as const).map((cat) => {
                  const categoryDocs = allDocs.filter(d => d.category === cat);
                  if (categoryDocs.length === 0) return null;

                  return (
                    <div key={cat}>
                        <div className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center text-slate-900 border-b border-black pb-1">
                           {cat === 'Attendee' ? <Users size={12} className="mr-2"/> : <FileCheck size={12} className="mr-2"/>}
                           {cat === 'Attendee' ? 'General Admission' : 'Circle Participation'}
                        </div>
                        
                        <div className="space-y-2 pl-2">
                           {categoryDocs.map((doc, i) => {
                              const isSelected = selectedDoc?.title === doc.title;
                              return (
                                <button 
                                  key={i}
                                  onClick={() => setSelectedDoc(doc)}
                                  className={`w-full text-left p-3 flex items-start group transition-all relative border-l-4 ${isSelected ? 'bg-black text-white border-red-600 shadow-md' : 'bg-white border-slate-300 text-slate-800 hover:border-black hover:bg-slate-100'}`}
                                >
                                   {/* Icon */}
                                   <div className={`mt-0.5 w-8 h-8 flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'text-red-500' : 'text-slate-400'}`}>
                                      <FileText size={18} />
                                   </div>

                                   <div className="ml-3 min-w-0 flex-1">
                                      <div className={`font-bold text-sm truncate ${isSelected ? 'font-mono' : 'font-serif'}`}>
                                          {doc.title}
                                      </div>
                                      <div className={`text-[10px] mt-0.5 uppercase tracking-wide ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                                          {doc.type} FILE
                                      </div>
                                   </div>
                                   
                                   {/* Newspaper Selection Indicator */}
                                   {isSelected && (
                                       <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-600 rounded-full"></div>
                                   )}
                                </button>
                              );
                           })}
                        </div>
                    </div>
                  );
              })}
            </div>
            
            {/* Desktop Footer Action */}
            <div className="p-4 hidden md:block bg-[#FDFBF7] border-t-2 border-black">
               <button onClick={onClose} className="w-full py-3 font-bold transition-all uppercase tracking-widest text-xs bg-white border-2 border-black text-black hover:bg-black hover:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                 Close Archive
               </button>
            </div>
          </div>

          {/* MAIN CONTENT / VIEWER */}
          <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#E5E5E5] pattern-dots ${!selectedDoc ? 'hidden md:flex' : 'flex'}">
            
            {selectedDoc ? (
              <>
                {/* Viewer Header */}
                <div className="h-16 flex items-center justify-between px-4 sm:px-6 z-10 bg-[#FDFBF7] border-b-2 border-black">
                   <div className="flex items-center min-w-0">
                      <button onClick={() => setSelectedDoc(null)} className="md:hidden mr-3 p-2 -ml-2 rounded-full text-black hover:bg-slate-200">
                         <ArrowLeft size={20} />
                      </button>
                      <div className="min-w-0">
                         <h2 className="font-bold truncate font-header text-lg">{selectedDoc.title}</h2>
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-3">
                      <a 
                        href={selectedDoc.url && selectedDoc.url !== '#' ? selectedDoc.url : undefined} 
                        target="_blank" 
                        rel="noreferrer" 
                        aria-disabled={!selectedDoc.url || selectedDoc.url === '#'}
                        onClick={(e) => {
                          if (!selectedDoc.url || selectedDoc.url === '#') e.preventDefault();
                        }}
                        className="flex items-center px-4 py-2 text-sm font-bold transition-all bg-red-600 text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-none"
                      >
                         <span className="hidden sm:inline mr-2">Download / Open</span>
                         <span className="sm:hidden mr-2">Open</span>
                         <ExternalLink size={14} />
                      </a>
                      <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full hidden md:block ml-2">
                        <X size={24} />
                      </button>
                   </div>
                </div>
                
                {/* Viewer Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-8">
                   {getMockContent(selectedDoc)}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
                 <div className="w-24 h-24 flex items-center justify-center mb-6 bg-white border-2 border-black rounded-full">
                    <BookOpen size={40} className="text-black" />
                 </div>
                 <p className="font-bold text-xl font-header text-black">Select a document to preview</p>
                 <p className="text-sm mt-2 opacity-60">Choose from the list on the left</p>
              </div>
            )}
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default GuidelinesModal;
