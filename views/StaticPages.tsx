import React from 'react';
import { FileText, MessageSquare, ArrowLeft } from 'lucide-react';
import { Link } from '@tanstack/react-router';

type PlaceholderPageProps = {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  hint: string;
};

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ icon: Icon, title, description, hint }) => {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-10 min-h-[70dvh]">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-700 hover:text-red-600 mb-8"
      >
        <ArrowLeft size={14} />
        返回首页
      </Link>

      <section className="border-4 border-black bg-white newspaper-shadow p-6 sm:p-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-xs font-black uppercase tracking-widest mb-4">
          <Icon size={14} />
          站点公告
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-header text-slate-900 mb-4">{title}</h1>
        <p className="text-base text-slate-700 leading-relaxed font-serif mb-6">{description}</p>
        <div className="border-t-2 border-dashed border-slate-300 pt-4 text-xs text-slate-500 font-bold">
          {hint}
        </div>
      </section>
    </div>
  );
};

export const PrivacyPlaceholder: React.FC = () => (
  <PlaceholderPage
    icon={FileText}
    title="隐私政策"
    description="隐私政策页面正在整理中。我们会在正式上线前补充完整的数据收集、使用与保护说明。"
    hint="预计后续版本补充完整条款。"
  />
);

export const FeedbackPlaceholder: React.FC = () => (
  <PlaceholderPage
    icon={MessageSquare}
    title="问题反馈"
    description="反馈系统正在搭建中。你可以先通过邮件联系团队：contact@ayafeed.com。"
    hint="反馈表单上线后，此页面将升级为可提交的工单入口。"
  />
);
