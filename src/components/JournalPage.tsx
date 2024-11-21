import React, { useEffect, useState } from 'react';
import { BookOpen, Calendar, Search, ChevronDown, Heart, Sun, Smile, Cloud, CloudRain, ChevronRight, CheckCircle2 } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { ref, get } from 'firebase/database';
import { format, isToday, isYesterday, startOfDay } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { useIntl } from 'react-intl';
import { ShareMood } from './ShareMood';

interface JournalEntry {
  mood: string;
  entry: string;
  timestamp: number;
  id?: string;
}

interface CompletedActivity {
  id: string;
  timestamp: number;
}

const moodIcons = {
  'Amazing': Heart,
  'Fantastique': Heart,
  'Good': Sun,
  'Bien': Sun,
  'Okay': Smile,
  'Correct': Smile,
  'Meh': Cloud,
  'Bof': Cloud,
  'Bad': CloudRain,
  'Mauvais': CloudRain
} as const;

const moodColors = {
  'Amazing': 'bg-gradient-to-br from-pink-500 to-rose-500',
  'Fantastique': 'bg-gradient-to-br from-pink-500 to-rose-500',
  'Good': 'bg-gradient-to-br from-amber-400 to-orange-400',
  'Bien': 'bg-gradient-to-br from-amber-400 to-orange-400',
  'Okay': 'bg-gradient-to-br from-emerald-400 to-teal-400',
  'Correct': 'bg-gradient-to-br from-emerald-400 to-teal-400',
  'Meh': 'bg-gradient-to-br from-blue-400 to-cyan-400',
  'Bof': 'bg-gradient-to-br from-blue-400 to-cyan-400',
  'Bad': 'bg-gradient-to-br from-violet-500 to-purple-500',
  'Mauvais': 'bg-gradient-to-br from-violet-500 to-purple-500'
} as const;

