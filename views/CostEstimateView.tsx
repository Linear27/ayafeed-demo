
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, Calculator, TrendingUp, Cpu, DollarSign, Zap, HelpCircle, 
  ArrowRight, ShieldCheck, CreditCard, BarChart3
} from 'lucide-react';
import { Theme, ViewState } from '../types';

const CostEstimateView: React.FC<{ theme: Theme, onNavigate: (v: ViewState) => void }> = ({ theme, onNavigate }) => {
  const isNewspaper = theme === 'newspaper';

  const [dau, setDau] = useState(1000);
  const [participationRate, setParticipationRate] = useState(20);
  const [queriesPerUser, setQueriesPerUser] = useState(4);
  const [inputTokens, setInputTokens] = useState(1500);
  const [outputTokens, setOutputTokens] = useState(200);

  const INPUT_PRICE_PER_1M = 0.075;
  const OUTPUT_PRICE_PER_1M = 0.30;
  const USD_TO_CNY = 7.25;

  const calculations = useMemo(() => {
    const activeChatUsers = (dau * participationRate) / 100;
    const dailyQueries = activeChatUsers * queriesPerUser;
    const dailyInputTokens = dailyQueries * inputTokens;
    const dailyOutputTokens = dailyQueries * outputTokens;
    const dailyInputCost = (dailyInputTokens / 1000000) * INPUT_PRICE_PER_1M;
    const dailyOutputCost = (dailyOutputTokens / 1000000) * OUTPUT_PRICE_PER_1M;
    const totalDailyCostUSD = dailyInputCost + dailyOutputCost;
    const totalMonthlyCostUSD = totalDailyCostUSD * 30;
    
    return {
      dailyQueries,
      totalDailyCostUSD,
      totalMonthlyCostUSD,
      totalMonthlyCostCNY: totalMonthlyCostUSD * USD_TO_CNY,
      dailyInputTokens,
      dailyOutputTokens,
      percentOfFreeTier: Math.min((dailyQueries / 20000) * 100, 100)
    };
  }, [dau, participationRate, queriesPerUser, inputTokens, outputTokens]);

  const SliderField = ({ label, value, min, max, onChange, unit = "" }: any) => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-3">
        <label className={`text-xs font-black uppercase tracking-[0.2em] ${isNewspaper ? 'text-slate-500' : 'text-slate-500'}`}>
          {label}
        </label>
        <span className={`font-mono font-black text-lg ${isNewspaper ? 'text-red-600' : 'text-indigo-600'}`}>
          {value.toLocaleString()}{unit}
        </span>
      </div>
      <input 
        type="range" min={min} max={max} value={value} 
        onChange={(e) => onChange(parseInt(e.target.value))}
        className={`w-full h-1.5 rounded-full appearance-none cursor-pointer ${isNewspaper ? 'bg-slate-200 accent-black' : 'bg-slate-200 accent-indigo-600'}`}
      />
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className={`min-h-screen pb-20 pt-8 ${isNewspaper ? 'bg-[#FDFBF7]' : 'bg-slate-50'}`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <button 
          onClick={() => onNavigate('LANDING')} 
          className={`flex items-center mb-10 text-xs font-black uppercase tracking-widest transition-colors ${
            isNewspaper ? 'text-black hover:text-red-600 font-mono' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <ChevronLeft size={16} className="mr-1" /> 返回首页
        </button>

        <div className="mb-12">
            <h1 className={`text-4xl sm:text-6xl font-black mb-4 ${isNewspaper ? 'font-header border-b-4 border-black pb-2' : 'text-slate-900'}`}>
                成本核算报告
            </h1>
            <p className={`text-lg max-w-2xl ${isNewspaper ? 'font-serif italic' : 'text-slate-500'}`}>
                模拟在不同流量规模下使用 Gemini 3 系列模型的运营支出。
            </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className={`lg:col-span-7 ${isNewspaper ? 'bg-white border-2 border-black p-6 sm:p-10' : 'bg-white rounded-3xl shadow-sm border border-slate-200 p-8'}`}>
                <div className="flex items-center gap-2 mb-8">
                    <TrendingUp size={20} className="text-red-600"/>
                    <h3 className="text-xl font-black font-header uppercase tracking-wider">流量与交互配置</h3>
                </div>

                <SliderField label="日活跃用户 (DAU)" min={100} max={100000} value={dau} onChange={setDau} />
                <SliderField label="聊天参与率" min={1} max={100} value={participationRate} onChange={setParticipationRate} unit="%" />
                <SliderField label="人均对话轮数" min={1} max={50} value={queriesPerUser} onChange={setQueriesPerUser} />
                
                <div className="pt-10 border-t-2 border-dashed border-slate-200 mt-10">
                    <div className="flex items-center gap-2 mb-8">
                        <BarChart3 size={20} className="text-red-600"/>
                        <h3 className="text-xl font-black font-header uppercase tracking-wider">Token 规模预估</h3>
                    </div>
                    <SliderField label="单次输入 (Input Tokens)" min={100} max={20000} value={inputTokens} onChange={setInputTokens} />
                    <SliderField label="单次输出 (Output Tokens)" min={50} max={5000} value={outputTokens} onChange={setOutputTokens} />
                </div>
            </div>

            <div className="lg:col-span-5 space-y-6 sticky top-24">
                <div className={`${isNewspaper ? 'bg-black text-white p-8 border-4 border-double border-white/20' : 'bg-slate-900 text-white rounded-3xl shadow-2xl p-8'}`}>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 opacity-60">ESTIMATED MONTHLY COST</h4>
                    
                    <div className="mb-10">
                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl font-black font-header tracking-tighter">
                                ¥{calculations.totalMonthlyCostCNY.toFixed(2)}
                            </span>
                        </div>
                        <div className="text-xl font-mono opacity-50 mt-1">
                            ≈ ${calculations.totalMonthlyCostUSD.toFixed(2)} USD
                        </div>
                    </div>

                    <div className="space-y-6 pt-8 border-t border-white/10">
                        <div>
                            <div className="flex justify-between text-xs font-bold uppercase mb-2 opacity-60">
                                <span>免费额度占用 (API Studio)</span>
                                <span>{calculations.percentOfFreeTier.toFixed(1)}%</span>
                            </div>
                            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                                <motion.div 
                                    className={`h-full ${calculations.percentOfFreeTier > 90 ? 'bg-red-500' : 'bg-green-500'}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${calculations.percentOfFreeTier}%` }}
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 border border-white/10 bg-white/5">
                                <div className="text-[9px] uppercase opacity-50 mb-1">日均请求</div>
                                <div className="text-lg font-black">{calculations.dailyQueries.toLocaleString()}</div>
                            </div>
                            <div className="p-4 border border-white/10 bg-white/5">
                                <div className="text-[9px] uppercase opacity-50 mb-1">单次费用</div>
                                <div className="text-lg font-black">¥{((calculations.totalDailyCostUSD * USD_TO_CNY) / calculations.dailyQueries).toFixed(4)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`${isNewspaper ? 'bg-white border-2 border-black p-6' : 'bg-white rounded-2xl p-6 border border-slate-200'}`}>
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-green-100 text-green-700 rounded-lg"><ShieldCheck size={20}/></div>
                        <div>
                            <h5 className="font-black text-sm uppercase mb-1">预算建议</h5>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                {calculations.percentOfFreeTier < 80 
                                    ? "当前规模完全在 Google AI Studio 的免费层级内，您可以 0 成本运行此项目。" 
                                    : "流量已接近免费额度上限，建议考虑优化 Prompt 长度或启用缓存机制。"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CostEstimateView;
