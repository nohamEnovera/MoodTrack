import React from 'react';
import { Heart, Sun, Smile, Cloud, CloudRain } from 'lucide-react';
import { useIntl } from 'react-intl';

const moods = [
  { 
    icon: Heart,
    label: 'mood.amazing',
    color: 'bg-gradient-to-br from-pink-500 to-rose-500 text-white',
    description: 'mood.description.amazing'
  },
  { 
    icon: Sun,
    label: 'mood.good',
    color: 'bg-gradient-to-br from-amber-400 to-orange-400 text-white',
    description: 'mood.description.good'
  },
  { 
    icon: Smile,
    label: 'mood.okay',
    color: 'bg-gradient-to-br from-emerald-400 to-teal-400 text-white',
    description: 'mood.description.okay'
  },
  { 
    icon: Cloud,
    label: 'mood.meh',
    color: 'bg-gradient-to-br from-blue-400 to-cyan-400 text-white',
    description: 'mood.description.meh'
  },
  { 
    icon: CloudRain,
    label: 'mood.bad',
    color: 'bg-gradient-to-br from-violet-500 to-purple-500 text-white',
    description: 'mood.description.bad'
  },
];

interface MoodSelectorProps {
  onMoodSelect: (mood: string) => void;
  selectedMood: string | null;
}

export function MoodSelector({ onMoodSelect, selectedMood }: MoodSelectorProps) {
  const intl = useIntl();

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="text-center">
        <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
          {intl.formatMessage({ id: 'mood.question' })}
        </h2>
        <p className="text-sm lg:text-base text-gray-500 mt-2">
          {intl.formatMessage({ id: 'mood.subtitle' })}
        </p>
      </div>

      <div className="flex justify-center gap-2 lg:gap-4">
        {moods.map(({ icon: Icon, label, color, description }) => {
          const translatedLabel = intl.formatMessage({ id: label });
          return (
            <button
              key={label}
              onClick={() => onMoodSelect(translatedLabel)}
              className={`mood-button ${color} ${
                selectedMood === translatedLabel ? 'selected' : ''
              } w-14 h-14 lg:w-16 lg:h-16 flex items-center justify-center`}
            >
              <Icon className="w-6 h-6 lg:w-8 lg:h-8" />
            </button>
          );
        })}
      </div>

      {selectedMood && (
        <div className="text-center text-gray-600">
          <p className="text-sm lg:text-base">
            {intl.formatMessage({ 
              id: moods.find(m => intl.formatMessage({ id: m.label }) === selectedMood)?.description || ''
            })}
          </p>
        </div>
      )}
    </div>
  );
}