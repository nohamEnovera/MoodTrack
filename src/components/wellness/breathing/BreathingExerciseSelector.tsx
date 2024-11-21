import React from 'react';
import { useIntl } from 'react-intl';
import { Brain, Wind, Box, Infinity, Moon, Star, Zap } from 'lucide-react';

interface BreathingExerciseProps {
  selectedExercise: string;
  onSelectExercise: (exercise: string) => void;
}

const breathingExercises = [
  {
    id: 'mindful',
    icon: Brain,
    titleKey: 'wellness.breathing.exercises.mindful.title',
    descriptionKey: 'wellness.breathing.exercises.mindful.description'
  },
  {
    id: 'diaphragmatic',
    icon: Wind,
    titleKey: 'wellness.breathing.exercises.diaphragmatic.title',
    descriptionKey: 'wellness.breathing.exercises.diaphragmatic.description'
  },
  {
    id: 'box',
    icon: Box,
    titleKey: 'wellness.breathing.exercises.box.title',
    descriptionKey: 'wellness.breathing.exercises.box.description'
  },
  {
    id: 'alternate',
    icon: Infinity,
    titleKey: 'wellness.breathing.exercises.alternate.title',
    descriptionKey: 'wellness.breathing.exercises.alternate.description'
  },
  {
    id: '478',
    icon: Moon,
    titleKey: 'wellness.breathing.exercises.478.title',
    descriptionKey: 'wellness.breathing.exercises.478.description'
  },
  {
    id: 'ujjayi',
    icon: Star,
    titleKey: 'wellness.breathing.exercises.ujjayi.title',
    descriptionKey: 'wellness.breathing.exercises.ujjayi.description'
  },
  {
    id: 'kapalabhati',
    icon: Zap,
    titleKey: 'wellness.breathing.exercises.kapalabhati.title',
    descriptionKey: 'wellness.breathing.exercises.kapalabhati.description'
  }
];

export function BreathingExerciseSelector({ selectedExercise, onSelectExercise }: BreathingExerciseProps) {
  const intl = useIntl();
  const selected = breathingExercises.find(exercise => exercise.id === selectedExercise);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-4">
        {breathingExercises.map((exercise) => {
          const Icon = exercise.icon;
          const isSelected = selectedExercise === exercise.id;

          return (
            <button
              key={exercise.id}
              onClick={() => onSelectExercise(exercise.id)}
              className={`w-full aspect-square rounded-2xl transition-all duration-300 flex items-center justify-center ${
                isSelected
                  ? 'bg-violet-500 text-white ring-2 ring-violet-500 ring-offset-2'
                  : 'bg-white hover:bg-violet-50 text-gray-600 hover:text-violet-500'
              }`}
            >
              <Icon className="w-8 h-8" />
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="text-center animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {intl.formatMessage({ id: selected.titleKey })}
          </h3>
          <p className="text-gray-600">
            {intl.formatMessage({ id: selected.descriptionKey })}
          </p>
        </div>
      )}
    </div>
  );
}