export function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [completedActivities, setCompletedActivities] = useState<Record<string, string[]>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const intl = useIntl();
  const dateLocale = intl.locale === 'fr' ? fr : enUS;

  useEffect(() => {
    fetchEntries();
  }, [selectedMonth]);

  const fetchEntries = async () => {
    if (!auth.currentUser) return;

    setIsLoading(true);
    try {
      // Récupérer les entrées du journal
      const journalRef = ref(db, `users/${auth.currentUser.uid}/journal`);
      const journalSnapshot = await get(journalRef);

      // Récupérer les activités complétées
      const activitiesRef = ref(db, `users/${auth.currentUser.uid}/completedActivities`);
      const activitiesSnapshot = await get(activitiesRef);

      if (journalSnapshot.exists()) {
        const entriesData: JournalEntry[] = [];
        const activitiesData: Record<string, string[]> = {};

        journalSnapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          entriesData.push({
            mood: data.mood,
            entry: data.entry,
            timestamp: data.timestamp,
            id: childSnapshot.key || undefined
          });
        });

        // Organiser les activités par date
        if (activitiesSnapshot.exists()) {
          Object.entries(activitiesSnapshot.val()).forEach(([timestamp, activities]) => {
            const dateKey = format(new Date(parseInt(timestamp)), 'yyyy-MM-dd');
            activitiesData[dateKey] = activities as string[];
          });
        }

        entriesData.sort((a, b) => b.timestamp - a.timestamp);
        setEntries(entriesData);
        setCompletedActivities(activitiesData);
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMoodIcon = (mood: string) => {
    return moodIcons[mood as keyof typeof moodIcons] || Heart;
  };

  const getMoodColor = (mood: string) => {
    return moodColors[mood as keyof typeof moodColors] || 'bg-gradient-to-br from-pink-500 to-rose-500';
  };

  const formatEntryDate = (timestamp: number) => {
    const date = new Date(timestamp);
    
    if (isToday(date)) {
      return intl.formatMessage(
        { id: 'journal.entry.today' },
        { time: format(date, 'p', { locale: dateLocale }) }
      );
    }
    
    if (isYesterday(date)) {
      return intl.formatMessage(
        { id: 'journal.entry.yesterday' },
        { time: format(date, 'p', { locale: dateLocale }) }
      );
    }
    
    return intl.formatMessage(
      { id: 'journal.entry.date' },
      {
        date: format(date, 'PPP', { locale: dateLocale }),
        time: format(date, 'p', { locale: dateLocale }),
      }
    );
  };

  const handleShare = (platform: string, entryId: string) => {
    console.log(`Shared entry ${entryId} on ${platform}`);
  };

  const handleShareClick = (e: React.MouseEvent, entryId: string) => {
    e.stopPropagation();
    setSelectedEntryId(entryId);
  };

  const getActivitiesForDate = (timestamp: number) => {
    const dateKey = format(new Date(timestamp), 'yyyy-MM-dd');
    return completedActivities[dateKey] || [];
  };

  const filteredEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.timestamp);
    const monthMatch = format(entryDate, 'yyyy-MM') === selectedMonth;
    const searchMatch = !searchTerm || 
      entry.entry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.mood.toLowerCase().includes(searchTerm.toLowerCase());
    return monthMatch && searchMatch;
  });

  return (
    <div className="container mx-auto px-4 py-4 lg:py-6 space-y-6 lg:space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg">
            <BookOpen className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
          </div>
          <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            {intl.formatMessage({ id: 'journal.history.title' })}
          </h1>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={intl.formatMessage({ id: 'journal.search' })}
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative">
          <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <select
            className="input-field pl-10 appearance-none"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {Array.from({ length: 12 }, (_, i) => {
              const date = new Date();
              date.setMonth(date.getMonth() - i);
              const value = format(date, 'yyyy-MM');
              return (
                <option key={value} value={value}>
                  {format(date, 'MMMM yyyy', { locale: dateLocale })}
                </option>
              );
            })}
          </select>
          <ChevronDown className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8 lg:py-12">
          <div className="animate-spin rounded-full h-10 w-10 lg:h-12 lg:w-12 border-4 border-violet-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-4 lg:space-y-6">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-8 lg:py-12">
              <p className="text-gray-500">
                {intl.formatMessage({ id: 'journal.noEntries' })}
              </p>
            </div>
          ) : (
            filteredEntries.map((entry) => {
              const Icon = getMoodIcon(entry.mood);
              const isSelected = selectedEntryId === entry.id;
              const activities = getActivitiesForDate(entry.timestamp);
              
              return (
                <div
                  key={entry.timestamp}
                  className={`group card p-3 lg:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer ${
                    isSelected ? 'selected-entry' : ''
                  }`}
                  onClick={() => entry.id && setSelectedEntryId(isSelected ? null : entry.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getMoodColor(entry.mood)} shrink-0`}>
                      <Icon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <h3 className="font-medium text-gray-800 text-sm lg:text-base">
                            {entry.mood}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {formatEntryDate(entry.timestamp)}
                          </p>
                        </div>
                        {entry.id && (
                          <div 
                            className={`ml-2 ${isSelected ? 'animate-fade-in' : 'hidden group-hover:block'}`}
                            onClick={(e) => handleShareClick(e, entry.id!)}
                          >
                            <ShareMood
                              mood={entry.mood}
                              entry={entry.entry}
                              entryId={entry.id}
                              onShare={(platform) => handleShare(platform, entry.id!)}
                            />
                          </div>
                        )}
                      </div>
                      <p className="text-sm lg:text-base text-gray-600 whitespace-pre-wrap break-words">
                        {entry.entry}
                      </p>

                      {/* Activités complétées */}
                      {activities.length > 0 && isSelected && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-violet-500" />
                            <span>{intl.formatMessage({ id: 'wellness.activities.completed' })}</span>
                          </h4>
                          <div className="space-y-2">
                            {activities.map((activityId) => (
                              <div
                                key={activityId}
                                className="flex items-center space-x-2 text-sm text-gray-600 bg-violet-50 rounded-lg p-2"
                              >
                                <ChevronRight className="w-4 h-4 text-violet-400" />
                                <span>
                                  {intl.formatMessage({ 
                                    id: `wellness.activities.${activityId.split('.')[0]}.${activityId.split('.')[1]}.description` 
                                  })}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}