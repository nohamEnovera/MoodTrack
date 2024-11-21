import React from 'react';
import { Home, BookOpen, BarChart2, Heart } from 'lucide-react';
import { useIntl } from 'react-intl';

interface MobileNavBarProps {
  currentPage: 'home' | 'journal' | 'stats' | 'wellness' | 'journal-history' | 'profile';
  onPageChange: (page: 'home' | 'journal' | 'stats' | 'wellness' | 'journal-history' | 'profile') => void;
}

export function MobileNavBar({ currentPage, onPageChange }: MobileNavBarProps) {
  const intl = useIntl();

  // Ne pas afficher la barre de navigation sur la page profil
  if (currentPage === 'profile') {
    return null;
  }

  const navItems = [
    {
      id: 'home' as const,
      icon: Home,
      label: intl.formatMessage({ id: 'nav.home' })
    },
    {
      id: 'journal' as const,
      icon: BookOpen,
      label: intl.formatMessage({ id: 'nav.journal' })
    },
    {
      id: 'stats' as const,
      icon: BarChart2,
      label: intl.formatMessage({ id: 'nav.stats' })
    },
    {
      id: 'wellness' as const,
      icon: Heart,
      label: intl.formatMessage({ id: 'nav.wellness' })
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 pb-safe lg:hidden">
      <div className="flex justify-around items-center">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onPageChange(id)}
            className={`flex flex-col items-center py-3 px-5 transition-all duration-300 ${
              currentPage === id
                ? 'text-violet-600 scale-110'
                : 'text-gray-500 hover:text-violet-600'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}