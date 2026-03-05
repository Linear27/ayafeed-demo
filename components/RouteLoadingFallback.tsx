import React from 'react';

const RouteLoadingFallback: React.FC = () => (
  <div className="min-h-[52dvh] w-full px-4 py-16">
    <div className="mx-auto max-w-300 border-2 border-[var(--paper-border)] bg-[var(--paper-surface)] p-6 text-center text-sm font-bold text-[var(--paper-text-muted)]">
      正在加载页面内容...
    </div>
  </div>
);

export default RouteLoadingFallback;
