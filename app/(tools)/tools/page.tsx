'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { SidebarToggle } from '@/components/sidebar-toggle';
import { useIsMobile } from '@/hooks/use-mobile';

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface AuthStatus {
  authenticated: boolean;
  user: User | null;
}

export default function BehaviouralToolsPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const isMobile = useIsMobile();

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/dashboard');
      if (response.ok) {
        const data: AuthStatus = await response.json();
        setAuthStatus(data);
      } else {
        setAuthStatus({ authenticated: false, user: null });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setAuthStatus({ authenticated: false, user: null });
    } finally {
      setIsLoadingAuth(false);
    }
  }, []);

  const meditationTracks = useMemo(
    () => [
      {
        id: 1,
        title: '🧘 Breathing Exercise',
        duration: '04:36',
        url: '/musics/breathing-exercise.mp3',
      },
      {
        id: 2,
        title: '🌙 Evening Relax',
        duration: '01:57',
        url: '/musics/dawn-of-change.mp3',
      },
    ],
    [],
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = async () => {
    if (audioElement) {
      try {
        if (isPlaying) {
          audioElement.pause();
          setIsPlaying(false);
        } else {
          setIsLoading(true);
          await audioElement.play();
          setIsPlaying(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
        setIsLoading(false);
        alert(
          'Unable to play audio. Please check your internet connection or try a different track.',
        );
      }
    }
  };

  const handleNext = useCallback(() => {
    setCurrentTrack((prev) => (prev + 1) % meditationTracks.length);
  }, [meditationTracks.length]);

  const handlePrevious = () => {
    setCurrentTrack(
      (prev) => (prev - 1 + meditationTracks.length) % meditationTracks.length,
    );
  };

  const handleTrackSelect = (index: number) => {
    setCurrentTrack(index);
    if (audioElement) {
      audioElement.pause();
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    const audio = new Audio();
    setAudioElement(audio);
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    if (audioElement && meditationTracks[currentTrack]) {
      setIsLoading(true);
      audioElement.src = meditationTracks[currentTrack].url;
      audioElement.load();
      const handleError = () => {
        setIsLoading(false);
        alert('Failed to load audio. Please try a different track.');
      };
      const handleCanPlay = () => setIsLoading(false);
      audioElement.addEventListener('error', handleError);
      audioElement.addEventListener('canplay', handleCanPlay);
      return () => {
        audioElement.removeEventListener('error', handleError);
        audioElement.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, [currentTrack, audioElement, meditationTracks]);

  useEffect(() => {
    if (!audioElement) return;
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      handleNext();
    };
    const handleTimeUpdate = () => setCurrentTime(audioElement.currentTime);
    const handleLoadedMetadata = () => setDuration(audioElement.duration);
    audioElement.addEventListener('play', handlePlay);
    audioElement.addEventListener('pause', handlePause);
    audioElement.addEventListener('ended', handleEnded);
    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => {
      audioElement.removeEventListener('play', handlePlay);
      audioElement.removeEventListener('pause', handlePause);
      audioElement.removeEventListener('ended', handleEnded);
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [audioElement, handleNext]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseInt(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (audioElement) audioElement.volume = newVolume / 100;
  };

  const handleMute = () => {
    if (audioElement) {
      if (isMuted) {
        audioElement.volume = volume / 100;
        setIsMuted(false);
      } else {
        audioElement.volume = 0;
        setIsMuted(true);
      }
    }
  };

  useEffect(() => {
    const savedMusicState = localStorage.getItem('tools-music-state');
    if (savedMusicState) {
      try {
        const musicState = JSON.parse(savedMusicState);
        setCurrentTrack(musicState.currentTrack ?? 0);
        setVolume(musicState.volume ?? 80);
        setIsMuted(musicState.isMuted ?? false);
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    const musicState = {
      currentTrack,
      volume,
      isMuted,
    };
    localStorage.setItem('tools-music-state', JSON.stringify(musicState));
  }, [currentTrack, volume, isMuted]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  if (isLoadingAuth || authStatus === null) {
    return (
      <div className="p-2 md:p-4 lg:p-6 space-y-6 md:space-y-8">
        {isMobile ? <SidebarToggle /> : <div />}
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  if (!authStatus.authenticated) {
    return (
      <div className="p-2 md:p-4 lg:p-6 space-y-6 md:space-y-8">
        {isMobile ? <SidebarToggle /> : <div />}
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Please sign in</h2>
            <p className="text-muted-foreground">
              You need to be signed in to access Behavioural Tools.
            </p>
            <div className="mt-2">
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Go to Login
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-4 lg:p-6 space-y-6 md:space-y-8">
      {isMobile ? <SidebarToggle /> : <div />}

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
          Behavioural Tools
        </h1>
        <p className="text-muted-foreground mb-6">
          Guided practices to support your wellbeing and reflection.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 md:gap-6">
          {/* Guided Meditation - 40% */}
          <div className="lg:col-span-4">
            <Card className="h-full">
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="size-10 bg-gradient-to-br from-indigo-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg font-bold">🧘</span>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        Guided Meditation
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        Take a moment to pause, breathe deep, and reset
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2">
                  {meditationTracks.map((track, index) => (
                    <button
                      key={track.id}
                      type="button"
                      className={`w-full p-2 rounded-lg cursor-pointer transition-colors text-left ${
                        index === currentTrack
                          ? 'bg-blue-500 text-white'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                      onClick={() => handleTrackSelect(index)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1 min-w-0 min-h-5">
                          <p className="font-medium text-sm truncate">
                            {track.title}
                          </p>
                        </div>
                        <span className="text-xs opacity-70 ml-2">
                          {track.duration}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="font-medium text-sm truncate text-green-800">
                    {meditationTracks[currentTrack]?.title}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          duration > 0 ? (currentTime / duration) * 100 : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={handlePrevious}>
                      <SkipBack size={14} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handlePlayPause}
                      className="size-10"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full size-4 border-b-2 border-gray-900" />
                      ) : isPlaying ? (
                        <Pause size={16} />
                      ) : (
                        <Play size={16} />
                      )}
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleNext}>
                      <SkipForward size={14} />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={handleMute}>
                      {isMuted ? (
                        <VolumeX size={14} />
                      ) : (
                        <Volume2 size={14} />
                      )}
                    </Button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Journaling - 60% */}
          <div className="lg:col-span-6">
            <Card className="h-full">
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="size-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg font-bold">📔</span>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        Daily Journaling
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        Reflect, grow, and track your personal journey
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground">
                    Why Daily Journaling Matters:
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>
                        <strong>Self-Reflection:</strong> Pause, reflect, and
                        think about your day.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>
                        <strong>Goal Tracking:</strong> Monitor your progress
                        and celebrate small wins.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>
                        <strong>Habits and Patterns:</strong> Identify recurring
                        patterns in your behavior.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>
                        <strong>Clarity:</strong> Organize your thoughts and
                        improve decision-making.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>
                        <strong>Positivity:</strong> Prepare for the next day
                        with a positive mindset.
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="pt-2">
                  <Button
                    onClick={() =>
                      window.open(
                        '/journey/sessions/8/a/daily-journaling',
                        '_blank',
                      )
                    }
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                  >
                    Begin Journaling Now
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  <p>
                    Spend 10 minutes each day to journal, practice gratitude,
                    and reflect on your journey.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
