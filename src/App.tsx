import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { auth } from './lib/firebase';
import { Header } from './components/Header';
import { MobileNavBar } from './components/MobileNavBar';
import { MoodSelector } from './components/MoodSelector';
import { JournalEntry } from './components/JournalEntry';
import { DailyStats } from './components/DailyStats';
import { WellnessSection } from './components/WellnessSection';
import { JournalPage } from './components/JournalPage';
import { ProfilePage } from './components/ProfilePage';
import { Auth } from './components/Auth';
import { SharePage } from './components/SharePage';
import { useIntl } from 'react-intl';
import { useRandomQuote } from './hooks/useRandomQuote';
import { VideoGenerationLoader } from './components/VideoGenerationLoader';

export const VideoGenerationContext = React.createContext<{
  isGeneratingVideo: boolean;
  setIsGeneratingVideo: (value: boolean) => void;
}>({
  isGeneratingVideo: false,
  setIsGeneratingVideo: () => {},
});

type Page = 'home' | 'journal' | 'stats' | 'wellness' | 'journal-history' | 'profile';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return <>{children}</>;
}

function MainApp() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [statsKey, setStatsKey] = useState(0);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const intl = useIntl();
  const randomQuote = useRandomQuote();

  const handleEntrySaved = () => {
    setSelectedMood(null);
    setStatsKey(prev => prev + 1);
  };

  const renderMobilePage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="space-y-6">
            <div className="card p-6">
              <div className="text-center">
                <h2 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  {intl.formatMessage({ id: 'inspiration.title' })}
                </h2>
                <blockquote className="text-base text-gray-600">
                  <p className="italic">{randomQuote.quote}</p>
                  <footer className="text-sm text-gray-500 mt-3 font-medium">
                    {randomQuote.author}
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
        );
      case 'journal':
        return (
          <div className="space-y-6">
            <div className="card p-6">
              <MoodSelector 
                selectedMood={selectedMood}
                onMoodSelect={setSelectedMood}
              />
            </div>
            <div className="card p-6">
              <JournalEntry 
                selectedMood={selectedMood}
                onEntrySaved={handleEntrySaved}
              />
            </div>
          </div>
        );
      case 'stats':
        return (
          <div className="card p-6">
            <DailyStats key={statsKey} />
          </div>
        );
      case 'wellness':
        return (
          <div className="card p-6">
            <WellnessSection />
          </div>
        );
      case 'journal-history':
        return <JournalPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return null;
    }
  };

  // Si nous sommes sur la page journal-history ou profile, afficher uniquement cette page
  if (currentPage === 'journal-history' || currentPage === 'profile') {
    return (
      <VideoGenerationContext.Provider value={{ isGeneratingVideo, setIsGeneratingVideo }}>
        <div className="min-h-screen bg-gradient-to-br from-violet-50 to-pink-50">
          <Header onPageChange={setCurrentPage} currentPage={currentPage} />
          <main className="container mx-auto px-4 py-6 pb-24">
            {renderMobilePage()}
          </main>
          <MobileNavBar currentPage={currentPage} onPageChange={setCurrentPage} />
          <VideoGenerationLoader isOpen={isGeneratingVideo} />
        </div>
      </VideoGenerationContext.Provider>
    );
  }

  return (
    <VideoGenerationContext.Provider value={{ isGeneratingVideo, setIsGeneratingVideo }}>
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-pink-50">
        <Header onPageChange={setCurrentPage} currentPage={currentPage} />
        
        {/* Mobile Layout */}
        <main className="lg:hidden container mx-auto px-4 py-6 pb-24">
          {renderMobilePage()}
        </main>
        <MobileNavBar currentPage={currentPage} onPageChange={setCurrentPage} />

        {/* Desktop Layout */}
        <main className="hidden lg:block container mx-auto px-4 py-8 space-y-8">
          {/* Inspiration Panel - Full width */}
          <div className="card p-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-6">
                {intl.formatMessage({ id: 'inspiration.title' })}
              </h2>
              <blockquote className="text-lg text-gray-600">
                <p className="italic">{randomQuote.quote}</p>
                <footer className="text-sm text-gray-500 mt-4 font-medium">
                  {randomQuote.author}
                </footer>
              </blockquote>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column: Journal and Mood */}
            <div className="space-y-8">
              <div className="card p-8">
                <MoodSelector 
                  selectedMood={selectedMood}
                  onMoodSelect={setSelectedMood}
                />
              </div>
              <div className="card p-8">
                <JournalEntry 
                  selectedMood={selectedMood}
                  onEntrySaved={handleEntrySaved}
                />
              </div>
            </div>

            {/* Right Column: Stats */}
            <div className="card p-8">
              <DailyStats key={statsKey} />
            </div>
          </div>

          {/* Wellness Panel - Full width */}
          <div className="card p-8">
            <WellnessSection />
          </div>
        </main>

        <VideoGenerationLoader isOpen={isGeneratingVideo} />
      </div>
    </VideoGenerationContext.Provider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/share" element={<SharePage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MainApp />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}