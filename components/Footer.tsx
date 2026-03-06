import React from 'react';
import { Github, Mail, Twitter } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import BrandLockup from './BrandLockup';

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7]';

const Footer: React.FC = () => {
  const itemClassName = `text-sm text-[var(--paper-muted)] transition-colors hover:text-[var(--paper-accent)] ${FOCUS_RING}`;

  return (
    <footer className="relative z-10 border-t-2 border-[var(--paper-border)] bg-[#FDFBF7] pb-8 pt-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.18em] text-[var(--paper-text-muted)] opacity-80">
          <div className="h-px flex-1 bg-[var(--paper-border)]/20"></div>
          <div>Archive Boundary / Footer Desk</div>
          <div className="h-px flex-1 bg-[var(--paper-border)]/20"></div>
        </div>

        <div className="grid gap-8 border-b border-dashed border-[var(--paper-border)]/20 pb-8 lg:grid-cols-[minmax(0,1.2fr)_repeat(4,minmax(0,1fr))]">
          <div id="footer-about" className="space-y-4">
            <Link to="/" className={`inline-flex ${FOCUS_RING}`}>
              <BrandLockup compact />
            </Link>
            <p className="max-w-sm text-sm leading-7 text-[var(--paper-muted)]">
              AyaFeed 聚焦东方同人展、演出与社团公开情报，用首页快速入口把近期重点信息更清楚地呈现出来。
            </p>
            <div className="text-xs font-bold text-[var(--paper-text-muted)]">最近更新时间：以站内公开数据同步为准</div>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-[var(--paper-text)]">浏览</h4>
            <div className="space-y-2">
              <Link to="/events" className={itemClassName}>展会</Link>
              <Link to="/lives" className={itemClassName}>演出</Link>
              <Link to="/circles" className={itemClassName}>社团</Link>
              <Link to="/events/exp" className={itemClassName}>归档</Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-[var(--paper-text)]">参与</h4>
            <div className="space-y-2">
              <Link to="/feedback" className={itemClassName}>提交活动</Link>
              <Link to="/circles" className={itemClassName}>社团入驻</Link>
              <Link to="/feedback" className={itemClassName}>问题反馈</Link>
            </div>
          </div>

          <div id="footer-trust">
            <h4 className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-[var(--paper-text)]">说明与信任</h4>
            <div className="space-y-2">
              <a href="/#footer-trust" className={itemClassName}>收录说明</a>
              <a href="/#footer-sources" className={itemClassName}>数据来源</a>
              <Link to="/privacy" className={itemClassName}>隐私政策</Link>
              <a href="/#footer-about" className={itemClassName}>关于 AyaFeed</a>
            </div>
          </div>

          <div id="footer-sources">
            <h4 className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-[var(--paper-text)]">联系</h4>
            <div className="space-y-3 text-sm text-[var(--paper-muted)]">
              <a href="mailto:contact@ayafeed.com" className={`inline-flex items-center gap-2 ${itemClassName}`}>
                <Mail size={16} aria-hidden="true" />
                contact@ayafeed.com
              </a>
              <a href="https://twitter.com/ayafeed" target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 ${itemClassName}`}>
                <Twitter size={16} aria-hidden="true" />
                X / Twitter
              </a>
              <a href="https://github.com/ayafeed" target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 ${itemClassName}`}>
                <Github size={16} aria-hidden="true" />
                GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-xs font-mono text-[var(--paper-text-muted)] md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} AyaFeed Project · theme-newspaper</div>
          <div className="flex flex-wrap gap-4">
            <span>首页焦点优先</span>
            <span>公开来源整理</span>
            <span>幻想乡活动情报总览</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
