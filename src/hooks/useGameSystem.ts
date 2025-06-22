
import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface GameState {
  xp: number;
  level: number;
  streak: number;
  lastStudyDate: string;
  achievements: string[];
  completedQuests: string[];
}

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'epic';
  xpReward: number;
  progress: number;
  target: number;
  completed: boolean;
  icon: string;
}

export function useGameSystem() {
  const [gameState, setGameState] = useLocalStorage<GameState>('dsa-game-state', {
    xp: 0,
    level: 1,
    streak: 0,
    lastStudyDate: '',
    achievements: [],
    completedQuests: []
  });

  const [quests, setQuests] = useState<Quest[]>([
    {
      id: 'daily-study',
      title: '⚔️ Daily Warrior',
      description: 'Study for at least 30 minutes today',
      type: 'daily',
      xpReward: 100,
      progress: 0,
      target: 1800, // 30 minutes in seconds
      completed: false,
      icon: '⚔️'
    },
    {
      id: 'complete-topic',
      title: '🏆 Topic Conqueror',
      description: 'Complete an entire DSA topic',
      type: 'weekly',
      xpReward: 500,
      progress: 0,
      target: 1,
      completed: false,
      icon: '🏆'
    },
    {
      id: 'streak-master',
      title: '🔥 Streak Master',
      description: 'Maintain a 7-day study streak',
      type: 'epic',
      xpReward: 1000,
      progress: 0,
      target: 7,
      completed: false,
      icon: '🔥'
    }
  ]);

  const addXP = (amount: number, reason: string = '') => {
    setGameState(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 1000) + 1;
      const leveledUp = newLevel > prev.level;
      
      const newAchievements = [...prev.achievements];
      if (leveledUp) {
        newAchievements.push(`🎉 Reached Level ${newLevel}!`);
        if (newLevel === 10) newAchievements.push('🗡️ Logic Adventurer Unlocked!');
        if (newLevel === 20) newAchievements.push('🛡️ Data Knight Unlocked!');
        if (newLevel === 30) newAchievements.push('🧙‍♂️ Code Wizard Unlocked!');
      }
      
      if (reason) {
        newAchievements.push(`💫 ${reason} (+${amount} XP)`);
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        achievements: newAchievements.slice(-10) // Keep last 10 achievements
      };
    });
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (gameState.lastStudyDate === yesterday) {
      // Continue streak
      setGameState(prev => ({
        ...prev,
        streak: prev.streak + 1,
        lastStudyDate: today
      }));
      addXP(50, 'Streak Bonus');
    } else if (gameState.lastStudyDate !== today) {
      // Start new streak or reset
      const newStreak = gameState.lastStudyDate === '' ? 1 : 1;
      setGameState(prev => ({
        ...prev,
        streak: newStreak,
        lastStudyDate: today
      }));
    }
  };

  const updateQuestProgress = (questId: string, progress: number) => {
    setQuests(prev => prev.map(quest => 
      quest.id === questId 
        ? { ...quest, progress: Math.min(progress, quest.target) }
        : quest
    ));
  };

  const completeQuest = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (quest && !quest.completed) {
      addXP(quest.xpReward, `Quest: ${quest.title}`);
      setQuests(prev => prev.map(q => 
        q.id === questId ? { ...q, completed: true } : q
      ));
      setGameState(prev => ({
        ...prev,
        completedQuests: [...prev.completedQuests, questId]
      }));
    }
  };

  const onSubtopicComplete = () => {
    addXP(50, 'Subtopic Mastered');
    updateQuestProgress('complete-topic', 1);
  };

  const onTopicComplete = () => {
    addXP(200, 'Topic Conquered');
    completeQuest('complete-topic');
  };

  const onStudySession = (duration: number) => {
    addXP(Math.floor(duration / 60), 'Study Time'); // 1 XP per minute
    updateStreak();
    updateQuestProgress('daily-study', duration);
    updateQuestProgress('streak-master', gameState.streak + 1);
  };

  return {
    gameState,
    quests,
    addXP,
    updateStreak,
    completeQuest,
    onSubtopicComplete,
    onTopicComplete,
    onStudySession
  };
}
