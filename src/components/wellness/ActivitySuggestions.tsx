import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Heart, Sun, Smile, Cloud, CloudRain, CheckCircle2, Timer, Trophy, Sparkles } from 'lucide-react';
import { auth, db } from '../../lib/firebase';
import { ref, get, set } from 'firebase/database';
import { startOfDay } from 'date-fns';

interface Activity {
  id: string;
  description: string;
  benefits: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
}

const moodActivities: Record<string, Activity[]> = {
  'Amazing': [
    {
      id: 'amazing.1',
      description: 'wellness.activities.amazing.1.description',
      benefits: ['wellness.benefits.energy', 'wellness.benefits.social', 'wellness.benefits.joy'],
      difficulty: 'medium',
      duration: 30
    },
    {
      id: 'amazing.2',
      description: 'wellness.activities.amazing.2.description',
      benefits: ['wellness.benefits.creativity', 'wellness.benefits.growth', 'wellness.benefits.mind'],
      difficulty: 'hard',
      duration: 60
    },
    {
      id: 'amazing.3',
      description: 'wellness.activities.amazing.3.description',
      benefits: ['wellness.benefits.health', 'wellness.benefits.energy', 'wellness.benefits.mood'],
      difficulty: 'medium',
      duration: 45
    }
  ],
  'Good': [
    {
      id: 'good.1',
      description: 'wellness.activities.good.1.description',
      benefits: ['wellness.benefits.joy', 'wellness.benefits.mindfulness', 'wellness.benefits.mood'],
      difficulty: 'easy',
      duration: 20
    },
    {
      id: 'good.2',
      description: 'wellness.activities.good.2.description',
      benefits: ['wellness.benefits.social', 'wellness.benefits.support', 'wellness.benefits.joy'],
      difficulty: 'medium',
      duration: 30
    },
    {
      id: 'good.3',
      description: 'wellness.activities.good.3.description',
      benefits: ['wellness.benefits.mind', 'wellness.benefits.growth', 'wellness.benefits.creativity'],
      difficulty: 'medium',
      duration: 45
    }
  ],
  'Okay': [
    {
      id: 'okay.1',
      description: 'wellness.activities.okay.1.description',
      benefits: ['wellness.benefits.mindfulness', 'wellness.benefits.health', 'wellness.benefits.peace'],
      difficulty: 'easy',
      duration: 15
    },
    {
      id: 'okay.2',
      description: 'wellness.activities.okay.2.description',
      benefits: ['wellness.benefits.mood', 'wellness.benefits.energy', 'wellness.benefits.mindfulness'],
      difficulty: 'easy',
      duration: 20
    },
    {
      id: 'okay.3',
      description: 'wellness.activities.okay.3.description',
      benefits: ['wellness.benefits.mind', 'wellness.benefits.peace', 'wellness.benefits.relaxation'],
      difficulty: 'easy',
      duration: 30
    }
  ],
  'Meh': [
    {
      id: 'meh.1',
      description: 'wellness.activities.meh.1.description',
      benefits: ['wellness.benefits.relaxation', 'wellness.benefits.comfort', 'wellness.benefits.peace'],
      difficulty: 'easy',
      duration: 15
    },
    {
      id: 'meh.2',
      description: 'wellness.activities.meh.2.description',
      benefits: ['wellness.benefits.mindfulness', 'wellness.benefits.mood', 'wellness.benefits.peace'],
      difficulty: 'easy',
      duration: 10
    },
    {
      id: 'meh.3',
      description: 'wellness.activities.meh.3.description',
      benefits: ['wellness.benefits.comfort', 'wellness.benefits.selfcare', 'wellness.benefits.calm'],
      difficulty: 'easy',
      duration: 20
    }
  ],
  'Bad': [
    {
      id: 'bad.1',
      description: 'wellness.activities.bad.1.description',
      benefits: ['wellness.benefits.calm', 'wellness.benefits.anxiety', 'wellness.benefits.peace'],
      difficulty: 'easy',
      duration: 10
    },
    {
      id: 'bad.2',
      description: 'wellness.activities.bad.2.description',
      benefits: ['wellness.benefits.support', 'wellness.benefits.relief', 'wellness.benefits.comfort'],
      difficulty: 'medium',
      duration: 30
    },
    {
      id: 'bad.3',
      description: 'wellness.activities.bad.3.description',
      benefits: ['wellness.benefits.selfcare', 'wellness.benefits.comfort', 'wellness.benefits.peace'],
      difficulty: 'easy',
      duration: 20
    }
  ]
};

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

