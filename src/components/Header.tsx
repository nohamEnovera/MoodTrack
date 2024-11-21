import React, { useState } from 'react';
import { Activity, BarChart2, BookOpen, LogOut, Menu, X, UserCircle } from 'lucide-react';
import { auth } from '../lib/firebase';
import { useIntl } from 'react-intl';
import { useLanguage } from '../hooks/useLanguage';

interface HeaderProps {
  onPageChange: (page: 'home' | 'journal' | 'stats' | 'wellness' | 'journal-history' | 'profile') => void;
  currentPage: 'home' | 'journal' | 'stats' | 'wellness' | 'journal-history' | 'profile';
}

export function Header({ onPageChange, currentPage }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const intl = useIntl();
  const { currentLanguage, setLanguage } = useLanguage();
  
  const handleLogout = () => {
    auth.signOut();
  };

  const toggleLanguage = () => {
    setLanguage(currentLanguage === 'en' ? 'fr' : 'en');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (page: 'home' | 'journal' | 'stats' | 'wellness' | 'journal-history' | 'profile') => {
    onPageChange(page);
    setIsMenuOpen(false);
  };

  return (
    <header className="w-full bg-white/80 backdrop-blur-lg border-b border-white/20 relative z-50">
      <div className="container mx-auto px-4 py-3 lg:py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 group transition-all duration-300"
          >
            <div className="bg-gradient-to-r from-violet-500 to-purple-500 p-2 rounded-xl group-hover:scale-105 transition-transform duration-300">
              <Activity className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
            </div>
            <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity duration-300">
              MoodTrack
            </h1>
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => onPageChange('journal-history')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                currentPage === 'journal-history'
                  ? 'text-violet-600 bg-violet-50'
                  : 'text-gray-600 hover:text-violet-600 hover:bg-violet-50'
              }`}
            >
              <BookOpen className="h-5 w-5" />
              <span className="text-base font-medium">{intl.formatMessage({ id: 'nav.journal' })}</span>
            </button>

            <button
              onClick={() => onPageChange('profile')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                currentPage === 'profile'
                  ? 'text-violet-600 bg-violet-50'
                  : 'text-gray-600 hover:text-violet-600 hover:bg-violet-50'
              }`}
            >
              <UserCircle className="h-5 w-5" />
              <span className="text-base font-medium">{intl.formatMessage({ id: 'nav.profile' })}</span>
            </button>

            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-600 hover:text-violet-600 hover:bg-violet-50 transition-all duration-300"
            >
              <span className="text-base font-medium uppercase">{currentLanguage === 'en' ? 'FR' : 'EN'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-300"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-base font-medium">{intl.formatMessage({ id: 'nav.logout' })}</span>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 text-gray-600 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all duration-300"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-white/20 shadow-xl">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              <button
                onClick={() => handleNavClick('journal-history')}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  currentPage === 'journal-history'
                    ? 'text-violet-600 bg-violet-50'
                    : 'text-gray-600 hover:text-violet-600 hover:bg-violet-50'
                }`}
              >
                <BookOpen className="h-5 w-5" />
                <span className="text-base font-medium">{intl.formatMessage({ id: 'nav.journal' })}</span>
              </button>

              <button
                onClick={() => handleNavClick('profile')}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  currentPage === 'profile'
                    ? 'text-violet-600 bg-violet-50'
                    : 'text-gray-600 hover:text-violet-600 hover:bg-violet-50'
                }`}
              >
                <UserCircle className="h-5 w-5" />
                <span className="text-base font-medium">{intl.formatMessage({ id: 'nav.profile' })}</span>
              </button>

              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:text-violet-600 hover:bg-violet-50 transition-all duration-300"
              >
                <span className="text-base font-medium">
                  {currentLanguage === 'en' ? 'Switch to French' : 'Passer en anglais'}
                </span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-300"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-base font-medium">{intl.formatMessage({ id: 'nav.logout' })}</span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}