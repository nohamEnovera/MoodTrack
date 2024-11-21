import React from 'react';
import { BaseBreathingExercise } from './BaseBreathingExercise';

export function AlternateBreathing() {
  const phases = [
    { key: 'inhale', duration: 4000 },
    { key: 'hold', duration: 2000 },
    { key: 'exhale', duration: 4000 },
    { key: 'hold', duration: 2000 }
  ];

  const instructions = [
    'wellness.breathing.exercises.alternate.instruction.1',
    'wellness.breathing.exercises.alternate.instruction.2',
    'wellness.breathing.exercises.alternate.instruction.3',
    'wellness.breathing.exercises.alternate.instruction.4'
  ];

  const benefits = [
    'wellness.breathing.exercises.alternate.benefit.1',
    'wellness.breathing.exercises.alternate.benefit.2'
  ];

  return (
    <BaseBreathingExercise
      phases={phases}
      instructions={instructions}
      benefits={benefits}
    />
  );
}