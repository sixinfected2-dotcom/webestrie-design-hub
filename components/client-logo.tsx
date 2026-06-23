'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ClientLogoProps {
  src: string;
  alt: string;
  className?: string;
}

export function ClientLogo({ src, alt, className }: ClientLogoProps) {
  const [error, setError] = useState(false);
  if (error) return null;
  return (
    <img
      src={src}
      alt={alt}
      className={cn('h-full w-full object-contain', className)}
      onError={() => setError(true)}
    />
  );
}