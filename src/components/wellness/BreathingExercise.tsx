import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Brain, Wind, Box, Infinity, Moon, Star, Zap } from 'lucide-react';
import { BaseBreathingExercise } from './breathing/BaseBreathingExercise';

const breathingExercises = [
  {
    id: 'mindful',
    icon: Brain,
    titleKey: 'wellness.breathing.exercises.mindful.title',
    descriptionKey: 'wellness.breathing.exercises.mindful.description',
    phases: [
      { key: 'inhale', duration: 4000 },
      { key: 'exhale', duration: 4000 }
    ],
    instructions: [
      'wellness.breathing.exercises.mindful.instruction.1',
      'wellness.breathing.exercises.mindful.instruction.2',
      'wellness.breathing.exercises.mindful.instruction.3',
      'wellness.breathing.exercises.mindful.instruction.4'
    ],
    benefits: [
      'wellness.breathing.exercises.mindful.benefit.1',
      'wellness.breathing.exercises.mindful.benefit.2'
    ]
  },
  {
    id: 'diaphragmatic',
    icon: Wind,
    titleKey: 'wellness.breathing.exercises.diaphragmatic.title',
    descriptionKey: 'wellness.breathing.exercises.diaphragmatic.description',
    phases: [
      { key: 'inhale', duration: 4000 },
      { key: 'exhale', duration: 6000 }
    ],
    instructions: [
      'wellness.breathing.exercises.diaphragmatic.instruction.1',
      'wellness.breathing.exercises.diaphragmatic.instruction.2',
      'wellness.breathing.exercises.diaphragmatic.instruction.3'
    ],
    benefits: [
      'wellness.breathing.exercises.diaphragmatic.benefit.1',
      'wellness.breathing.exercises.diaphragmatic.benefit.2'
    ]
  },
  {
    id: 'box',
    icon: Box,
    titleKey: 'wellness.breathing.exercises.box.title',
    descriptionKey: 'wellness.breathing.exercises.box.description',
    phases: [
      { key: 'inhale', duration: 4000 },
      { key: 'hold', duration: 4000 },
      { key: 'exhale', duration: 4000 },
      { key: 'rest', duration: 4000 }
    ],
    instructions: [
      'wellness.breathing.exercises.box.instruction.1',
      'wellness.breathing.exercises.box.instruction.2',
      'wellness.breathing.exercises.box.instruction.3',
      'wellness.breathing.exercises.box.instruction.4'
    ],
    benefits: [
      'wellness.breathing.exercises.box.benefit.1',
      'wellness.breathing.exercises.box.benefit.2'
    ]
  },
  {
    id: 'alternate',
    icon: Infinity,
    titleKey: 'wellness.breathing.exercises.alternate.title',
    descriptionKey: 'wellness.breathing.exercises.alternate.description',
    phases: [
      { key: 'inhale', duration: 4000 },
      { key: 'hold', duration: 2000 },
      { key: 'exhale', duration: 4000 },
      { key: 'hold', duration: 2000 }
    ],
    instructions: [
      'wellness.breathing.exercises.alternate.instruction.1',
      'wellness.breathing.exercises.alternate.instruction.2',
      'wellness.breathing.exercises.alternate.instruction.3',
      'wellness.breathing.exercises.alternate.instruction.4'
    ],
    benefits: [
      'wellness.breathing.exercises.alternate.benefit.1',
      'wellness.breathing.exercises.alternate.benefit.2'
    ]
  },
  {
    id: '478',
    icon: Moon,
    titleKey: 'wellness.breathing.exercises.478.title',
    descriptionKey: 'wellness.breathing.exercises.478.description',
    phases: [
      { key: 'inhale', duration: 4000 },
      { key: 'hold', duration: 7000 },
      { key: 'exhale', duration: 8000 }
    ],
    instructions: [
      'wellness.breathing.exercises.478.instruction.1',
      'wellness.breathing.exercises.478.instruction.2',
      'wellness.breathing.exercises.478.instruction.3'
    ],
    benefits: [
      'wellness.breathing.exercises.478.benefit.1',
      'wellness.breathing.exercises.478.benefit.2'
    ]
  },
  {
    id: 'ujjayi',
    icon: Star,
    titleKey: 'wellness.breathing.exercises.ujjayi.title',
    descriptionKey: 'wellness.breathing.exercises.ujjayi.description',
    phases: [
      { key: 'inhale', duration: 5000 },
      { key: 'exhale', duration: 5000 }
    ],
    instructions: [
      'wellness.breathing.exercises.ujjayi.instruction.1',
      'wellness.breathing.exercises.ujjayi.instruction.2',
      'wellness.breathing.exercises.ujjayi.instruction.3'
    ],
    benefits: [
      'wellness.breathing.exercises.ujjayi.benefit.1',
      'wellness.breathing.exercises.ujjayi.benefit.2'
    ]
  },
  {
    id: 'kapalabhati',
    icon: Zap,
    titleKey: 'wellness.breathing.exercises.kapalabhati.title',
    descriptionKey: 'wellness.breathing.exercises.kapalabhati.description',
    phases: [
      { key: 'inhale', duration: 1000 },
      { key: 'exhale', duration: 500 }
    ],
    instructions: [
      'wellness.breathing.exercises.kapalabhati.instruction.1',
      'wellness.breathing.exercises.kapalabhati.instruction.2',
      'wellness.breathing.exercises.kapalabhati.instruction.3'
    ],
    benefits: [
      'wellness.breathing.exercises.kapalabhati.benefit.1',
      'wellness.breathing.exercises.kapalabhati.benefit.2'
    ]
  }
];

export function BreathingExercise() {
  const [selectedExercise, setSelectedExercise] = useState(breathingExercises[0]);
  const [isActive, setIsActive] = useState(false);
  const intl = useIntl();

  const handleExerciseChange = (exercise: typeof breathingExercises[0]) => {
    setSelectedExercise(exercise);
    setIsActive(false);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-4">
        {breathingExercises.map((exercise) => {
          const Icon = exercise.icon;
          const isSelected = selectedExercise.id === exercise.id;

          return (
            <button
              key={exercise.id}
              onClick={() => handleExerciseChange(exercise)}
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

      {selectedExercise && (
        <div className="text-center animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {intl.formatMessage({ id: selectedExercise.titleKey })}
          </h3>
          <p className="text-gray-600">
            {intl.formatMessage({ id: selectedExercise.descriptionKey })}
          </p>
        </div>
      )}

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <BaseBreathingExercise
          phases={selectedExercise.phases}
          instructions={selectedExercise.instructions}
          benefits={selectedExercise.benefits}
          exerciseId={selectedExercise.id}
          isActive={isActive}
          onActiveChange={setIsActive}
        />
      </div>
    </div>
  );
}