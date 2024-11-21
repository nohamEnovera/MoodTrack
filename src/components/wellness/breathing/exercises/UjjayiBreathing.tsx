import React from 'react';
import { BaseBreathingExercise } from './BaseBreathingExercise';

export function UjjayiBreathing() {
  const phases = [
    { key: 'inhale', duration: 5000 },
    { key: 'exhale', duration: 5000 }
  ];

  const instructions = [
    'wellness.breathing.exercises.ujjayi.instruction.1',
    'wellness.breathing.exercises.ujjayi.instruction.2',
    'wellness.breathing.exercises.ujjayi.instruction.3'
  ];

  const benefits = [
    'wellness.breathing.exercises.ujjayi.benefit.1',
    'wellness.breathing.exercises.ujjayi.benefit.2'
  ];

  return (
    <BaseBreathingExercise
      phases={phases}
      instructions={instructions}
      benefits={benefits}
    />
  );
}