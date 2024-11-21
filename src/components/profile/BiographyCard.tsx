import React from 'react';
import { useIntl } from 'react-intl';
import { BookOpen } from 'lucide-react';

interface BiographyCardProps {
  bio: string;
  onChange: (value: string) => void;
}

export function BiographyCard({ bio, onChange }: BiographyCardProps) {
  const intl = useIntl();

  return (
    <div className="card p-6 lg:p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg">
          <BookOpen className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
          {intl.formatMessage({ id: 'profile.bio.title' })}
        </h3>
      </div>
      <textarea
        value={bio}
        onChange={(e) => onChange(e.target.value)}
        className="input-field h-32 resize-none"
        placeholder={intl.formatMessage({ id: 'profile.bio.placeholder' })}
      />
    </div>
  );
}