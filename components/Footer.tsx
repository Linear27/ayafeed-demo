import React from 'react';
import { Github, Twitter, Mail } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import BrandLogo from './BrandLogo';

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7]';

const Footer: React.FC = () => {
  const footerBg = 'bg-[#FDFBF7]';
  const textColor = 'text-slate-900';
  const headerColor = 'text-black font-header';
  const hoverColor = 'hover:text-red-700 hover:underline';

  return (
    <footer className={`${footerBg} relative z-10 pb-8 pt-8 transition-colors duration-300`}>
      <div className="mx-auto max-w-300 px-4">
        <div className="mb-16 flex items-center gap-4 opacity-40" aria-hidden="true">
          <div className="h-0.5 flex-1 bg-black"></div>
          <div className="whitespace-nowrap font-mono text-xs font-black uppercase tracking-[0.24em]">Archive Boundary / 完</div>
          <div className="h-0.5 flex-1 bg-black"></div>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <Link to="/" className={`mb-4 flex items-center gap-3 ${FOCUS_RING}`} aria-label="返回首页">
              <BrandLogo size="md" />
              <span className={`font-brand text-xl font-black tracking-tight ${headerColor}`}>文文。速报</span>
            </Link>
            <p className={`mb-4 text-sm leading-relaxed ${textColor}`}>
              为您带来幻想乡到外界的最快独家新闻。天狗信赖，人类喜爱。
            </p>
          </div>

          <div>
            <h4 className={`mb-4 text-xs font-bold uppercase tracking-wider ${headerColor}`}>信息中心</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className={`${textColor} ${hoverColor} ${FOCUS_RING}`}>
                  关于我们
                </Link>
              </li>
              <li>
                <Link to="/showcase" className={`${textColor} ${hoverColor} ${FOCUS_RING}`}>
                  组件展示
                </Link>
              </li>
              <li>
                <Link to="/privacy" className={`${textColor} ${hoverColor} ${FOCUS_RING}`}>
                  隐私政策
                </Link>
              </li>
              <li>
                <Link to="/feedback" className={`${textColor} ${hoverColor} ${FOCUS_RING}`}>
                  问题反馈
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className={`mb-4 text-xs font-bold uppercase tracking-wider ${headerColor}`}>关注我们</h4>
            <div className="flex gap-4">
              <a
                href="https://twitter.com/ayafeed"
                target="_blank"
                rel="noreferrer"
                className={`border-2 border-black p-2 text-black transition-colors duration-200 hover:bg-black hover:text-white ${FOCUS_RING}`}
                aria-label="Twitter"
              >
                <Twitter aria-hidden="true" size={18} />
              </a>
              <a
                href="https://github.com/ayafeed"
                target="_blank"
                rel="noreferrer"
                className={`border-2 border-black p-2 text-black transition-colors duration-200 hover:bg-black hover:text-white ${FOCUS_RING}`}
                aria-label="GitHub"
              >
                <Github aria-hidden="true" size={18} />
              </a>
              <a
                href="mailto:contact@ayafeed.com"
                className={`border-2 border-black p-2 text-black transition-colors duration-200 hover:bg-black hover:text-white ${FOCUS_RING}`}
                aria-label="Email"
              >
                <Mail aria-hidden="true" size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between border-t border-dashed border-slate-200 pt-8 font-mono text-xs md:flex-row">
          <div className={textColor}>&copy; {new Date().getFullYear()} AyaFeed Project. 幻想乡印刷</div>
          <div className={`mt-4 flex gap-6 md:mt-0 ${textColor}`}>
            <span>第13042期</span>
            <span>文文。速报 | 文々。速報</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
