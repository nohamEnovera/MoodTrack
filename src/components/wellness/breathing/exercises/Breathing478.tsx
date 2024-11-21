import React from 'react';
import { BaseBreathingExercise } from './BaseBreathingExercise';

export function Breathing478() {
  const phases = [
    { key: 'inhale', duration: 4000 },
    { key: 'hold', duration: 7000 },
    { key: 'exhale', duration: 8000 }
  ];

  const instructions = [
    'wellness.breathing.exercises.478.instruction.1',
    'wellness.breathing.exercises.478.instruction.2',
    'wellness.breathing.exercises.478.instruction.3'
  ];

  const benefits = [
    'wellness.breathing.exercises.478.benefit.1',
    'wellness.breathing.exercises.478.benefit.2'
  ];

  return (
    <BaseBreathingExercise
      phases={phases}
      instructions={instructions}
      benefits={benefits}
    />
  );
}