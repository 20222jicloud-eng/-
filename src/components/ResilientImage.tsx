import { useState } from 'react';
import { FlaskConical } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  fallbackTitle: string;
  className?: string;
}

export function ResilientImage({
  src,
  alt,
  fallbackTitle,
  className = '',
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-slate-100 text-slate-600 p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <FlaskConical className="w-8 h-8 text-sky-600 mb-2" aria-hidden="true" />
        <p className="text-sm font-medium text-slate-700">{fallbackTitle}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
