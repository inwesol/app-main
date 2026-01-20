'use client';

import { Card, CardContent } from '@/components/ui/card';
import { FileDown, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import type { ReactNode } from 'react';

interface GradientCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  imageUrl?: string;
  pdfUrl?: string;
  internalUrl?: string;
  externalUrl?: string;
  downloadFileName?: string;
  gradientColors?: {
    from: string;
    via?: string;
    to: string;
  };
  className?: string;
}

export default function GradientCard({
  icon,
  title,
  description,
  imageUrl,
  pdfUrl,
  internalUrl,
  externalUrl,
  downloadFileName,
  gradientColors = {
    from: 'from-pink-500',
    via: 'via-purple-500',
    to: 'to-primary-blue-600',
  },
  className = '',
}: GradientCardProps) {
  const handleClick = () => {
    if (internalUrl) {
      window.location.href = internalUrl;
    } else if (externalUrl) {
      window.open(externalUrl, '_blank', 'noopener,noreferrer');
    } else if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download =
        downloadFileName ||
        `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const gradientClass = `bg-gradient-to-br ${gradientColors.from} ${gradientColors.via || ''} ${gradientColors.to}`;

  return (
    <Card
      className={`group hover:shadow-2xl transition-all duration-500 border-0 shadow-2xl hover:-translate-y-3 ${gradientClass} rounded-xl cursor-pointer overflow-hidden relative ${className}`}
      onClick={handleClick}
    >
      <CardContent className="p-0 relative z-10">
        {/* Overlay with same gradient but with opacity for better text readability */}
        <div className={`absolute inset-0 ${gradientClass} opacity-90`} />
        <div className="grid md:grid-cols-2 gap-0 relative z-10">
          {/* Left side - Content */}
          <div className="p-4 sm:p-6 sm:py-8 flex flex-col justify-center">
            <div className="size-12 sm:size-16 mb-3 sm:mb-4 rounded-lg sm:rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
            <h3 className="text-xl sm:text-2xl mb-2 sm:mb-3 text-white font-bold transition-colors">
              {title}
            </h3>
            <p className="text-sm sm:text-base text-white/90 sm:leading-relaxed mb-3 sm:mb-4">
              {description}
            </p>
            <div className="mt-auto flex items-center text-white font-semibold transition-colors">
              {externalUrl || internalUrl ? (
                <ExternalLink className="size-3 sm:size-4 mr-2" />
              ) : (
                <FileDown className="size-3 sm:size-4 mr-2" />
              )}
              <span className="text-sm sm:text-base">
                Click to {externalUrl ? 'learn more' : internalUrl ? 'explore' : 'download PDF'}
              </span>
            </div>
          </div>
          {/* Right side - Image */}
          {imageUrl && (
            <div className="relative h-full min-h-[200px] sm:min-h-[300px] md:min-h-0 md:h-auto overflow-hidden">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
