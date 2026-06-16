'use client';

import { useCallback, useRef, useState } from 'react';

export const useAudio = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  const play = useCallback((url: string) => {
    // Stop audio đang phát nếu có
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(url);
    audioRef.current = audio;
    setCurrentUrl(url);

    audio.onplay = () => setIsPlaying(true);
    audio.onended = () => {
      setIsPlaying(false);
      setCurrentUrl(null);
    };
    audio.onerror = () => {
      setIsPlaying(false);
      setCurrentUrl(null);
    };

    audio.play().catch(() => {
      setIsPlaying(false);
      setCurrentUrl(null);
    });
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
      setCurrentUrl(null);
    }
  }, []);

  const isPlayingUrl = useCallback(
    (url: string) => isPlaying && currentUrl === url,
    [isPlaying, currentUrl]
  );

  return { play, stop, isPlaying, isPlayingUrl };
};
