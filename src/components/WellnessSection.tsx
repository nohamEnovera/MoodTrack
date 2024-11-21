import React, { useState } from 'react';
import { Flame, Wind, Brain, Sparkles } from 'lucide-react';
import { BreathingExercise } from './wellness/BreathingExercise';
import { Meditation } from './wellness/Meditation';
import { ActivitySuggestions } from './wellness/ActivitySuggestions';
import { useIntl } from 'react-intl';

type WellnessTab = 'breathing' | 'meditation' | 'activities';

export function WellnessSection() {
  const [activeTab, setActiveTab] = useState<WellnessTab>('breathing');
  const intl = useIntl();

  const tabs = [
    {
      id: 'breathing' as WellnessTab,
      icon: Wind,
      label: 'wellness.breathing.title'
    },
    {
      id: 'meditation' as WellnessTab,
      icon: Brain,
      label: 'wellness.meditation.title'
    },
    {
      id: 'activities' as WellnessTab,
      icon: Sparkles,
      label: 'wellness.activities.title'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg">
          <Flame className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
          {intl.formatMessage({ id: 'wellness.title' })}
        </h2>
      </div>

      <div className="flex space-x-2 bg-gray-100/50 p-1 rounded-lg">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex flex-col items-center py-3 px-3 rounded-lg transition-all duration-300 ${
              activeTab === id
                ? 'bg-white shadow-md text-violet-600'
                : 'text-gray-600 hover:text-violet-600 hover:bg-white/50'
            }`}
          >
            <Icon className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">
              {intl.formatMessage({ id: label })}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        {activeTab === 'breathing' && <BreathingExercise />}
        {activeTab === 'meditation' && <Meditation />}
        {activeTab === 'activities' && <ActivitySuggestions />}
      </div>
    </div>
  );
}