import { useEffect, useRef, useState } from 'react';

const checkFileExists = async (filePath: string): Promise<boolean> => {
  try {
    const response = await fetch(filePath, { method: 'HEAD' });

    // Vérifiez le type MIME pour s'assurer que c'est bien un fichier audio
    const contentType = response.headers.get('Content-Type');
    if (response.ok && contentType && contentType.includes('audio/wav')) {
      return true; // Le fichier existe et est bien un fichier audio
    }

    return false; // Fichier non trouvé ou type MIME incorrect
  } catch (error) {
    console.error('Erreur lors de la vérification du fichier :', error);
    return false;
  }
};

// Fonction pour obtenir la liste des pistes pour une durée donnée
const getMeditationTracks = async (duration: number): Promise<string[]> => {
  let trackNumber = 1;
  const tracks: string[] = [];

  while (true) {
    const trackPath = `/audio/meditation/${duration}min/track-${trackNumber}.wav`;
    const exists = await checkFileExists(trackPath); // Vérifie si le fichier existe
    if (!exists) {
      break; // Sortir de la boucle si le fichier n'existe pas
    }

    tracks.push(trackPath);
    trackNumber++;
  }

  // Si aucune piste valide n'a été trouvée, retourner une valeur par défaut
  return tracks.length > 0 ? tracks : [`/audio/meditation/${duration}min/track-1.wav`];
};

export function useMeditationAudio(duration: number = 5) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [tracks, setTracks] = useState<string[]>([]);

  // Charger les pistes lorsque `duration` change
  useEffect(() => {
    const loadTracks = async () => {
      const availableTracks = await getMeditationTracks(duration);
      setTracks(availableTracks);
    };

    loadTracks();
  }, [duration]);

  // Initialiser l'audio lorsqu'un track est chargé ou change
  useEffect(() => {
    const initAudio = () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      if (tracks.length > 0) {
        audioRef.current = new Audio(tracks[currentTrackIndex]);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.5;
      }
    };

    initAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [tracks, currentTrackIndex]);

  const play = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play();
      } catch (error) {
        console.error('Failed to play audio:', error);
      }
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const setVolume = (volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  };

  const nextTrack = () => {
    if (tracks.length > 0) {
      const newIndex = (currentTrackIndex + 1) % tracks.length;
      setCurrentTrackIndex(newIndex);
    }
  };

  const previousTrack = () => {
    if (tracks.length > 0) {
      const newIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
      setCurrentTrackIndex(newIndex);
    }
  };

  return {
    play,
    pause,
    setVolume,
    nextTrack,
    previousTrack,
    currentTrackIndex: currentTrackIndex + 1,
    totalTracks: tracks.length,
  };
}
