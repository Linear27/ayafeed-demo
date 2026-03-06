import BrandLogo from './BrandLogo';

type BrandLockupProps = {
  compact?: boolean;
};

const BrandLockup = ({ compact = false }: BrandLockupProps) => (
  <div className={`flex items-center ${compact ? 'gap-2.5' : 'gap-3.5'}`}>
    <BrandLogo size={compact ? 'sm' : 'lg'} />
    <div className="min-w-0">
      <div
        className={`${compact ? 'text-lg md:text-xl' : 'text-[1.9rem] md:text-[2.45rem]'} font-brand font-black leading-none tracking-tight text-[var(--paper-text)]`}
      >
        文文。速报
      </div>
      <div
        className={`${compact ? 'mt-0.5 text-[10px]' : 'mt-1.5 text-[11px] md:text-xs'} font-bold uppercase tracking-[0.18em] text-[var(--paper-text-muted)]`}
      >
        幻想乡活动情报总览
      </div>
    </div>
  </div>
);

export default BrandLockup;
