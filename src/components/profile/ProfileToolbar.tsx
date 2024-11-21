import React from 'react';
import { useIntl } from 'react-intl';
import { UserCircle, BookOpen, Utensils, Dumbbell, Moon } from 'lucide-react';

interface ProfileToolbarProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export function ProfileToolbar({ currentSection, onSectionChange }: ProfileToolbarProps) {
  const intl = useIntl();

  const toolbarItems = [
    {
      id: 'toolbar.personal',
      icon: UserCircle,
      label: intl.formatMessage({ id: 'profile.personal.title' })
    },
    {
      id: 'toolbar.bio',
      icon: BookOpen,
      label: intl.formatMessage({ id: 'profile.bio.title' })
    },
    {
      id: 'toolbar.diet',
      icon: Utensils,
      label: intl.formatMessage({ id: 'profile.diet.title' })
    },
    {
      id: 'toolbar.fitness',
      icon: Dumbbell,
      label: intl.formatMessage({ id: 'profile.fitness.title' })
    },
    {
      id: 'toolbar.sleep',
      icon: Moon,
      label: intl.formatMessage({ id: 'profile.sleep.title' })
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 pb-safe lg:hidden">
      <div className="flex justify-between items-center px-2">
        {toolbarItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onSectionChange(id)}
            className={`flex flex-col items-center py-2 px-2 transition-all duration-300 ${
              currentSection === id
                ? 'text-violet-600 scale-105'
                : 'text-gray-500 hover:text-violet-600'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}