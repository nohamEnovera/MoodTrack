import React from 'react';
import { BaseBreathingExercise } from './BaseBreathingExercise';

export function DiaphragmaticBreathing() {
  const phases = [
    { key: 'inhale', duration: 4000 },
    { key: 'exhale', duration: 6000 }
  ];

  const instructions = [
    'wellness.breathing.exercises.diaphragmatic.instruction.1',
    'wellness.breathing.exercises.diaphragmatic.instruction.2',
    'wellness.breathing.exercises.diaphragmatic.instruction.3'
  ];

  const benefits = [
    'wellness.breathing.exercises.diaphragmatic.benefit.1',
    'wellness.breathing.exercises.diaphragmatic.benefit.2'
  ];

  return (
    <BaseBreathingExercise
      phases={phases}
      instructions={instructions}
      benefits={benefits}
    />
  );
}