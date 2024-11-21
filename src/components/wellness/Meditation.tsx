import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import { useIntl } from 'react-intl';
import { useMeditationAudio } from '../../services/audioService';

export function Meditation() {
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isMuted, setIsMuted] = useState(false);
  const intl = useIntl();
  const audio = useMeditationAudio(duration);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      
      if (!audio.isLoading) {
        audio.play().catch(() => {
          console.warn('Audio playback failed, continuing without sound');
        });
      }
    } else {
      audio.pause();
    }

    if (timeLeft === 0) {
      setIsActive(false);
    }

    return () => {
      clearTimeout(timer);
      audio.pause();
    };
  }, [isActive, timeLeft, audio]);

  useEffect(() => {
    audio.setVolume(isMuted ? 0 : 0.5);
  }, [isMuted, audio]);

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
    audio.pause();
  };

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration);
    setTimeLeft(newDuration * 60);
    setIsActive(false);
    audio.pause();
  };

  const handleTrackChange = async (action: 'next' | 'previous') => {
    setIsActive(false);
    if (action === 'next') {
      await audio.nextTrack();
    } else {
      await audio.previousTrack();
    }
    if (isActive) {
      setIsActive(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">
          {intl.formatMessage({ id: 'wellness.meditation.title' })}
        </h3>
        <p className="text-gray-600">
          {intl.formatMessage({ id: 'wellness.meditation.description' })}
        </p>
      </div>

      <div className="flex justify-center">
        <div className="relative">
          <div className="w-48 h-48 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
            <div className="text-4xl font-bold text-violet-600">
              {formatTime(timeLeft)}
            </div>
          </div>
          {isActive && (
            <div className="absolute inset-0 rounded-full border-4 border-violet-500/30 border-t-violet-500 animate-spin" />
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => handleTrackChange('previous')}
            className="btn bg-violet-100 text-violet-600 hover:bg-violet-200 w-12 h-12 !p-0 flex items-center justify-center"
            title={intl.formatMessage({ id: 'wellness.meditation.previous' })}
            disabled={audio.isLoading}
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsActive(!isActive)}
            disabled={audio.isLoading}
            className="btn btn-primary w-12 h-12 !p-0 flex items-center justify-center"
            title={intl.formatMessage({ 
              id: isActive ? 'wellness.meditation.pause' : 'wellness.meditation.start' 
            })}
          >
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>

          <button
            onClick={handleReset}
            className="btn bg-gray-100 text-gray-600 hover:bg-gray-200 w-12 h-12 !p-0 flex items-center justify-center"
            title={intl.formatMessage({ id: 'wellness.meditation.reset' })}
            disabled={audio.isLoading}
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => handleTrackChange('next')}
            className="btn bg-violet-100 text-violet-600 hover:bg-violet-200 w-12 h-12 !p-0 flex items-center justify-center"
            title={intl.formatMessage({ id: 'wellness.meditation.next' })}
            disabled={audio.isLoading}
          >
            <SkipForward className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`btn w-12 h-12 !p-0 flex items-center justify-center ${
              isMuted 
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                : 'bg-violet-100 text-violet-600 hover:bg-violet-200'
            }`}
            disabled={audio.isLoading}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex justify-center space-x-4">
          {[5, 10, 15].map(minutes => (
            <button
              key={minutes}
              onClick={() => handleDurationChange(minutes)}
              disabled={audio.isLoading}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                duration === minutes
                  ? 'bg-violet-100 text-violet-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {minutes} {intl.formatMessage({ id: 'wellness.meditation.minutes' })}
            </button>
          ))}
        </div>

        <div className="text-center text-sm text-violet-600">
          {intl.formatMessage(
            { id: 'wellness.meditation.track' },
            { current: audio.currentTrackIndex, total: audio.totalTracks }
          )}
        </div>
      </div>
    </div>
  );
}