import React, { useEffect, useState } from 'react';
import { TrendingUp, Award, Heart, RefreshCw, BarChart2, Sun, Smile, Cloud, CloudRain } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { ref, get } from 'firebase/database';
import { format, differenceInDays, startOfDay } from 'date-fns';
import { useIntl } from 'react-intl';
import { fr, enUS } from 'date-fns/locale';

interface MoodEntry {
  mood: string;
  timestamp: number;
}

interface MoodCount {
  [key: string]: number;
}

interface DailyMoodCount {
  [date: string]: MoodCount;
}

const moodKeyMap = {
  'Fantastique': 'Amazing',
  'Bien': 'Good',
  'Correct': 'Okay',
  'Bof': 'Meh',
  'Mauvais': 'Bad',
  'Amazing': 'Amazing',
  'Good': 'Good',
  'Okay': 'Okay',
  'Meh': 'Meh',
  'Bad': 'Bad'
} as const;

const moodIcons = {
  'Amazing': Heart,
  'Good': Sun,
  'Okay': Smile,
  'Meh': Cloud,
  'Bad': CloudRain
} as const;

const moodColors = {
  'Amazing': 'from-pink-500 to-rose-500',
  'Good': 'from-amber-400 to-orange-400',
  'Okay': 'from-emerald-400 to-teal-400',
  'Meh': 'from-blue-400 to-cyan-400',
  'Bad': 'from-violet-500 to-purple-500'
} as const;

