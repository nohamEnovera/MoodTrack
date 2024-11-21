import React from 'react';
import { Video } from 'lucide-react';
import { useIntl } from 'react-intl';

interface VideoGenerationLoaderProps {
  isOpen: boolean;
}

export function VideoGenerationLoader({ isOpen }: VideoGenerationLoaderProps) {
  const intl = useIntl();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl flex flex-col items-center justify-center space-y-12 bg-white/95 backdrop-blur-sm rounded-3xl p-12 shadow-2xl">
          {/* Animated video icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-violet-200 rounded-full animate-ping opacity-20"></div>
            <div className="relative bg-gradient-to-r from-violet-500 to-purple-500 p-8 rounded-full">
              <Video className="w-16 h-16 text-white animate-pulse" />
            </div>
          </div>

          {/* Progress animation */}
          <div className="w-full h-3 bg-gray-100/50 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 animate-progress"></div>
          </div>

          {/* Message */}
          <div className="text-center space-y-6 w-full">
            <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              {intl.formatMessage({ id: 'share.generating.video' })}
            </h3>
            <p className="text-xl md:text-2xl text-gray-600 whitespace-pre-line leading-relaxed max-w-2xl mx-auto">
              {intl.formatMessage({ id: 'share.generating.video.description' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}