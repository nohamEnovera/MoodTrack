import React from 'react';
import { useIntl } from 'react-intl';
import { Moon, Sun, Star, Stars, CloudMoon } from 'lucide-react';

interface SleepCardProps {
  sleep: {
    average: string;
    bedtime: string;
    waketime: string;
    quality: string;
  };
  onChange: (field: string, value: string) => void;
}

const qualityOptions = [
  {
    value: 'excellent',
    icon: Stars,
    labelKey: 'profile.sleep.quality.excellent',
    gradient: 'from-violet-500 to-purple-500'
  },
  {
    value: 'good',
    icon: Star,
    labelKey: 'profile.sleep.quality.good',
    gradient: 'from-blue-500 to-indigo-500'
  },
  {
    value: 'fair',
    icon: CloudMoon,
    labelKey: 'profile.sleep.quality.fair',
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    value: 'poor',
    icon: Moon,
    labelKey: 'profile.sleep.quality.poor',
    gradient: 'from-red-500 to-pink-500'
  }
];

export function SleepCard({ sleep, onChange }: SleepCardProps) {
  const intl = useIntl();

  const getTimeDisplay = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString(intl.locale, { 
      hour: 'numeric', 
      minute: 'numeric',
      hour12: true 
    });
  };

  return (
    <div className="card p-6 lg:p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg">
          <Moon className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
          {intl.formatMessage({ id: 'profile.sleep.title' })}
        </h3>
      </div>

      <div className="space-y-8">
        {/* Durée moyenne de sommeil */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            {intl.formatMessage({ id: 'profile.sleep.average' })}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Moon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              value={sleep.average}
              onChange={(e) => onChange('average', e.target.value)}
              className="input-field pl-10"
              placeholder={intl.formatMessage({ id: 'profile.sleep.average.placeholder' })}
              min="0"
              max="24"
              step="0.5"
            />
          </div>
        </div>

        {/* Qualité du sommeil */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            {intl.formatMessage({ id: 'profile.sleep.quality' })}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {qualityOptions.map(({ value, icon: Icon, labelKey, gradient }) => (
              <button
                key={value}
                onClick={() => onChange('quality', value)}
                className={`relative group flex flex-col items-center p-4 rounded-xl transition-all duration-300 ${
                  sleep.quality === value
                    ? `bg-gradient-to-r ${gradient} text-white ring-2 ring-offset-2 ring-${gradient.split('-')[1]}`
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Icon className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium text-center">
                  {intl.formatMessage({ id: labelKey })}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Heures de coucher et de réveil */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              {intl.formatMessage({ id: 'profile.sleep.bedtime' })}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Moon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="time"
                value={sleep.bedtime}
                onChange={(e) => onChange('bedtime', e.target.value)}
                className="input-field pl-10"
              />
              {sleep.bedtime && (
                <div className="mt-2 text-sm text-gray-500">
                  {getTimeDisplay(sleep.bedtime)}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              {intl.formatMessage({ id: 'profile.sleep.waketime' })}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Sun className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="time"
                value={sleep.waketime}
                onChange={(e) => onChange('waketime', e.target.value)}
                className="input-field pl-10"
              />
              {sleep.waketime && (
                <div className="mt-2 text-sm text-gray-500">
                  {getTimeDisplay(sleep.waketime)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}