
import { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface TimerState {
  time: number;
  isRunning: boolean;
  sessionStartTime: number | null;
}

export function useTimer() {
  const [timerState, setTimerState] = useLocalStorage<TimerState>('dsa-timer', {
    time: 0,
    isRunning: false,
    sessionStartTime: null
  });
  
  const [currentTime, setCurrentTime] = useState(timerState.time);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerState.isRunning && timerState.sessionStartTime) {
      const elapsed = Math.floor((Date.now() - timerState.sessionStartTime) / 1000);
      setCurrentTime(timerState.time + elapsed);
      
      intervalRef.current = setInterval(() => {
        const newElapsed = Math.floor((Date.now() - timerState.sessionStartTime!) / 1000);
        setCurrentTime(timerState.time + newElapsed);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState.isRunning, timerState.sessionStartTime, timerState.time]);

  const startTimer = () => {
    setTimerState({
      ...timerState,
      isRunning: true,
      sessionStartTime: Date.now()
    });
  };

  const pauseTimer = () => {
    if (timerState.sessionStartTime) {
      const elapsed = Math.floor((Date.now() - timerState.sessionStartTime) / 1000);
      setTimerState({
        time: timerState.time + elapsed,
        isRunning: false,
        sessionStartTime: null
      });
    }
  };

  const resetTimer = () => {
    setTimerState({
      time: 0,
      isRunning: false,
      sessionStartTime: null
    });
    setCurrentTime(0);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    time: currentTime,
    isRunning: timerState.isRunning,
    formatTime,
    startTimer,
    pauseTimer,
    resetTimer
  };
}
