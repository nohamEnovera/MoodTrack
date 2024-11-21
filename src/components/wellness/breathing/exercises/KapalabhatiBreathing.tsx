import React from 'react';
import { BaseBreathingExercise } from './BaseBreathingExercise';

export function KapalabhatiBreathing() {
  const phases = [
    { key: 'inhale', duration: 1000 },
    { key: 'exhale', duration: 500 }
  ];

  const instructions = [
    'wellness.breathing.exercises.kapalabhati.instruction.1',
    'wellness.breathing.exercises.kapalabhati.instruction.2',
    'wellness.breathing.exercises.kapalabhati.instruction.3'
  ];

  const benefits = [
    'wellness.breathing.exercises.kapalabhati.benefit.1',
    'wellness.breathing.exercises.kapalabhati.benefit.2'
  ];

  return (
    <BaseBreathingExercise
      phases={phases}
      instructions={instructions}
      benefits={benefits}
    />
  );
}