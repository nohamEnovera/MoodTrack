import React from 'react';
import { BaseBreathingExercise } from './BaseBreathingExercise';

export function MindfulBreathing() {
  const phases = [
    { key: 'inhale', duration: 4000 },
    { key: 'exhale', duration: 4000 }
  ];

  const instructions = [
    'wellness.breathing.exercises.mindful.instruction.1',
    'wellness.breathing.exercises.mindful.instruction.2',
    'wellness.breathing.exercises.mindful.instruction.3',
    'wellness.breathing.exercises.mindful.instruction.4'
  ];

  const benefits = [
    'wellness.breathing.exercises.mindful.benefit.1',
    'wellness.breathing.exercises.mindful.benefit.2'
  ];

  return (
    <BaseBreathingExercise
      phases={phases}
      instructions={instructions}
      benefits={benefits}
    />
  );
}