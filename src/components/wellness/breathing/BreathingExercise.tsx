import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { BreathingExerciseSelector } from './BreathingExerciseSelector';
import { MindfulBreathing } from './exercises/MindfulBreathing';
import { DiaphragmaticBreathing } from './exercises/DiaphragmaticBreathing';
import { BoxBreathing } from './exercises/BoxBreathing';
import { AlternateBreathing } from './exercises/AlternateBreathing';
import { Breathing478 } from './exercises/Breathing478';
import { UjjayiBreathing } from './exercises/UjjayiBreathing';
import { KapalabhatiBreathing } from './exercises/KapalabhatiBreathing';

export function BreathingExercise() {
  const [selectedExercise, setSelectedExercise] = useState('mindful');
  const intl = useIntl();

  const renderExercise = () => {
    switch (selectedExercise) {
      case 'mindful':
        return <MindfulBreathing />;
      case 'diaphragmatic':
        return <DiaphragmaticBreathing />;
      case 'box':
        return <BoxBreathing />;
      case 'alternate':
        return <AlternateBreathing />;
      case '478':
        return <Breathing478 />;
      case 'ujjayi':
        return <UjjayiBreathing />;
      case 'kapalabhati':
        return <KapalabhatiBreathing />;
      default:
        return <MindfulBreathing />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">
          {intl.formatMessage({ id: 'wellness.breathing.exercise.title' })}
        </h3>
        <p className="text-gray-600">
          {intl.formatMessage({ id: 'wellness.breathing.exercise.description' })}
        </p>
      </div>

      <BreathingExerciseSelector
        selectedExercise={selectedExercise}
        onSelectExercise={setSelectedExercise}
      />

      <div className="bg-white rounded-xl p-6 shadow-sm">
        {renderExercise()}
      </div>
    </div>
  );
}