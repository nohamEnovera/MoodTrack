import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useIntl } from 'react-intl';

interface Phase {
  key: string;
  duration: number;
}

interface BaseBreathingExerciseProps {
  phases: Phase[];
  instructions: string[];
  benefits: string[];
}

export function BaseBreathingExercise({ phases, instructions, benefits }: BaseBreathingExerciseProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const intl = useIntl();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;

    if (isActive) {
      const { duration } = phases[currentPhase];
      
      timer = setTimeout(() => {
        setCurrentPhase((prev) => (prev + 1) % phases.length);
        setProgress(0);
      }, duration);

      const interval = 100;
      progressTimer = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (interval / duration) * 100;
          return newProgress > 100 ? 100 : newProgress;
        });
      }, interval);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [isActive, currentPhase, phases]);

  const handleReset = () => {
    setIsActive(false);
    setCurrentPhase(0);
    setProgress(0);
  };

  return (
    <div className="space-y-6">
      <div className="relative flex items-center justify-center h-48">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full bg-violet-50 transition-all duration-300 transform scale-75" />
          <div 
            className="absolute w-48 h-48 rounded-full border-4 border-violet-500 transition-all duration-300"
            style={{
              clipPath: `inset(0 ${100 - progress}% 0 0)`,
              transform: `scale(${0.75 + (progress * 0.25) / 100})`
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
          onClick={() => setIsActive(!isActive)}
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