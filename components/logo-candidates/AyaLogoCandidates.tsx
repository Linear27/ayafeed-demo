
import React from 'react';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { Star, AlertCircle, Layers, Stamp, CheckCircle2, Info, Sparkles } from 'lucide-react';

export type LogoCandidate = {
  id: string;
  name: string;
  concept: string;
  elements: string;
  font: {
    en: string;
    zh: string;
  };
  colors: {
    primary: string;
    secondary: string;
  };
  scores: {
    consistency: number;
    recognition: number;
    readability: number;
    simplicity: number;
    scalability: number;
  };
  useCase: string;
  feasibility: string;
  renderIcon: (props: { size: number, color?: string, className?: string, isHovered?: boolean }) => React.ReactNode;
};

// 统一动效配置
const TRANSITION = { duration: 0.18, ease: "easeOut" };

export const LOGO_CANDIDATES: LogoCandidate[] = [
  {
    id: 'messenger',
    name: 'The Messenger / 极速羽翼',
    concept: '抽象的鸦羽构成 A 字，致敬射命丸文的极速与文化传播。',
    elements: '三片锐利羽毛、上升动感、流线型 A。',
    font: { en: 'Playfair Display', zh: '思源宋体 Bold' },
    colors: { primary: '#111827', secondary: '#DC2626' },
    scores: { consistency: 10, recognition: 9, readability: 9, simplicity: 8, scalability: 9 },
    useCase: '全场景通用，尤其是社论、专栏与品牌核心标识。',
    feasibility: '极简剪影，16px 下依然保持 A 字轮廓，黑白表现完美。',
    renderIcon: ({ size, color, className }) => (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <motion.path 
          d="M20 80C20 80 40 20 80 20" 
          stroke={color || "#111827"} strokeWidth="8" strokeLinecap="round"
          variants={{ hover: { y: -4, x: -2 } }}
          transition={TRANSITION}
        />
        <motion.path 
          d="M35 80C35 80 50 40 80 40" 
          stroke={color || "#111827"} strokeWidth="8" strokeLinecap="round"
          variants={{ hover: { y: -2, x: -1 } }}
          transition={TRANSITION}
        />
        <motion.path 
          d="M50 80C50 80 60 60 80 60" 
          stroke={color || "#DC2626"} strokeWidth="8" strokeLinecap="round"
          variants={{ hover: { y: 0, x: 0, scale: 1.05 } }}
          transition={TRANSITION}
        />
      </svg>
    )
  },
  {
    id: 'observer',
    name: 'The Observer / 观察者',
    concept: '几何化眼眸融合快门结构，象征全知视角与现场记录。',
    elements: '同心圆、十字准星、核心焦点。',
    font: { en: 'Inter Black', zh: '思源黑体 Bold' },
    colors: { primary: '#111827', secondary: '#DC2626' },
    scores: { consistency: 8, recognition: 8, readability: 9, simplicity: 9, scalability: 8 },
    useCase: '摄影专题、现场快讯、调查报告。',
    feasibility: '圆形结构稳定，16px 下中心红点成为视觉重心。',
    renderIcon: ({ size, color, className }) => (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <motion.circle 
          cx="50" cy="50" r="40" 
          stroke={color || "#111827"} strokeWidth="8"
          variants={{ hover: { scale: 0.95 } }}
          transition={TRANSITION}
        />
        <motion.circle 
          cx="50" cy="50" r="12" 
          fill={color || "#DC2626"}
          variants={{ hover: { scale: 1.2 } }}
          transition={TRANSITION}
        />
        <motion.path 
          d="M30 30L40 40M70 70L60 60M70 30L60 40M30 70L40 60" 
          stroke={color || "#111827"} strokeWidth="6" strokeLinecap="round"
          variants={{ hover: { scale: 0.8, opacity: 0.6 } }}
          transition={TRANSITION}
        />
      </svg>
    )
  },
  {
    id: 'column',
    name: 'The Column / 报业基石',
    concept: '粗壮的垂直线条构成 A 字，模拟报纸排版立柱。',
    elements: '等宽垂直条、负空间 A、水平连接。',
    font: { en: 'Space Grotesk', zh: '阿里巴巴普惠体 Bold' },
    colors: { primary: '#111827', secondary: '#DC2626' },
    scores: { consistency: 9, recognition: 7, readability: 10, simplicity: 9, scalability: 9 },
    useCase: '官方公告、展会名录、数据看板。',
    feasibility: '块状结构极度抗干扰，适合极小尺寸印刷。',
    renderIcon: ({ size, color, className }) => (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <motion.path 
          d="M20 85V15H80V85" 
          stroke={color || "#111827"} strokeWidth="14" strokeLinejoin="round"
          variants={{ hover: { y: -2 } }}
          transition={TRANSITION}
        />
        <motion.path 
          d="M20 55H80" 
          stroke={color || "#DC2626"} strokeWidth="14"
          variants={{ hover: { opacity: 0.8, y: -2 } }}
          transition={TRANSITION}
        />
      </svg>
    )
  },
  {
    id: 'ticker',
    name: 'The Ticker / 动态快讯',
    concept: '水平流动的讯息条结合报纸折角，体现数字快讯的即时性。',
    elements: '平行线条、动态位移、折角矩形。',
    font: { en: 'Roboto Mono', zh: '思源黑体' },
    colors: { primary: '#111827', secondary: '#DC2626' },
    scores: { consistency: 7, recognition: 8, readability: 7, simplicity: 7, scalability: 8 },
    useCase: '实时动态流、社交媒体分享预览。',
    feasibility: '线条感强，但在 16px 下可能略显拥挤。',
    renderIcon: ({ size, color, className }) => (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <motion.rect x="10" y="25" width="80" height="12" fill={color || "#111827"} variants={{ hover: { x: 2 } }} transition={TRANSITION} />
        <motion.rect x="10" y="45" width="60" height="12" fill={color || "#DC2626"} variants={{ hover: { x: 6 } }} transition={TRANSITION} />
        <motion.rect x="10" y="65" width="80" height="12" fill={color || "#111827"} variants={{ hover: { x: 2 } }} transition={TRANSITION} />
        <motion.path d="M75 45L90 60H75V45Z" fill={color || "#111827"} variants={{ hover: { x: 4 } }} transition={TRANSITION} />
      </svg>
    )
  },
  {
    id: 'nib',
    name: 'The Nib / 权威笔触',
    concept: '钢笔尖与数字节点的结合，象征记录的权威与数字存储。',
    elements: '锐利三角形、中缝分割、核心圆点。',
    font: { en: 'Crimson Text', zh: '思源宋体' },
    colors: { primary: '#111827', secondary: '#DC2626' },
    scores: { consistency: 9, recognition: 9, readability: 8, simplicity: 8, scalability: 7 },
    useCase: '深度阅读、历史存根、官方认证内容。',
    feasibility: '三角形轮廓极具指向性，24px 下笔尖结构清晰。',
    renderIcon: ({ size, color, className }) => (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <motion.path 
          d="M50 10L85 70H15L50 10Z" 
          stroke={color || "#111827"} strokeWidth="8" strokeLinejoin="round"
          variants={{ hover: { y: -3 } }}
          transition={TRANSITION}
        />
        <motion.path 
          d="M50 10V45" 
          stroke={color || "#111827"} strokeWidth="6"
          variants={{ hover: { y: -3, scaleY: 1.1 } }}
          transition={TRANSITION}
        />
        <motion.circle 
          cx="50" cy="58" r="10" 
          fill={color || "#DC2626"}
          variants={{ hover: { scale: 1.15, y: -1 } }}
          transition={TRANSITION}
        />
      </svg>
    )
  },
  {
    id: 'shutter',
    name: 'The Shutter / 瞬间捕捉',
    concept: '菱形快门结构，象征突破性的新闻爆发力。',
    elements: '旋转菱形、内部十字、负空间。',
    font: { en: 'Outfit', zh: '阿里巴巴普惠体' },
    colors: { primary: '#111827', secondary: '#DC2626' },
    scores: { consistency: 7, recognition: 7, readability: 8, simplicity: 9, scalability: 8 },
    useCase: '突发爆料、限时活动、动态封面。',
    feasibility: '几何感极强，黑白模式下反差极大，极具现代感。',
    renderIcon: ({ size, color, className }) => (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <motion.path 
          d="M50 10L90 50L50 90L10 50L50 10Z" 
          stroke={color || "#111827"} strokeWidth="8"
          variants={{ hover: { rotate: 5 } }}
          transition={TRANSITION}
        />
        <motion.path 
          d="M50 10V40M90 50H60M50 90V60M10 50H40" 
          stroke={color || "#DC2626"} strokeWidth="8" strokeLinecap="round"
          variants={{ hover: { scale: 1.1, rotate: -5 } }}
          transition={TRANSITION}
        />
      </svg>
    )
  },
  {
    id: 'node',
    name: 'The Node / 社区纽带',
    concept: '互锁的几何环，象征同人社群的紧密链接。',
    elements: '双圆环、交叠负空间、中心连接点。',
    font: { en: 'Quicksand', zh: '微软雅黑 Bold' },
    colors: { primary: '#111827', secondary: '#DC2626' },
    scores: { consistency: 6, recognition: 8, readability: 9, simplicity: 10, scalability: 9 },
    useCase: '社交功能、社团协作、互动社区。',
    feasibility: '结构极其简单，16px 下依然能识别出双环结构。',
    renderIcon: ({ size, color, className }) => (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <motion.circle 
          cx="40" cy="50" r="25" 
          stroke={color || "#111827"} strokeWidth="10"
          variants={{ hover: { x: 5 } }}
          transition={TRANSITION}
        />
        <motion.circle 
          cx="60" cy="50" r="25" 
          stroke={color || "#DC2626"} strokeWidth="10"
          variants={{ hover: { x: -5 } }}
          transition={TRANSITION}
        />
        <motion.circle 
          cx="50" cy="50" r="6" 
          fill={color || "#111827"}
          variants={{ hover: { scale: 1.5 } }}
          transition={TRANSITION}
        />
      </svg>
    )
  },
  {
    id: 'masthead',
    name: 'The Masthead / 官方方印',
    concept: '沉稳的方块印章，内置抽象字标，传达官方认证感。',
    elements: '粗边框、几何 A、水平横杠。',
    font: { en: 'Crimson Text', zh: '思源宋体 Bold' },
    colors: { primary: '#111827', secondary: '#DC2626' },
    scores: { consistency: 9, recognition: 8, readability: 10, simplicity: 9, scalability: 8 },
    useCase: '官方声明、版权标识、高端画册。',
    feasibility: '印章形式天然适配小尺寸，16px 下是一个稳固的红黑方块。',
    renderIcon: ({ size, color, className }) => (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <motion.rect 
          x="15" y="15" width="70" height="70" 
          stroke={color || "#111827"} strokeWidth="12"
          variants={{ hover: { scale: 0.96 } }}
          transition={TRANSITION}
        />
        <motion.path 
          d="M30 70L50 30L70 70" 
          stroke={color || "#DC2626"} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"
          variants={{ hover: { scale: 0.9, opacity: 0.8 } }}
          transition={TRANSITION}
        />
        <motion.path 
          d="M42 55H58" 
          stroke={color || "#111827"} strokeWidth="6"
          variants={{ hover: { scale: 0.9 } }}
          transition={TRANSITION}
        />
      </svg>
    )
  }
];

