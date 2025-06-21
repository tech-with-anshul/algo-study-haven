
import { useState, useEffect } from 'react';

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

export function useGameSystem(gameState: GameState, updateGameState: (updates: Partial<GameState>) => Promise<void>) {
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

  const addXP = async (amount: number, reason: string = '') => {
    const newXP = gameState.xp + amount;
    const newLevel = Math.floor(newXP / 1000) + 1;
    const leveledUp = newLevel > gameState.level;
    
    const newAchievements = [...gameState.achievements];
    if (leveledUp) {
      newAchievements.push(`🎉 Reached Level ${newLevel}!`);
      if (newLevel === 10) newAchievements.push('🗡️ Logic Adventurer Unlocked!');
      if (newLevel === 20) newAchievements.push('🛡️ Data Knight Unlocked!');
      if (newLevel === 30) newAchievements.push('🧙‍♂️ Code Wizard Unlocked!');
    }
    
    if (reason) {
      newAchievements.push(`💫 ${reason} (+${amount} XP)`);
    }

    await updateGameState({
      xp: newXP,
      level: newLevel,
      achievements: newAchievements.slice(-10) // Keep last 10 achievements
    });
  };

  const updateStreak = async () => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (gameState.lastStudyDate === yesterday) {
      // Continue streak
      await updateGameState({
        streak: gameState.streak + 1,
        lastStudyDate: today
      });
      await addXP(50, 'Streak Bonus');
    } else if (gameState.lastStudyDate !== today) {
      // Start new streak or reset
      const newStreak = gameState.lastStudyDate === '' ? 1 : 1;
      await updateGameState({
        streak: newStreak,
        lastStudyDate: today
      });
    }
  };

  const updateQuestProgress = (questId: string, progress: number) => {
    setQuests(prev => prev.map(quest => 
      quest.id === questId 
        ? { ...quest, progress: Math.min(progress, quest.target) }
        : quest
    ));
  };

  const completeQuest = async (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (quest && !quest.completed) {
      await addXP(quest.xpReward, `Quest: ${quest.title}`);
      setQuests(prev => prev.map(q => 
        q.id === questId ? { ...q, completed: true } : q
      ));
      await updateGameState({
        completedQuests: [...gameState.completedQuests, questId]
      });
    }
  };

  const onSubtopicComplete = async () => {
    await addXP(50, 'Subtopic Mastered');
    updateQuestProgress('complete-topic', 1);
  };

  const onTopicComplete = async () => {
    await addXP(200, 'Topic Conquered');
    await completeQuest('complete-topic');
  };

  const onStudySession = async (duration: number) => {
    await addXP(Math.floor(duration / 60), 'Study Time'); // 1 XP per minute
    await updateStreak();
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
