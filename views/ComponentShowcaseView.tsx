
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, Layout, Sparkles, Package, ShoppingBag, BookOpen, 
  MapPin, Calendar, Clock, Radio, Info, ExternalLink, 
  Zap, Newspaper, User, Users, Globe, Twitter, Tag, ShieldCheck,
  ArrowRight, Loader2
} from 'lucide-react';
import { ViewState } from '../types';
import { TagBadge, StatusBadge } from '../components/Common';
import BrandLogo from '../components/BrandLogo';
import { EventCardSkeleton, LiveCardSkeleton, CircleCardSkeleton } from '../components/Skeleton';

const ComponentShowcaseView: React.FC<{ onNavigate: (v: ViewState) => void }> = ({ onNavigate }) => {
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
      className="min-h-screen pb-20 pt-8 bg-[#FDFBF7]"
    >
      <div className="max-w-7xl mx-auto px-4">
        <button 
          onClick={() => onNavigate('LANDING')} 
          className="flex items-center mb-10 text-xs font-black uppercase tracking-widest transition-colors text-black hover:text-red-600 font-mono"
        >
          <ChevronLeft size={16} className="mr-1" /> 返回首页
        </button>

        <div className="mb-12">
            <h1 className="text-4xl sm:text-6xl font-black mb-4 font-header border-b-4 border-black pb-2">
                组件库展示
            </h1>
            <p className="text-lg max-w-2xl font-serif italic">
                AyaFeed 系统内所有核心 UI 组件在 NEWSPAPER 模式下的视觉表现。
            </p>
        </div>

        {/* 0. Brand Assets Section */}
        <Section title="0. 品牌原子 (Atomic Brand Assets)">
          <div className="grid grid-cols-1 gap-8">
            <div className="p-8 bg-white border-2 border-black newspaper-shadow-sm">
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
            <button className="py-4 px-8 font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-2 bg-red-600 text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              主操作按钮 <ArrowRight size={18}/>
            </button>
            
            <button className="py-4 px-8 font-black text-sm uppercase tracking-[0.2em] border-2 flex items-center justify-center gap-2 bg-white border-black text-black">
              次要按钮 <ExternalLink size={18}/>
            </button>

            <button className="py-4 px-8 font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 border-2 border-dashed bg-slate-100 border-slate-300 text-slate-500">
              虚线辅助按钮
            </button>
          </div>
        </Section>

        <Section title="3. 信息卡片 (Data Cards)">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div className="p-8 bg-white border-4 border-black newspaper-shadow">
                <div className="flex items-center gap-2 mb-6">
                    <Radio size={20} className="text-red-600 animate-pulse"/>
                    <h3 className="text-xl font-black uppercase tracking-wider">实时快讯卡片</h3>
                </div>
                <div className="p-4 mb-4 bg-slate-50 border-l-4 border-red-600 font-serif italic">
                   "这是一条模拟的紧急通告信息。天狗的新闻速度永远不会让你失望。"
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-center py-2 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-500 uppercase">发布者</span>
                      <span className="font-bold">文文新闻社</span>
                   </div>
                   <div className="flex justify-between items-center py-2 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-500 uppercase">优先级</span>
                      <span className="text-red-600 font-black">HIGH</span>
                   </div>
                </div>
             </div>

             <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-white border-2 border-black newspaper-shadow-sm">
                   <div className="w-12 h-12 flex items-center justify-center shrink-0 bg-black text-white">
                      <Calendar size={24} />
                   </div>
                   <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase">举办日期</div>
                      <div className="text-lg font-black leading-tight">2025-11-08</div>
                   </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white border-2 border-black newspaper-shadow-sm">
                   <div className="w-12 h-12 flex items-center justify-center shrink-0 bg-black text-white">
                      <MapPin size={24} />
                   </div>
                   <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase">举办地点</div>
                      <div className="text-lg font-black leading-tight">京都市勧业馆みやこめっせ</div>
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
                   <div className="w-full max-w-[240px]">
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
           <div className="space-y-12 max-w-4xl font-serif">
              <div>
                 <h4 className="text-sm font-bold text-slate-400 mb-4 uppercase">Headlines</h4>
                 <h1 className="text-5xl font-black leading-none mb-4">射命丸文の特別取材报告</h1>
                 <p className="text-xl font-bold">这里的每一段文字都经过了严格的现场核实。</p>
              </div>
              <div>
                 <h4 className="text-sm font-bold text-slate-400 mb-4 uppercase">Body Text</h4>
                 <div className="space-y-4 text-slate-700 leading-relaxed text-lg">
                    <p>
                       在幻想乡的边缘，同人文化的火种从未熄灭。无论是博丽神社的例大祭，还是人间之里的日常集市，信息的流动速度决定了你的参展体验。
                    </p>
                    <p className="italic border-l-4 border-slate-200 pl-6">
                       "最速、最全、最独家。这是文文快讯对读者的永恒承诺。"
                    </p>
                 </div>
              </div>
           </div>
        </Section>

        <Section title="7. 实验性布局 (Experimental Layouts)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-white border-2 border-black newspaper-shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-red-600">
                <Sparkles size={20} />
                <h3 className="text-lg font-black uppercase tracking-wider">Event List Experience</h3>
              </div>
              <p className="text-sm mb-6 font-serif italic">
                探索 Bento Grid、水平时间轴等非线性布局，旨在提升展会名录的视觉冲击力与探索感。
              </p>
              <button 
                onClick={() => onNavigate('EVENT_LIST_EXP')}
                className="w-full py-4 font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-2 bg-black text-white hover:bg-red-600 transition-colors"
              >
                进入实验室 <ArrowRight size={18}/>
              </button>
            </div>

            <div className="p-8 bg-white border-2 border-black newspaper-shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-red-600">
                <Zap size={20} />
                <h3 className="text-lg font-black uppercase tracking-wider">Landing Page Experience</h3>
              </div>
              <p className="text-sm mb-6 font-serif italic">
                基于竞品分析（DICE/Eventbrite）的实验性首页。强化“发现优先”逻辑与“时间切片”编排。
              </p>
              <button 
                onClick={() => onNavigate('LANDING_EXP')}
                className="w-full py-4 font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-2 bg-black text-white hover:bg-red-600 transition-colors"
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
