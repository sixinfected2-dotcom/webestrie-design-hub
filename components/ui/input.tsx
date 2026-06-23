import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-2)] px-3 text-sm text-[var(--ink)] placeholder:text-[var(--terracotta)] transition-all focus:outline-none focus:border-[var(--amber)] focus:ring-2 focus:ring-[rgba(201,122,16,0.12)]',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';