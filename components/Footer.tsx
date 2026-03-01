
import React from 'react';
import { Github, Twitter, Mail } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Theme, ViewState } from '../types';
import BrandLogo from './BrandLogo';

interface FooterProps {
}

const Footer: React.FC<FooterProps> = () => {
  const navigate = useNavigate();

  // Styles - Newspaper mode is now the only mode
  const footerBg = 'bg-[#FDFBF7]';
  const textColor = 'text-slate-900';
  const headerColor = 'text-black font-header';
  const hoverColor = 'hover:text-red-700 hover:underline';

  return (
    <footer className={`${footerBg} pt-8 pb-8 transition-colors duration-300 relative z-10`}>
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Newspaper Decorative Line */}
        <div className="flex items-center gap-4 mb-16 opacity-40">
            <div className="h-[2px] bg-black flex-1"></div>
            <div className="font-mono text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap">
               Archive Boundary / 完
            </div>
            <div className="h-[2px] bg-black flex-1"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={() => navigate({ to: '/' })}>
                <BrandLogo size="md" />
                <span className={`font-black text-xl font-header tracking-tighter ${headerColor}`}>
                  文文。快讯
                </span>
            </div>
            <p className={`text-sm mb-4 leading-relaxed font-serif ${textColor}`}>
              为您带来幻想乡到外界的最快独家新闻。天狗信赖，人类喜爱。
            </p>
          </div>

          {/* Links Column */}
          <div>
            <h4 className={`font-bold mb-4 uppercase tracking-wider text-xs ${headerColor}`}>信息中心</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className={`${textColor} ${hoverColor}`}>关于我们</Link></li>
              <li><Link to="/showcase" className={`${textColor} ${hoverColor}`}>UI 组件库</Link></li>
              <li><Link to="/privacy" className={`${textColor} ${hoverColor}`}>隐私政策</Link></li>
              <li><Link to="/feedback" className={`${textColor} ${hoverColor}`}>问题反馈</Link></li>
            </ul>
          </div>

           {/* Socials */}
           <div>
            <h4 className={`font-bold mb-4 uppercase tracking-wider text-xs ${headerColor}`}>关注我们</h4>
            <div className="flex gap-4">
               <a href="https://twitter.com/ayafeed" target="_blank" rel="noreferrer" className="p-2 transition-colors border-2 border-black text-black hover:bg-black hover:text-white" aria-label="Twitter">
                  <Twitter size={18} />
               </a>
               <a href="https://github.com/ayafeed" target="_blank" rel="noreferrer" className="p-2 transition-colors border-2 border-black text-black hover:bg-black hover:text-white" aria-label="GitHub">
                  <Github size={18} />
               </a>
               <a href="mailto:contact@ayafeed.com" className="p-2 transition-colors border-2 border-black text-black hover:bg-black hover:text-white" aria-label="Email">
                  <Mail size={18} />
               </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center text-xs border-slate-200 border-dashed font-mono">
           <div className={textColor}>
              &copy; {new Date().getFullYear()} AyaFeed Project. 幻想乡印刷
           </div>
           <div className={`mt-4 md:mt-0 flex gap-6 ${textColor}`}>
               <span>第13042期</span>
               <span>文文。快讯 | 文々。速報</span>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