export function DailyStats() {
  const [weeklyMoods, setWeeklyMoods] = useState<MoodEntry[]>([]);
  const [moodStats, setMoodStats] = useState<MoodCount>({});
  const [dailyMoodStats, setDailyMoodStats] = useState<DailyMoodCount>({});
  const [streak, setStreak] = useState(0);
  const [currentMood, setCurrentMood] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const intl = useIntl();
  const dateLocale = intl.locale === 'fr' ? fr : enUS;

  useEffect(() => {
    fetchMoodData();
  }, []);

  const fetchMoodData = async () => {
    if (!auth.currentUser) return;
    
    setIsRefreshing(true);
    try {
      const journalRef = ref(db, `users/${auth.currentUser.uid}/journal`);
      const snapshot = await get(journalRef);
      
      if (snapshot.exists()) {
        const entries: MoodEntry[] = [];
        const moodCounts: MoodCount = {};
        const dailyCounts: DailyMoodCount = {};
        let currentStreak = 0;
        
        // Convertir les entrées en tableau et trier par date
        const sortedEntries = Object.entries(snapshot.val())
          .map(([_, value]: [string, any]) => ({
            timestamp: value.timestamp,
            mood: value.mood,
            date: startOfDay(new Date(value.timestamp)).getTime()
          }))
          .sort((a, b) => b.timestamp - a.timestamp);

        // Dédupliquer les entrées par jour
        const uniqueDayEntries = Array.from(
          new Map(sortedEntries.map(entry => [entry.date, entry])).values()
        ).sort((a, b) => b.date - a.date);

        // Calculer la série actuelle
        const today = startOfDay(new Date()).getTime();
        const yesterday = startOfDay(new Date(Date.now() - 86400000)).getTime();

        if (uniqueDayEntries.length > 0) {
          // Vérifier si nous avons une entrée aujourd'hui ou hier
          const firstEntryDate = uniqueDayEntries[0].date;
          
          if (firstEntryDate === today || firstEntryDate === yesterday) {
            currentStreak = 1;
            let previousDate = firstEntryDate;
            
            // Parcourir les entrées pour trouver les jours consécutifs
            for (let i = 1; i < uniqueDayEntries.length; i++) {
              const currentDate = uniqueDayEntries[i].date;
              const dayDiff = Math.abs(differenceInDays(previousDate, currentDate));
              
              if (dayDiff === 1) {
                currentStreak++;
                previousDate = currentDate;
              } else {
                break;
              }
            }
          }
        }

        // Traiter les entrées pour les statistiques
        sortedEntries.forEach((entry) => {
          const dateKey = format(new Date(entry.timestamp), 'yyyy-MM-dd');
          const moodKey = moodKeyMap[entry.mood as keyof typeof moodKeyMap] || entry.mood;
          
          if (!dailyCounts[dateKey]) {
            dailyCounts[dateKey] = {};
          }
          
          if (!dailyCounts[dateKey][moodKey]) {
            dailyCounts[dateKey][moodKey] = 0;
          }
          dailyCounts[dateKey][moodKey]++;
          
          if (!moodCounts[moodKey]) {
            moodCounts[moodKey] = 0;
          }
          moodCounts[moodKey]++;
          
          entries.push({
            mood: moodKey,
            timestamp: entry.timestamp,
          });
        });
        
        setWeeklyMoods(entries);
        setMoodStats(moodCounts);
        setDailyMoodStats(dailyCounts);
        setStreak(currentStreak);
        
        if (entries.length > 0) {
          setCurrentMood(entries[0].mood);
        }
      }
    } catch (error) {
      console.error('Error fetching mood data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const renderWeeklyChart = () => {
    const days = Object.keys(dailyMoodStats).sort().slice(-7);
    
    return (
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center space-x-2">
          <BarChart2 className="w-5 h-5 text-violet-500" />
          <span>{intl.formatMessage({ id: 'stats.weeklyDistribution' })}</span>
        </h3>
        <div className="space-y-6">
          {days.map(day => {
            const dayMoods = dailyMoodStats[day];
            const total = Object.values(dayMoods).reduce((sum, count) => sum + count, 0);
            const moodEntries = Object.entries(dayMoods)
              .filter(([_, count]) => count > 0)
              .sort((a, b) => b[1] - a[1]);
            
            return (
              <div key={day} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {format(new Date(day), 'EEEE', { locale: dateLocale })}
                  </span>
                  <span className="text-sm text-gray-500">
                    {total} {intl.formatMessage({ 
                      id: total === 1 ? 'stats.entry' : 'stats.entries' 
                    })}
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gray-100 rounded-lg"></div>
                  <div className="relative h-16 bg-gray-100 rounded-lg overflow-hidden flex">
                    {moodEntries.map(([mood, count], index) => {
                      const Icon = moodIcons[mood as keyof typeof moodIcons];
                      const colors = moodColors[mood as keyof typeof moodColors];
                      const width = (count / total) * 100;
                      return (
                        <div
                          key={mood}
                          className={`h-full bg-gradient-to-r ${colors} flex items-center justify-center group relative`}
                          style={{
                            width: `${width}%`,
                            marginLeft: index === 0 ? '0' : '2px'
                          }}
                        >
                          {Icon && <Icon className="w-6 h-6 text-white" />}
                          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {intl.formatMessage({ id: `mood.${mood.toLowerCase()}` })}: {count}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            {intl.formatMessage({ id: 'stats.title' })}
          </h2>
        </div>
        <button
          onClick={fetchMoodData}
          disabled={isRefreshing}
          className="p-2 text-violet-600 hover:text-violet-700 hover:bg-violet-50 rounded-lg transition-all duration-300"
        >
          <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 font-medium">
                {intl.formatMessage({ id: 'stats.streak' })}
              </p>
              <h3 className="text-2xl font-bold text-orange-700">
                {streak} {intl.formatMessage({ id: 'stats.days' })}
              </h3>
            </div>
            <Award className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-4 rounded-xl border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-violet-600 font-medium">
                {intl.formatMessage({ id: 'stats.currentMood' })}
              </p>
              <h3 className="text-2xl font-bold text-violet-700">
                {currentMood ? intl.formatMessage({ id: `mood.${currentMood.toLowerCase()}` }) : intl.formatMessage({ id: 'stats.noEntry' })}
              </h3>
            </div>
            <Heart className="h-8 w-8 text-violet-500" />
          </div>
        </div>
      </div>

      {renderWeeklyChart()}
    </div>
  );
}