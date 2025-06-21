
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

interface Progress {
  [topicId: string]: {
    [subtopicId: string]: boolean;
  };
}

interface SessionNote {
  id: string;
  date: string;
  duration: number;
  note: string;
  topic: string;
  formattedDuration: string;
}

interface GameState {
  xp: number;
  level: number;
  streak: number;
  lastStudyDate: string;
  achievements: string[];
  completedQuests: string[];
}

export function useSupabaseData() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Progress>({});
  const [sessionNotes, setSessionNotes] = useState<SessionNote[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    xp: 0,
    level: 1,
    streak: 0,
    lastStudyDate: '',
    achievements: [],
    completedQuests: []
  });
  const [loading, setLoading] = useState(true);

  // Load user data from Supabase
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Load progress
      const { data: progressData } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', user.id);

      // Transform progress data
      const progressMap: Progress = {};
      progressData?.forEach((item) => {
        if (!progressMap[item.topic_id]) {
          progressMap[item.topic_id] = {};
        }
        progressMap[item.topic_id][item.subtopic_id] = item.completed;
      });
      setProgress(progressMap);

      // Load session notes
      const { data: sessionsData } = await supabase
        .from('session_notes')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      const formattedSessions = sessionsData?.map((session) => ({
        id: session.id,
        date: session.date,
        duration: session.duration,
        note: session.note || '',
        topic: session.topic || '',
        formattedDuration: formatTime(session.duration)
      })) || [];
      setSessionNotes(formattedSessions);

      // Load game state
      const { data: gameData } = await supabase
        .from('game_state')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (gameData) {
        setGameState({
          xp: gameData.xp,
          level: gameData.level,
          streak: gameData.streak,
          lastStudyDate: gameData.last_study_date || '',
          achievements: gameData.achievements || [],
          completedQuests: gameData.completed_quests || []
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast({
        title: "Error Loading Data",
        description: "Failed to load your progress. Please try refreshing.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const updateProgress = async (topicId: string, subtopicId: string, completed: boolean) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('progress')
        .upsert({
          user_id: user.id,
          topic_id: topicId,
          subtopic_id: subtopicId,
          completed,
          completed_at: completed ? new Date().toISOString() : null
        });

      if (error) throw error;

      setProgress(prev => ({
        ...prev,
        [topicId]: {
          ...prev[topicId],
          [subtopicId]: completed
        }
      }));
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: "Error Saving Progress",
        description: "Failed to save your progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  const saveSessionNote = async (sessionData: Omit<SessionNote, 'id' | 'formattedDuration'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('session_notes')
        .insert({
          user_id: user.id,
          date: sessionData.date,
          duration: sessionData.duration,
          note: sessionData.note,
          topic: sessionData.topic
        })
        .select()
        .single();

      if (error) throw error;

      const newSession = {
        ...data,
        formattedDuration: formatTime(data.duration)
      };

      setSessionNotes(prev => [newSession, ...prev]);
    } catch (error) {
      console.error('Error saving session:', error);
      toast({
        title: "Error Saving Session",
        description: "Failed to save your study session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateGameState = async (updates: Partial<GameState>) => {
    if (!user) return;

    try {
      const newGameState = { ...gameState, ...updates };

      const { error } = await supabase
        .from('game_state')
        .upsert({
          user_id: user.id,
          xp: newGameState.xp,
          level: newGameState.level,
          streak: newGameState.streak,
          last_study_date: newGameState.lastStudyDate || null,
          achievements: newGameState.achievements,
          completed_quests: newGameState.completedQuests,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setGameState(newGameState);
    } catch (error) {
      console.error('Error updating game state:', error);
      toast({
        title: "Error Saving Game State",
        description: "Failed to save your game progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    progress,
    sessionNotes,
    gameState,
    loading,
    updateProgress,
    saveSessionNote,
    updateGameState,
    refreshData: loadUserData
  };
}
