
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, Layout, Sparkles, Package, ShoppingBag, BookOpen, 
  MapPin, Calendar, Clock, Radio, Info, ExternalLink, 
  Zap, Newspaper, User, Users, Globe, Twitter, Tag, ShieldCheck,
  ArrowRight, Loader2, Check, Palette
} from 'lucide-react';
import { ViewState } from '../types';
import { TagBadge, StatusBadge } from '../components/Common';
import BrandLogo from '../components/BrandLogo';
import { EventCardSkeleton, LiveCardSkeleton, CircleCardSkeleton } from '../components/Skeleton';

const ComponentShowcaseView: React.FC<{ onNavigate: (v: ViewState) => void }> = ({ onNavigate }) => {
  const PAPER_SCHEMES = [
    {
      id: 'morning',
      name: 'Morning Edition',
      label: '晨间版 (清新)',
      tokens: {
        '--paper-bg': '#FDFBF7',
        '--paper-bg-secondary': '#F5F2ED',
        '--paper-surface': '#FFFFFF',
        '--paper-border': '#111827',
        '--paper-text': '#111827',
        '--paper-text-muted': '#4B5563',
        '--paper-accent': '#DC2626',
      }
    },
    {
      id: 'archive',
      name: 'Archive Paper',
      label: '档案版 (推荐)',
      recommended: true,
      tokens: {
        '--paper-bg': '#F4F1EA',
        '--paper-bg-secondary': '#EBE7DE',
        '--paper-surface': '#F9F7F2',
        '--paper-border': '#1A1A1A',
        '--paper-text': '#1A1A1A',
        '--paper-text-muted': '#57534E',
        '--paper-accent': '#DC2626',
      }
    },
    {
      id: 'antique',
      name: 'Antique Scroll',
      label: '古籍版 (深邃)',
      tokens: {
        '--paper-bg': '#EFE9D9',
        '--paper-bg-secondary': '#E5DDC8',
        '--paper-surface': '#F6F2E8',
        '--paper-border': '#292524',
        '--paper-text': '#1C1917',
        '--paper-text-muted': '#78716C',
        '--paper-accent': '#B91C1C',
      }
    }
  ];

  const [selectedScheme, setSelectedScheme] = useState(PAPER_SCHEMES[1]);

  const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mb-16">
      <h2 className="text-xl font-black uppercase tracking-[0.2em] mb-8 pb-2 border-b-2 border-black font-header">
        {title}
      </h2>
      {children}
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="min-h-screen pb-20 pt-8 bg-(--paper-bg)"
    >
      <div className="max-w-7xl mx-auto px-4">
        <button 
          onClick={() => onNavigate('LANDING')} 
          className="flex items-center mb-10 text-xs font-black uppercase tracking-widest transition-colors text-(--paper-text) hover:text-red-600 font-mono"
        >
          <ChevronLeft size={16} className="mr-1" /> 返回首页
        </button>

        <div className="mb-12">
            <h1 className="text-4xl sm:text-6xl font-black mb-4 font-header border-b-4 border-(--paper-border) pb-2 text-(--paper-text)">
                组件库展示
            </h1>
            <p className="text-lg max-w-2xl font-serif italic text-(--paper-text-muted)">
                AyaFeed 系统内所有核心 UI 组件在 NEWSPAPER 模式下的视觉表现。
            </p>
        </div>

        {/* 0. Brand Assets Section */}
        <Section title="0. 品牌原子 (Atomic Brand Assets)">
          <div className="grid grid-cols-1 gap-8">
            <div className="p-8 bg-(--paper-surface) border-2 border-(--paper-border) newspaper-shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase mb-8">尺寸分级 (Scale Variations)</h3>
              <div className="flex items-end gap-12">
                <div className="flex flex-col items-center gap-4">
                  <BrandLogo size="lg" />
                  <span className="text-[10px] font-mono font-bold opacity-40">Large / 64px</span>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <BrandLogo size="md" />
                  <span className="text-[10px] font-mono font-bold opacity-40">Medium / 40px</span>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <BrandLogo size="sm" />
                  <span className="text-[10px] font-mono font-bold opacity-40">Small / 32px</span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Paper Background Variants Section */}
        <Section title="Paper Background Variants / 报纸背景方案">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Controls */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 bg-(--paper-surface) border-2 border-(--paper-border) newspaper-shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Palette size={18} className="text-(--paper-accent)" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-(--paper-text)">方案选择</h3>
                </div>
                <div className="space-y-3">
                  {PAPER_SCHEMES.map((scheme) => (
                    <button
                      key={scheme.id}
                      onClick={() => setSelectedScheme(scheme)}
                      className={`w-full flex items-center justify-between p-4 border-2 transition-all font-bold text-sm ${
                        selectedScheme.id === scheme.id 
                          ? 'border-(--paper-border) bg-(--paper-border) text-(--paper-surface) translate-x-1' 
                          : 'border-slate-200 bg-(--paper-surface) text-slate-600 hover:border-(--paper-border) hover:text-(--paper-text)'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 border border-black/10" 
                          style={{ backgroundColor: scheme.tokens['--paper-bg'] }} 
                        />
                        <span>{scheme.label}</span>
                      </div>
                      {scheme.recommended && selectedScheme.id !== scheme.id && (
                        <span className="text-[10px] bg-(--paper-accent) text-white px-1.5 py-0.5 uppercase">Rec</span>
                      )}
                      {selectedScheme.id === scheme.id && <Check size={16} />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-(--paper-surface) border-2 border-(--paper-border) newspaper-shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">当前方案 Token</h3>
                <div className="space-y-2 font-mono text-[11px] text-(--paper-text)">
                  {Object.entries(selectedScheme.tokens).map(([token, value]) => (
                    <div key={token} className="flex items-center justify-between py-1 border-b border-black/5 last:border-0">
                      <span className="opacity-60">{token}</span>
                      <span className="font-bold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview Area */}
            <div className="lg:col-span-8">
              <div 
                className="relative min-h-125 border-4 border-black newspaper-shadow overflow-hidden transition-colors duration-500 p-8 md:p-12"
                style={selectedScheme.tokens as React.CSSProperties}
              >
                {/* Texture Layer */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                />
                
                <div className="relative z-10 space-y-8" style={{ color: 'var(--paper-text)' }}>
                  <div className="flex justify-between items-start border-b-2 border-(--paper-border) pb-4">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">Intelligence Preview</h4>
                      <h2 className="text-3xl md:text-5xl font-black font-header leading-tight">
                        {selectedScheme.name} <span className="text-(--paper-accent)">Visual Baseline</span>
                      </h2>
                    </div>
                    {selectedScheme.recommended && (
                      <div className="stamp scale-75 origin-top-right">RECOMMENDED</div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <p className="text-lg font-serif leading-relaxed">
                        这是一段测试正文。在「{selectedScheme.label}」方案下，我们追求的是极致的阅读舒适度与报纸质感的平衡。
                        <span className="italic opacity-80"> 墨色与纸张的交织，构成了新闻的灵魂。</span>
                      </p>
                      <div className="flex items-center gap-4">
                        <button className="px-6 py-3 bg-(--paper-accent) text-white font-black text-xs uppercase tracking-widest border-2 border-(--paper-border) shadow-[3px_3px_0px_0px_var(--paper-border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all">
                          Action Button
                        </button>
                        <a href="#" className="text-xs font-black uppercase tracking-widest border-b-2 border-(--paper-accent) hover:opacity-70 transition-opacity">
                          Secondary Link
                        </a>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-6 border-2 border-(--paper-border) bg-(--paper-surface) shadow-[4px_4px_0px_0px_var(--paper-border)]">
                        <h3 className="text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                          <Info size={14} className="text-(--paper-accent)" /> Surface Card
                        </h3>
                        <p className="text-sm opacity-80 font-serif">
                          卡片背景使用 <code className="bg-black/5 px-1 rounded">--paper-surface</code>，确保在深色背景下依然有足够的层级感。
                        </p>
                      </div>
                      
                      <div className="p-4 bg-(--paper-bg-secondary) border-l-4 border-(--paper-accent)">
                        <p className="text-xs font-bold italic opacity-70">
                          "Secondary background is used for subtle grouping and metadata sections."
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-(--paper-border) opacity-30 flex justify-between items-center font-mono text-[10px] font-bold uppercase tracking-widest">
                    <span>Contrast Check: PASS (WCAG AA)</span>
                    <span>AyaFeed Design System v2.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section title="1. 徽章与标签 (Badges & Tags)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
               <h3 className="text-xs font-bold text-slate-400 uppercase mb-4">Status Badges</h3>
               <div className="flex flex-wrap gap-4">
                  <StatusBadge status="Today" />
                  <StatusBadge status="This week" />
                  <StatusBadge status="Soon" />
                  <StatusBadge status="Past" />
               </div>
            </div>
            <div className="space-y-4">
               <h3 className="text-xs font-bold text-slate-400 uppercase mb-4">Content Badges</h3>
               <div className="flex flex-wrap gap-2">
                  <TagBadge label="Music" type="purple" />
                  <TagBadge label="Novel" type="yellow" />
                  <TagBadge label="Manga" type="blue" />
                  <TagBadge label="Other" type="gray" />
               </div>
            </div>
          </div>
        </Section>

        <Section title="2. 交互按钮 (Interactive Buttons)">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <button className="py-4 px-8 font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-2 bg-(--paper-accent) text-white border-2 border-(--paper-border) shadow-[4px_4px_0px_0px_var(--paper-border)]">
              主操作按钮 <ArrowRight size={18}/>
            </button>
            
            <button className="py-4 px-8 font-black text-sm uppercase tracking-[0.2em] border-2 flex items-center justify-center gap-2 bg-(--paper-surface) border-(--paper-border) text-(--paper-text)">
              次要按钮 <ExternalLink size={18}/>
            </button>

            <button className="py-4 px-8 font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 border-2 border-dashed bg-(--paper-bg-secondary) border-slate-300 text-slate-500">
              虚线辅助按钮
            </button>
          </div>
        </Section>

        <Section title="3. 信息卡片 (Data Cards)">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div className="p-8 bg-(--paper-surface) border-4 border-(--paper-border) newspaper-shadow">
                <div className="flex items-center gap-2 mb-6">
                    <Radio size={20} className="text-(--paper-accent) animate-pulse"/>
                    <h3 className="text-xl font-black uppercase tracking-wider text-(--paper-text)">实时快讯卡片</h3>
                </div>
                <div className="p-4 mb-4 bg-(--paper-bg-secondary) border-l-4 border-(--paper-accent) font-serif italic text-(--paper-text)">
                   "这是一条模拟的紧急通告信息。天狗的新闻速度永远不会让你失望。"
                </div>
                <div className="space-y-4 text-(--paper-text)">
                   <div className="flex justify-between items-center py-2 border-b border-black/10">
                      <span className="text-xs font-bold text-(--paper-text-muted) uppercase">发布者</span>
                      <span className="font-bold">文文新闻社</span>
                   </div>
                   <div className="flex justify-between items-center py-2 border-b border-black/10">
                      <span className="text-xs font-bold text-(--paper-text-muted) uppercase">优先级</span>
                      <span className="text-(--paper-accent) font-black">HIGH</span>
                   </div>
                </div>
             </div>

             <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-(--paper-surface) border-2 border-(--paper-border) newspaper-shadow-sm">
                   <div className="w-12 h-12 flex items-center justify-center shrink-0 bg-(--paper-border) text-(--paper-surface)">
                      <Calendar size={24} />
                   </div>
                   <div>
                      <div className="text-[10px] font-black text-(--paper-text-muted) uppercase">举办日期</div>
                      <div className="text-lg font-black leading-tight text-(--paper-text)">2025-11-08</div>
                   </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-(--paper-surface) border-2 border-(--paper-border) newspaper-shadow-sm">
                   <div className="w-12 h-12 flex items-center justify-center shrink-0 bg-(--paper-border) text-(--paper-surface)">
                      <MapPin size={24} />
                   </div>
                   <div>
                      <div className="text-[10px] font-black text-(--paper-text-muted) uppercase">举办地点</div>
                      <div className="text-lg font-black leading-tight text-(--paper-text)">京都市勧业馆みやこめっせ</div>
                   </div>
                </div>
             </div>
          </div>
        </Section>

        {/* 5. Loading States Section */}
        <Section title="5. 加载状态 (Loading States / Skeletons)">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4 space-y-8">
                <div className="flex items-center gap-2 mb-4">
                   <Loader2 size={18} className="animate-spin text-red-600"/>
                   <h3 className="text-xs font-bold uppercase text-black">骨架屏策略</h3>
                </div>
                <p className="text-sm leading-relaxed text-slate-700 font-serif">
                   在报纸模式下，骨架屏使用更轻盈的 <span className="font-black underline decoration-red-600">墨色阴影 (Shadow-SM)</span> 替代厚重的实体阴影，
                   确保在复杂布局中保持清晰。
                </p>
                <div className="flex flex-col items-center">
                   <div className="w-full max-w-60">
                      <CircleCardSkeleton count={1} />
                   </div>
                   <p className="mt-4 text-[10px] font-mono font-bold opacity-40 text-center uppercase tracking-widest">Circle Placeholder Preview</p>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-8">
                <div className="space-y-6">
                   <h3 className="text-xs font-bold uppercase tracking-widest text-black border-l-4 border-red-600 pl-4">复合布局预览 (Complex Previews)</h3>
                   <div className="grid grid-cols-1 gap-8">
                      <div className="space-y-3">
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Event Slot Prototype</span>
                         <EventCardSkeleton count={1} />
                      </div>
                      <div className="space-y-3">
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Item Prototype</span>
                         <LiveCardSkeleton count={1} />
                      </div>
                   </div>
                </div>
              </div>
           </div>
        </Section>

        <Section title="6. 排版示例 (Typography)">
           <div className="space-y-12 max-w-4xl font-serif text-(--paper-text)">
              <div>
                 <h4 className="text-sm font-bold text-(--paper-text-muted) mb-4 uppercase">Headlines</h4>
                 <h1 className="text-5xl font-black leading-none mb-4">射命丸文の特別取材报告</h1>
                 <p className="text-xl font-bold">这里的每一段文字都经过了严格的现场核实。</p>
              </div>
              <div>
                 <h4 className="text-sm font-bold text-(--paper-text-muted) mb-4 uppercase">Body Text</h4>
                 <div className="space-y-4 text-(--paper-text) leading-relaxed text-lg">
                    <p>
                       在幻想乡的边缘，同人文化的火种从未熄灭。无论是博丽神社的例大祭，还是人间之里的日常集市，信息的流动速度决定了你的参展体验。
                    </p>
                    <p className="italic border-l-4 border-black/10 pl-6">
                       "最速、最全、最独家。这是文文。速报对读者的永恒承诺。"
                    </p>
                 </div>
              </div>
           </div>
        </Section>

        <Section title="7. 实验性布局 (Experimental Layouts)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-(--paper-surface) border-2 border-(--paper-border) newspaper-shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-(--paper-accent)">
                <Sparkles size={20} />
                <h3 className="text-lg font-black uppercase tracking-wider">Event List Experience</h3>
              </div>
              <p className="text-sm mb-6 font-serif italic text-(--paper-text)">
                探索 Bento Grid、水平时间轴等非线性布局，旨在提升展会名录的视觉冲击力与探索感。
              </p>
              <button 
                onClick={() => onNavigate('EVENT_LIST_EXP')}
                className="w-full py-4 font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-2 bg-(--paper-border) text-(--paper-surface) hover:bg-(--paper-accent) transition-colors"
              >
                进入实验室 <ArrowRight size={18}/>
              </button>
            </div>

            <div className="p-8 bg-(--paper-surface) border-2 border-(--paper-border) newspaper-shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-(--paper-accent)">
                <Zap size={20} />
                <h3 className="text-lg font-black uppercase tracking-wider">Landing Page Experience</h3>
              </div>
              <p className="text-sm mb-6 font-serif italic text-(--paper-text)">
                基于竞品分析（DICE/Eventbrite）的实验性首页。强化“发现优先”逻辑与“时间切片”编排。
              </p>
              <button 
                onClick={() => onNavigate('LANDING_EXP')}
                className="w-full py-4 font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-2 bg-(--paper-border) text-(--paper-surface) hover:bg-(--paper-accent) transition-colors"
              >
                进入实验室 <ArrowRight size={18}/>
              </button>
            </div>
          </div>
        </Section>
      </div>
    </motion.div>
  );
};

export default ComponentShowcaseView;
