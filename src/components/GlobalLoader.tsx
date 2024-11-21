import React from 'react';
import { useIntl } from 'react-intl';

interface GlobalLoaderProps {
  message?: string;
}

export function GlobalLoader({ message }: GlobalLoaderProps) {
  const intl = useIntl();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 shadow-xl max-w-2xl w-full text-center space-y-6">
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 border-4 border-violet-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="flex items-center justify-center min-h-[4rem]">
          <p className="text-gray-600 font-medium text-lg sm:text-xl md:text-2xl whitespace-pre-line leading-relaxed px-4 sm:px-8">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}