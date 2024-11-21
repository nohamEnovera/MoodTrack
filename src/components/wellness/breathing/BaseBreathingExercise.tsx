import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useIntl } from 'react-intl';
import { auth, db } from '../../../lib/firebase';
import { ref, push, serverTimestamp } from 'firebase/database';

interface Phase {
  key: string;
  duration: number;
}

interface BaseBreathingExerciseProps {
  phases: Phase[];
  instructions: string[];
  benefits: string[];
  exerciseId: string;
  isActive: boolean;
  onActiveChange: (active: boolean) => void;
}

export function BaseBreathingExercise({ 
  phases, 
  instructions, 
  benefits, 
  exerciseId,
  isActive,
  onActiveChange
}: BaseBreathingExerciseProps) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [exerciseTime, setExerciseTime] = useState(0);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const intl = useIntl();

  // Réinitialiser le compteur quand l'exercice change
  useEffect(() => {
    setExerciseTime(0);
    setExerciseCompleted(false);
    setCurrentPhase(0);
    setProgress(0);
  }, [exerciseId]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;
    let exerciseTimer: NodeJS.Timeout;

    if (isActive && phases && phases.length > 0) {
      const { duration } = phases[currentPhase];
      
      timer = setTimeout(() => {
        setCurrentPhase((prev) => (prev + 1) % phases.length);
        setProgress(0);
      }, duration);

      const interval = 16; // ~60fps pour une animation fluide
      progressTimer = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (interval / duration) * 100;
          return newProgress > 100 ? 100 : newProgress;
        });
      }, interval);

      // Timer pour suivre le temps total d'exercice
      exerciseTimer = setInterval(() => {
        setExerciseTime(prev => {
          const newTime = prev + 1;
          // Si l'exercice dépasse 10 secondes et n'est pas encore marqué comme complété
          if (newTime >= 10 && !exerciseCompleted) {
            setExerciseCompleted(true);
            saveExerciseCompletion(newTime);
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
      clearInterval(exerciseTimer);
    };
  }, [isActive, currentPhase, phases, exerciseCompleted, exerciseId]);

  const saveExerciseCompletion = async (duration: number) => {
    if (!auth.currentUser) return;

    try {
      const completionsRef = ref(db, `users/${auth.currentUser.uid}/breathingExercises`);
      await push(completionsRef, {
        exerciseId,
        timestamp: serverTimestamp(),
        duration
      });
    } catch (error) {
      console.error('Error saving breathing exercise completion:', error);
    }
  };

  const handleReset = () => {
    onActiveChange(false);
    setCurrentPhase(0);
    setProgress(0);
    setExerciseTime(0);
    setExerciseCompleted(false);
  };

  // Calculer la taille et l'opacité du cercle en fonction de la phase
  const getCircleStyle = () => {
    if (!phases || phases.length === 0 || currentPhase >= phases.length) {
      return {
        transform: 'scale(0.6)',
        opacity: 0.8
      };
    }

    const phase = phases[currentPhase].key;
    const baseScale = 0.6;
    const maxScale = 1.2;
    
    switch (phase) {
      case 'inhale':
        return {
          transform: `scale(${baseScale + ((maxScale - baseScale) * progress / 100)})`,
          opacity: 0.8 + (0.2 * progress / 100)
        };
      case 'hold':
        return {
          transform: `scale(${maxScale})`,
          opacity: 1
        };
      case 'exhale':
        return {
          transform: `scale(${maxScale - ((maxScale - baseScale) * progress / 100)})`,
          opacity: 1 - (0.2 * progress / 100)
        };
      case 'rest':
        return {
          transform: `scale(${baseScale})`,
          opacity: 0.8
        };
      default:
        return {
          transform: `scale(${baseScale})`,
          opacity: 0.8
        };
    }
  };

  const circleStyle = getCircleStyle();

  if (!phases || phases.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="relative flex items-center justify-center h-48">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute w-48 h-48 rounded-full bg-violet-50" />
          
          <div 
            className="absolute w-48 h-48 rounded-full bg-violet-500/20 transition-all duration-200 ease-in-out"
            style={{
              ...circleStyle,
              transitionProperty: 'transform, opacity'
            }}
          />
          
          <div 
            className="absolute w-48 h-48 rounded-full border-4 border-violet-500 transition-all duration-200 ease-in-out"
            style={{
              ...circleStyle,
              transitionProperty: 'transform, opacity'
            }}
          />
        </div>
        <div className="relative z-10 text-center">
          <p className="text-2xl font-medium text-violet-600">
            {intl.formatMessage({ id: `wellness.breathing.phase.${phases[currentPhase].key}` })}
          </p>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => onActiveChange(!isActive)}
          className="btn btn-primary w-12 h-12 !p-0 flex items-center justify-center"
          title={intl.formatMessage({ 
            id: isActive ? 'wellness.breathing.pause' : 'wellness.breathing.start' 
          })}
        >
          {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        <button
          onClick={handleReset}
          className="btn bg-gray-100 text-gray-600 hover:bg-gray-200 w-12 h-12 !p-0 flex items-center justify-center"
          title={intl.formatMessage({ id: 'wellness.breathing.reset' })}
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="bg-violet-50 rounded-lg p-4">
          <h4 className="font-medium text-violet-800 mb-2">
            {intl.formatMessage({ id: 'wellness.breathing.instructions' })}
          </h4>
          <ul className="space-y-2 text-sm text-violet-600">
            {instructions.map((instruction, index) => (
              <li key={index} className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                <span>{intl.formatMessage({ id: instruction })}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-emerald-50 rounded-lg p-4">
          <h4 className="font-medium text-emerald-800 mb-2">
            {intl.formatMessage({ id: 'wellness.breathing.benefits' })}
          </h4>
          <ul className="space-y-2 text-sm text-emerald-600">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>{intl.formatMessage({ id: benefit })}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}