const AyaLogoCandidates: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  // 基础卡片动效
  const cardVariants: Variants = {
    initial: { opacity: 1, y: 0 },
    hover: { 
      y: shouldReduceMotion ? 0 : -4,
      transition: TRANSITION
    }
  };

  // 文字动效
  const textVariants: Variants = {
    initial: { x: 0 },
    hover: { 
      x: shouldReduceMotion ? 0 : 2,
      transition: TRANSITION
    }
  };

  return (
    <div className="space-y-24">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {LOGO_CANDIDATES.map((candidate) => (
          <motion.div 
            key={candidate.id} 
            initial="initial"
            whileHover="hover"
            variants={cardVariants}
            className="bg-white border-2 border-black newspaper-shadow-sm p-6 flex flex-col group transition-all cursor-default"
          >
            {/* 1. Large Icon Preview */}
            <div className="aspect-square bg-[#FDFBF7] border-b-2 border-black -mx-6 -mt-6 mb-6 flex items-center justify-center p-12 relative overflow-hidden">
               <div className="absolute top-2 left-2 text-[8px] font-mono font-bold opacity-20 uppercase tracking-widest">Icon Preview</div>
               {candidate.renderIcon({ size: 120 })}
            </div>

            {/* 2. Lockup Preview */}
            <div className="mb-8">
               <div className="text-[8px] font-mono font-bold opacity-40 uppercase tracking-widest mb-3">Lockup (EN + ZH Suggestion)</div>
               <motion.div 
                 variants={textVariants}
                 className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200"
               >
                  {candidate.renderIcon({ size: 32 })}
                  <div className="flex flex-col leading-none">
                    <span className="text-lg font-black tracking-tighter" style={{ fontFamily: candidate.font.en }}>
                      AyaFeed
                    </span>
                    <span className="text-[10px] font-bold mt-0.5 opacity-60" style={{ fontFamily: candidate.font.zh }}>
                      文文快讯
                    </span>
                  </div>
               </motion.div>
            </div>

            {/* 3. Scale & B/W Feasibility */}
            <div className="grid grid-cols-3 gap-2 mb-8">
               <div className="flex flex-col items-center">
                  <div className="text-[7px] font-mono font-bold opacity-40 uppercase mb-2">24px</div>
                  <div className="w-8 h-8 flex items-center justify-center bg-slate-50 border border-slate-200">
                    {candidate.renderIcon({ size: 24 })}
                  </div>
               </div>
               <div className="flex flex-col items-center">
                  <div className="text-[7px] font-mono font-bold opacity-40 uppercase mb-2">16px</div>
                  <div className="w-8 h-8 flex items-center justify-center bg-slate-50 border border-slate-200">
                    {candidate.renderIcon({ size: 16 })}
                  </div>
               </div>
               <div className="flex flex-col items-center">
                  <div className="text-[7px] font-mono font-bold opacity-40 uppercase mb-2">B&W</div>
                  <div className="w-8 h-8 flex items-center justify-center bg-black">
                    {candidate.renderIcon({ size: 20, color: 'white' })}
                  </div>
               </div>
            </div>

            {/* 4. Scores */}
            <div className="mb-6 space-y-2">
               <div className="text-[8px] font-mono font-bold opacity-40 uppercase tracking-widest mb-2">Performance Score</div>
               {Object.entries(candidate.scores).map(([key, val]) => (
                 <div key={key} className="flex items-center justify-between">
                    <span className="text-[9px] uppercase opacity-60">{key}</span>
                    <div className="flex gap-0.5">
                       {[...Array(10)].map((_, i) => (
                         <motion.div 
                           key={i} 
                           variants={{
                             hover: { scale: 1.2, backgroundColor: i < val ? '#ef4444' : '#f1f5f9' }
                           }}
                           className={`w-1.5 h-1.5 ${i < val ? 'bg-red-600' : 'bg-slate-100'}`}
                         />
                       ))}
                    </div>
                 </div>
               ))}
            </div>

            {/* 5. Metadata */}
            <div className="flex-1 space-y-4">
               <div>
                  <h3 className="text-lg font-black leading-tight mb-1">{candidate.name}</h3>
                  <p className="text-xs font-serif italic text-slate-600">{candidate.concept}</p>
               </div>
               
               <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Layers size={12} className="mt-0.5 shrink-0 text-slate-400" />
                    <span className="text-[10px] leading-tight"><span className="font-bold">元素：</span>{candidate.elements}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Stamp size={12} className="mt-0.5 shrink-0 text-slate-400" />
                    <span className="text-[10px] leading-tight"><span className="font-bold">字体建议：</span>{candidate.font.en} / {candidate.font.zh}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <div className="text-[9px] font-black uppercase text-red-600 mb-1">Best For</div>
                    <p className="text-[10px] text-slate-500">{candidate.useCase}</p>
                  </div>
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recommendations & Strategy */}
      <div className="bg-[#111827] text-white p-8 md:p-12 border-4 border-black">
         <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-black uppercase tracking-widest mb-12 border-b border-white/20 pb-4 flex items-center gap-4">
               <Star className="text-red-600 fill-red-600" /> Top 3 Recommendations
            </h2>

            <div className="space-y-12">
               {[
                 {
                   id: "01",
                   name: "The Messenger / 极速羽翼",
                   desc: "无可争议的品牌灵魂。它在严肃性与灵动性之间达到了完美的 50/50 平衡。其独特的剪影在 16px 下依然能清晰传达“速度”与“A”的双重含义，是品牌长期资产的首选。",
                   slogan: "The fastest wing, the sharpest truth."
                 },
                 {
                   id: "02",
                   name: "The Nib / 权威笔触",
                   desc: "最能体现“65% 严肃性”的方案。钢笔尖的隐喻赋予了品牌一种不可撼动的公信力。中心红点不仅是笔尖的焦点，也象征着数字时代的信息节点，是传统与现代的绝佳融合。",
                   slogan: "Written in Ink, Stored in Light."
                 },
                 {
                   id: "03",
                   name: "The Column / 报业基石",
                   desc: "极简主义的巅峰。通过最纯粹的几何块面构建 A 字，传达出一种“情报中枢”的稳重感。它在极小尺寸下的表现力甚至超过了 Messenger，非常适合作为系统级 UI 的辅助标识。",
                   slogan: "Solid as Print, Fast as Feed."
                 }
               ].map((rec) => (
                 <motion.div 
                   key={rec.id}
                   initial="initial"
                   whileHover="hover"
                   className="flex flex-col md:flex-row gap-8 items-start group"
                 >
                    <motion.div 
                      variants={{ hover: { scale: 1.1, rotate: -2 } }}
                      className="w-16 h-16 bg-white text-black flex items-center justify-center text-3xl font-black shrink-0"
                    >
                      {rec.id}
                    </motion.div>
                    <div>
                       <h3 className="text-xl font-black mb-2">{rec.name}</h3>
                       <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                          {rec.desc}
                       </p>
                       <motion.div 
                         variants={{ hover: { x: 4 } }}
                         className="inline-block px-4 py-1 bg-red-600 text-xs font-black uppercase tracking-widest"
                       >
                          "{rec.slogan}"
                       </motion.div>
                    </div>
                 </motion.div>
               ))}
            </div>

            <div className="mt-20 pt-12 border-t border-white/10">
               <h3 className="text-lg font-black uppercase tracking-widest mb-8 flex items-center gap-2">
                  <AlertCircle size={20} className="text-red-500" /> 品牌偏好确认 (Pre-Refinement Questions)
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    "是否接受‘The Messenger’作为唯一主标识，而将‘The Column’作为 UI 辅助标识？",
                    "在 Lockup 组合中，中文‘文文快讯’的视觉权重是否需要进一步提升？",
                    "红色的应用比例是否需要根据不同内容分级（如：突发 vs 常规）进行动态调整？",
                    "是否需要为 Top 3 方案开发一套专属的‘报纸纹理’背景应用规范？",
                    "在 16px 极端尺寸下，是否允许舍弃部分细节以换取更高的结构辨识度？"
                  ].map((q, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.08)" }}
                      className="flex gap-4 p-4 bg-white/5 border border-white/10 transition-colors"
                    >
                       <span className="text-red-500 font-mono font-bold">Q{i+1}.</span>
                       <p className="text-sm text-slate-300">{q}</p>
                    </motion.div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AyaLogoCandidates;
