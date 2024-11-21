import React from 'react';
import { BaseBreathingExercise } from './BaseBreathingExercise';

export function BoxBreathing() {
  const phases = [
    { key: 'inhale', duration: 4000 },
    { key: 'hold', duration: 4000 },
    { key: 'exhale', duration: 4000 },
    { key: 'rest', duration: 4000 }
  ];

  const instructions = [
    'wellness.breathing.exercises.box.instruction.1',
    'wellness.breathing.exercises.box.instruction.2',
    'wellness.breathing.exercises.box.instruction.3',
    'wellness.breathing.exercises.box.instruction.4'
  ];

  const benefits = [
    'wellness.breathing.exercises.box.benefit.1',
    'wellness.breathing.exercises.box.benefit.2'
  ];

  return (
    <BaseBreathingExercise
      phases={phases}
      instructions={instructions}
      benefits={benefits}
    />
  );
}