
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Moon, Sun, Upload, Download, Trophy, Target, Clock, BookOpen, Sparkles, Brain, Rocket } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useTimer } from '@/hooks/useTimer';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';
import { useGameSystem } from '@/hooks/useGameSystem';
import { dsaTopics } from '@/data/dsaTopics';
import TopicCard from './TopicCard';
import SessionModal from './SessionModal';
import GameStats from './GameStats';
import QuestSystem from './QuestSystem';
import AdventureTheme from './AdventureTheme';
import { toast } from '@/hooks/use-toast';

const DSATracker = () => {
  const [progress, setProgress] = useLocalStorage('dsa-progress', {});
  const [sessionNotes, setSessionNotes] = useLocalStorage('dsa-session-notes', []);
  const [darkMode, setDarkMode] = useLocalStorage('dark-mode', false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [isBreathing, setIsBreathing] = useState(false);
  
  const { time, isRunning, start, pause, stop, reset } = useTimer();
  const { syncToSheets, isLoading: isSyncing } = useGoogleSheets();
  const { gameState, quests, onSubtopicComplete, onTopicComplete, onStudySession, completeQuest } = useGameSystem();

  // Enhanced breathing animation with multiple states
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setIsBreathing(prev => !prev);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const toggleSubtopic = (topicId: string, subtopicId: string) => {
    const wasCompleted = progress[topicId]?.[subtopicId];
    
    setProgress(prev => ({
      ...prev,
      [topicId]: {
        ...prev[topicId],
        [subtopicId]: !prev[topicId]?.[subtopicId]
      }
    }));

    // Game system integration
    if (!wasCompleted) {
      onSubtopicComplete();
      
      // Check if topic is now complete
      const topic = dsaTopics.find(t => t.id === topicId);
      if (topic) {
        const completedCount = topic.subtopics.filter(sub => 
          progress[topicId]?.[sub.id] || sub.id === subtopicId
        ).length;
        
        if (completedCount === topic.subtopics.length) {
          onTopicComplete();
          // Celebration effect
          setTimeout(() => {
            toast({
              title: "🎉 EPIC ACHIEVEMENT!",
              description: `🏆 You've conquered the ${topic.name} realm! +200 XP`,
              duration: 5000,
            });
          }, 500);
        } else {
          toast({
            title: "⚔️ Victory!",
            description: "Subtopic mastered! +50 XP earned!",
            duration: 2000,
          });
        }
      }
    }
  };

  const calculateTopicProgress = (topicId: string) => {
    const topic = dsaTopics.find(t => t.id === topicId);
    if (!topic) return 0;
    
    const completed = topic.subtopics.filter(sub => 
      progress[topicId]?.[sub.id]
    ).length;
    
    return Math.round((completed / topic.subtopics.length) * 100);
  };

  const calculateOverallProgress = () => {
    const totalSubtopics = dsaTopics.reduce((acc, topic) => acc + topic.subtopics.length, 0);
    const completedSubtopics = dsaTopics.reduce((acc, topic) => {
      const completed = topic.subtopics.filter(sub => 
        progress[topic.id]?.[sub.id]
      ).length;
      return acc + completed;
    }, 0);
    
    return Math.round((completedSubtopics / totalSubtopics) * 100);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSessionEnd = () => {
    if (time > 0) {
      setShowSessionModal(true);
    }
  };

  const saveSession = (note: string) => {
    const newSession = {
      id: Date.now(),
      date: new Date().toISOString(),
      duration: time,
      note: note,
      topic: currentTopic,
      formattedDuration: formatTime(time)
    };
    
    setSessionNotes(prev => [...prev, newSession]);
    onStudySession(time); // Game system integration
    reset();
    setCurrentTopic(null);
    setShowSessionModal(false);
    
    toast({
      title: "🎉 Epic Study Session Complete!",
      description: `Amazing work! You studied for ${formatTime(time)} and earned ${Math.floor(time / 60)} XP!`,
      duration: 4000,
    });
  };

  const handleGoogleSheetsSync = async () => {
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbxePhcjBRPyxlp2g3VT6DAfNIgX9xQV7Dt8IVNSPJV7J870fpPOevpN15mtTE3cJ8RZIA/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'syncProgress',
          progress,
          sessionNotes,
          topics: dsaTopics,
          gameState
        })
      });
      
      if (response.ok) {
        toast({
          title: "🔄 Sync Successful!",
          description: "Your adventure progress has been synced to Google Sheets",
          duration: 3000,
        });
      } else {
        throw new Error('Sync failed');
      }
    } catch (error) {
      toast({
        title: "❌ Sync Failed",
        description: "Check your connection to the realm!",
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  const exportData = () => {
    const exportData = {
      progress,
      sessionNotes,
      gameState,
      exportDate: new Date().toISOString(),
      totalStudyTime: sessionNotes.reduce((acc, session) => acc + session.duration, 0),
      overallProgress: calculateOverallProgress()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dsa-adventure-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "📁 Adventure Data Exported!",
      description: "Your coding journey has been saved for posterity!",
      duration: 2000,
    });
  };

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const overallProgress = calculateOverallProgress();
  const totalStudyTime = sessionNotes.reduce((acc, session) => acc + session.duration, 0);
  const completedTopics = dsaTopics.filter(topic => calculateTopicProgress(topic.id) === 100).length;

  return (
    <AdventureTheme level={gameState.level} xp={gameState.xp} streak={gameState.streak}>
      <div className="container mx-auto p-6 max-w-7xl relative z-10">
        {/* Epic Header */}
        <div className="flex items-center justify-between mb-8 p-8 bg-card/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-border/50 animate-fade-in relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 animate-pulse"></div>
          
          <div className="space-y-3 relative z-10">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-primary animate-pulse" />
              <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-scale-in">
                🗡️ DSA Adventure Quest
              </h1>
              <Sparkles className="h-6 w-6 text-yellow-500 animate-bounce" />
            </div>
            <p className="text-muted-foreground text-xl font-medium">Embark on an epic coding adventure! Conquer algorithms, master data structures! 🏰</p>
            <div className="flex items-center space-x-4 mt-4">
              <Badge variant="secondary" className="px-4 py-2 text-base hover:scale-105 transition-transform cursor-pointer bg-gradient-to-r from-green-100 to-emerald-100 border-green-300">
                <Trophy className="h-5 w-5 mr-2" />
                {completedTopics}/{dsaTopics.length} Realms Conquered
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-base hover:scale-105 transition-transform cursor-pointer border-primary/30 bg-gradient-to-r from-blue-50 to-indigo-50">
                <Target className="h-5 w-5 mr-2" />
                {overallProgress}% Quest Complete
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-base hover:scale-105 transition-transform cursor-pointer border-purple-500/30 bg-gradient-to-r from-purple-50 to-pink-50">
                <Rocket className="h-5 w-5 mr-2" />
                Level {gameState.level} Hero
              </Badge>
            </div>
          </div>
          
          <div className="flex space-x-3 relative z-10">
            <Button
              variant="outline"
              onClick={exportData}
              className="flex items-center space-x-2 hover:scale-105 transition-all duration-300 bg-background/50 backdrop-blur-sm border-2 hover:border-primary/50 hover:shadow-lg"
            >
              <Download className="h-5 w-5" />
              <span className="font-medium">Export Quest Data</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleGoogleSheetsSync}
              disabled={isSyncing}
              className="flex items-center space-x-2 hover:scale-105 transition-all duration-300 bg-background/50 backdrop-blur-sm border-2 hover:border-green-500/50 hover:shadow-lg"
            >
              <Upload className={`h-5 w-5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="font-medium">{isSyncing ? 'Syncing to Realm...' : 'Sync to Sheets'}</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              className="hover:scale-105 transition-all duration-300 bg-background/50 backdrop-blur-sm border-2 hover:border-yellow-500/50 hover:shadow-lg w-12 h-12"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Game Stats Dashboard */}
        <GameStats
          xp={gameState.xp}
          level={gameState.level}
          streak={gameState.streak}
          achievements={gameState.achievements}
          totalStudyTime={totalStudyTime}
          completedTopics={completedTopics}
        />

        {/* Quest System */}
        <QuestSystem quests={quests} onQuestComplete={completeQuest} />

        {/* Study Timer with Epic Styling */}
        <Card className="mb-8 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border-2 border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-500">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center text-cyan-600">
              <Clock className="h-7 w-7 mr-3 animate-pulse" />
              ⏰ Focus Chamber - Channel Your Inner Warrior!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center space-x-8">
              <div className={`text-6xl font-bold timer-display transition-all duration-500 ${isRunning && isBreathing ? 'scale-110 text-cyan-600 drop-shadow-lg animate-pulse' : 'scale-100'}`}>
                {formatTime(time)}
              </div>
              <div className="flex space-x-4">
                {!isRunning ? (
                  <Button 
                    size="lg" 
                    onClick={start} 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-lg px-8 py-4 hover:scale-110 transition-all duration-300 shadow-xl"
                  >
                    <Play className="h-6 w-6 mr-2" />
                    Begin Quest!
                  </Button>
                ) : (
                  <Button 
                    size="lg" 
                    onClick={pause} 
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold text-lg px-8 py-4 hover:scale-110 transition-all duration-300 shadow-xl"
                  >
                    <Pause className="h-6 w-6 mr-2" />
                    Pause
                  </Button>
                )}
                <Button 
                  size="lg" 
                  onClick={handleSessionEnd} 
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold text-lg px-8 py-4 hover:scale-110 transition-all duration-300 shadow-xl"
                >
                  <Square className="h-6 w-6 mr-2" />
                  End Quest
                </Button>
              </div>
            </div>
            {isRunning && (
              <div className="mt-6 text-center">
                <Badge variant="default" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-lg px-6 py-3 animate-pulse shadow-xl">
                  🔥 DEEP FOCUS MODE ACTIVATED - You're in the zone! 🔥
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Topics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {dsaTopics.map((topic, index) => (
            <div 
              key={topic.id} 
              className="animate-fade-in hover:scale-[1.01] transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <TopicCard
                topic={topic}
                progress={progress[topic.id] || {}}
                onSubtopicToggle={(subtopicId) => toggleSubtopic(topic.id, subtopicId)}
                topicProgress={calculateTopicProgress(topic.id)}
              />
            </div>
          ))}
        </div>

        {/* Motivational Epic Footer */}
        {overallProgress > 0 && (
          <div className="mt-12 text-center p-8 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 rounded-3xl border border-primary/20 animate-fade-in relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 via-orange-400/5 to-red-400/5 animate-pulse"></div>
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent relative z-10">
              🏰 Keep Conquering, Brave Adventurer! ⚔️
            </h3>
            <p className="text-muted-foreground text-xl relative z-10">
              Every algorithm conquered, every data structure mastered brings you closer to coding greatness! Your legend grows! 🌟
            </p>
            <div className="flex justify-center space-x-4 mt-6 relative z-10">
              <Badge variant="outline" className="bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300 text-purple-800 px-4 py-2 text-lg hover:scale-105 transition-transform">
                🏆 Level {gameState.level} Achieved
              </Badge>
              <Badge variant="outline" className="bg-gradient-to-r from-green-100 to-emerald-100 border-green-300 text-green-800 px-4 py-2 text-lg hover:scale-105 transition-transform">
                ⚡ {gameState.xp} XP Earned
              </Badge>
              {gameState.streak > 0 && (
                <Badge variant="outline" className="bg-gradient-to-r from-orange-100 to-red-100 border-orange-300 text-orange-800 px-4 py-2 text-lg hover:scale-105 transition-transform">
                  🔥 {gameState.streak} Day Streak
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>

      <SessionModal
        isOpen={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        onSave={saveSession}
        sessionTime={time}
      />
    </AdventureTheme>
  );
};

export default DSATracker;
