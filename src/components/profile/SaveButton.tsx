import React from 'react';
import { useIntl } from 'react-intl';
import { Save } from 'lucide-react';

interface SaveButtonProps {
  isSaving: boolean;
  saveStatus: 'success' | 'error' | null;
  onSave: () => void;
}

export function SaveButton({ isSaving, saveStatus, onSave }: SaveButtonProps) {
  const intl = useIntl();

  return (
    <div className="fixed bottom-24 right-6 z-50">
      {/* Status messages */}
      <div className="absolute bottom-full right-0 mb-2 whitespace-nowrap">
        {saveStatus === 'success' && (
          <p className="text-sm bg-emerald-500 text-white px-3 py-1 rounded-full shadow-lg animate-fade-in">
            {intl.formatMessage({ id: 'profile.save.success' })}
          </p>
        )}
        {saveStatus === 'error' && (
          <p className="text-sm bg-red-500 text-white px-3 py-1 rounded-full shadow-lg animate-fade-in">
            {intl.formatMessage({ id: 'profile.save.error' })}
          </p>
        )}
      </div>

      {/* Floating action button */}
      <button
        onClick={onSave}
        disabled={isSaving}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0"
        title={intl.formatMessage({ 
          id: isSaving ? 'profile.saving' : 'profile.save'
        })}
      >
        <Save className={`w-6 h-6 ${isSaving ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
}