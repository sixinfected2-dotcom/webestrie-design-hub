import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'live' | 'progress' | 'archive' | 'rejected' | 'done' | 'pending';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-[rgba(201,122,16,0.10)] text-[var(--amber)]',
  live: 'bg-[rgba(94,158,64,0.18)] text-[var(--green-mid)]',
  progress: 'bg-[rgba(201,122,16,0.20)] text-[var(--amber)] animate-pulse',
  archive: 'bg-[rgba(122,79,45,0.10)] text-[var(--terracotta)]',
  rejected: 'bg-[rgba(180,60,60,0.15)] text-[#b43c3c]',
  done: 'bg-[rgba(94,158,64,0.15)] text-[var(--green-mid)]',
  pending: 'bg-[var(--bg-3)] text-[var(--terracotta)]',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
);
Badge.displayName = 'Badge';