const difficultyColors = {
  easy: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  hard: 'bg-rose-100 text-rose-700'
} as const;

export function ActivitySuggestions() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set());
  const intl = useIntl();

  useEffect(() => {
    const loadCompletedActivities = async () => {
      if (!auth.currentUser) return;

      const today = startOfDay(new Date()).getTime();
      const activitiesRef = ref(db, `users/${auth.currentUser.uid}/completedActivities/${today}`);
      
      try {
        const snapshot = await get(activitiesRef);
        if (snapshot.exists()) {
          const activities = snapshot.val();
          setCompletedActivities(new Set(activities));
        }
      } catch (error) {
        console.error('Error loading completed activities:', error);
      }
    };

    loadCompletedActivities();
  }, []);

  const saveCompletedActivities = async (activities: Set<string>) => {
    if (!auth.currentUser) return;

    const today = startOfDay(new Date()).getTime();
    const activitiesRef = ref(db, `users/${auth.currentUser.uid}/completedActivities/${today}`);
    
    try {
      await set(activitiesRef, Array.from(activities));
    } catch (error) {
      console.error('Error saving completed activities:', error);
    }
  };

  const handleActivityComplete = (activityId: string) => {
    setCompletedActivities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(activityId)) {
        newSet.delete(activityId);
      } else {
        newSet.add(activityId);
      }
      saveCompletedActivities(newSet);
      return newSet;
    });
  };

  const renderActivities = (mood: string) => {
    const activities = moodActivities[mood];
    if (!activities) return null;

    return (
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={`relative bg-white rounded-xl p-4 transition-all duration-300 ${
              completedActivities.has(activity.id)
                ? 'ring-2 ring-violet-500 ring-offset-2'
                : 'hover:shadow-md'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <p className="text-gray-800 font-medium mb-2">
                  {intl.formatMessage({ id: activity.description })}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <div className="flex items-center space-x-1 text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded-full">
                    <Timer className="w-3 h-3" />
                    <span>{activity.duration}m</span>
                  </div>
                  <div className={`flex items-center space-x-1 text-xs px-2 py-1 rounded-full ${difficultyColors[activity.difficulty]}`}>
                    <Trophy className="w-3 h-3" />
                    <span>
                      {intl.formatMessage({ id: `wellness.difficulty.${activity.difficulty}` })}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-gray-500 font-medium">
                    {intl.formatMessage({ id: 'wellness.activities.benefits' })}:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {activity.benefits.map((benefit) => (
                      <span
                        key={benefit}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                      >
                        {intl.formatMessage({ id: benefit })}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleActivityComplete(activity.id)}
                className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  completedActivities.has(activity.id)
                    ? 'bg-violet-500 text-white'
                    : 'bg-gray-100 text-gray-400 hover:bg-violet-100 hover:text-violet-500'
                }`}
                title={intl.formatMessage({ id: 'wellness.activities.completed' })}
              >
                <CheckCircle2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">
          {intl.formatMessage({ id: 'wellness.activities.title' })}
        </h3>
        <p className="text-gray-600">
          {intl.formatMessage({ id: 'wellness.activities.description' })}
        </p>
      </div>

      <div className="flex justify-center space-x-2">
        {Object.keys(moodActivities).map(mood => {
          const Icon = moodIcons[mood as keyof typeof moodIcons];
          return (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={`p-3 rounded-xl transition-all duration-300 ${
                selectedMood === mood
                  ? 'bg-violet-500 text-white ring-2 ring-violet-500 ring-offset-2'
                  : 'bg-gray-100 text-gray-500 hover:bg-violet-100 hover:text-violet-500'
              }`}
            >
              <Icon className="w-6 h-6" />
            </button>
          );
        })}
      </div>

      {selectedMood && renderActivities(selectedMood)}
    </div>
  );
}