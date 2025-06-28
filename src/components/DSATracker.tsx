
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Moon, Sun, FileText, Trophy, Target, Clock, BookOpen, Sparkles, Brain, Rocket, Download, BarChart3, TrendingUp, Calendar, Award } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useTimer } from '@/hooks/useTimer';
import { useGameSystem } from '@/hooks/useGameSystem';
import { dsaTopics } from '@/data/dsaTopics';
import TopicCard from './TopicCard';
import SessionModal from './SessionModal';
import GameStats from './GameStats';
import QuestSystem from './QuestSystem';
import AdventureTheme from './AdventureTheme';
import CustomTopicsManager from './CustomTopicsManager';
import { toast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

const DSATracker = () => {
  const [progress, setProgress] = useLocalStorage('dsa-progress', {});
  const [customTopics, setCustomTopics] = useLocalStorage('custom-topics', []);
  const [sessionNotes, setSessionNotes] = useLocalStorage('dsa-session-notes', []);
  const [darkMode, setDarkMode] = useLocalStorage('dark-mode', false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [isBreathing, setIsBreathing] = useState(false);
  
  const { time, isRunning, start, pause, stop, reset } = useTimer();
  const { gameState, quests, onSubtopicComplete, onTopicComplete, onStudySession, completeQuest } = useGameSystem();

  // Combine default topics with custom topics
  const allTopics = [...dsaTopics, ...customTopics];

  // Enhanced breathing animation with multiple states
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setIsBreathing(prev => !prev);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const handleCustomTopicCreate = (topic: any) => {
    setCustomTopics(prev => [...prev, topic]);
    
    // Initialize progress for the new custom topic
    setProgress(prev => ({
      ...prev,
      [topic.id]: {}
    }));
  };

  const handleCustomTopicDelete = (topicId: string) => {
    setCustomTopics(prev => prev.filter(topic => topic.id !== topicId));
    
    // Clean up progress for deleted topic
    setProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[topicId];
      return newProgress;
    });
  };

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
      const topic = allTopics.find(t => t.id === topicId);
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
    const topic = allTopics.find(t => t.id === topicId);
    if (!topic) return 0;
    
    const completed = topic.subtopics.filter(sub => 
      progress[topicId]?.[sub.id]
    ).length;
    
    return Math.round((completed / topic.subtopics.length) * 100);
  };

  const calculateOverallProgress = () => {
    const totalSubtopics = allTopics.reduce((acc, topic) => acc + topic.subtopics.length, 0);
    const completedSubtopics = allTopics.reduce((acc, topic) => {
      const completed = topic.subtopics.filter(sub => 
        progress[topic.id]?.[sub.id]
      ).length;
      return acc + completed;
    }, 0);
    
    return totalSubtopics > 0 ? Math.round((completedSubtopics / totalSubtopics) * 100) : 0;
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

  const generatePDFReport = () => {
    const doc = new jsPDF();
    const overallProgress = calculateOverallProgress();
    const totalStudyTime = sessionNotes.reduce((acc, session) => acc + session.duration, 0);
    const completedTopics = allTopics.filter(topic => calculateTopicProgress(topic.id) === 100).length;
    
    // Header
    doc.setFontSize(24);
    doc.setTextColor(88, 28, 135); // Purple color
    doc.text('DSA Learning Progress Report', 20, 30);
    
    // Date and basic info
    doc.setFontSize(12);
    doc.setTextColor(75, 85, 99); // Gray color
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
    doc.text(`Report for: ${gameState.level ? `Level ${gameState.level} Hero` : 'Learning Adventurer'}`, 20, 55);
    
    // Progress Overview
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('📊 Progress Overview', 20, 75);
    
    doc.setFontSize(12);
    doc.text(`Overall Progress: ${overallProgress}%`, 30, 90);
    doc.text(`Topics Completed: ${completedTopics}/${allTopics.length}`, 30, 100);
    doc.text(`Total Study Time: ${Math.floor(totalStudyTime / 3600)}h ${Math.floor((totalStudyTime % 3600) / 60)}m`, 30, 110);
    doc.text(`Current Level: ${gameState.level || 1}`, 30, 120);
    doc.text(`Experience Points: ${gameState.xp || 0} XP`, 30, 130);
    doc.text(`Study Streak: ${gameState.streak || 0} days`, 30, 140);
    
    // Topic Progress
    doc.setFontSize(16);
    doc.text('🎯 Topic Progress', 20, 160);
    
    let yPosition = 175;
    doc.setFontSize(10);
    
    allTopics.forEach((topic, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      const topicProgress = calculateTopicProgress(topic.id);
      const completed = topic.subtopics.filter(sub => progress[topic.id]?.[sub.id]).length;
      
      doc.text(`${topic.icon} ${topic.name}: ${topicProgress}% (${completed}/${topic.subtopics.length})`, 30, yPosition);
      yPosition += 10;
    });
    
    // Recent Sessions
    if (sessionNotes.length > 0) {
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 20;
      } else {
        yPosition += 20;
      }
      
      doc.setFontSize(16);
      doc.text('📚 Recent Study Sessions', 20, yPosition);
      yPosition += 15;
      
      doc.setFontSize(10);
      const recentSessions = sessionNotes.slice(-10).reverse();
      
      recentSessions.forEach((session) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        
        const sessionDate = new Date(session.date).toLocaleDateString();
        doc.text(`${sessionDate}: ${session.formattedDuration}`, 30, yPosition);
        if (session.note) {
          yPosition += 8;
          doc.setFontSize(9);
          doc.setTextColor(100, 100, 100);
          doc.text(`Note: ${session.note.substring(0, 80)}`, 35, yPosition);
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
        }
        yPosition += 12;
      });
    }
    
    // Achievements
    if (gameState.achievements && gameState.achievements.length > 0) {
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 20;
      } else {
        yPosition += 20;
      }
      
      doc.setFontSize(16);
      doc.text('🏆 Achievements Unlocked', 20, yPosition);
      yPosition += 15;
      
      doc.setFontSize(10);
      gameState.achievements.forEach((achievement) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(`• ${achievement}`, 30, yPosition);
        yPosition += 10;
      });
    }
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Generated by DSA Tracker - Your Coding Adventure Companion', 20, doc.internal.pageSize.height - 10);
    
    // Save the PDF
    doc.save(`DSA-Progress-Report-${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast({
      title: "📄 PDF Report Generated!",
      description: "Your learning progress report has been downloaded successfully!",
      duration: 3000,
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
  const completedTopics = allTopics.filter(topic => calculateTopicProgress(topic.id) === 100).length;

  return (
    <AdventureTheme level={gameState.level} xp={gameState.xp} streak={gameState.streak}>
      <div className="container mx-auto p-6 max-w-7xl relative z-10">
        {/* Enhanced Epic Header */}
        <div className="flex items-center justify-between mb-8 p-8 bg-gradient-to-r from-card/95 to-card/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/50 animate-fade-in relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 animate-pulse"></div>
          
          <div className="space-y-3 relative z-10">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-primary to-purple-600 rounded-xl shadow-lg">
                <Brain className="h-8 w-8 text-white animate-pulse" />
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-scale-in">
                🗡️ DSA Adventure Quest
              </h1>
              <Sparkles className="h-6 w-6 text-yellow-500 animate-bounce" />
            </div>
            <p className="text-muted-foreground text-xl font-medium">Embark on an epic coding adventure! Conquer algorithms, master data structures! 🏰</p>
            <div className="flex items-center space-x-4 mt-4">
              <Badge variant="secondary" className="px-4 py-2 text-base hover:scale-105 transition-transform cursor-pointer bg-gradient-to-r from-green-100 to-emerald-100 border-green-300 shadow-md">
                <Trophy className="h-5 w-5 mr-2" />
                {completedTopics}/{allTopics.length} Realms Conquered
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-base hover:scale-105 transition-transform cursor-pointer border-primary/30 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md">
                <Target className="h-5 w-5 mr-2" />
                {overallProgress}% Quest Complete
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-base hover:scale-105 transition-transform cursor-pointer border-purple-500/30 bg-gradient-to-r from-purple-50 to-pink-50 shadow-md">
                <Rocket className="h-5 w-5 mr-2" />
                Level {gameState.level} Hero
              </Badge>
            </div>
          </div>
          
          <div className="flex space-x-3 relative z-10">
            <Button
              variant="outline"
              onClick={generatePDFReport}
              className="flex items-center space-x-2 hover:scale-105 transition-all duration-300 bg-gradient-to-r from-green-50 to-emerald-50 backdrop-blur-sm border-2 hover:border-green-500/50 hover:shadow-xl text-green-700 font-semibold px-6 py-3"
            >
              <FileText className="h-5 w-5" />
              <span>Generate Report</span>
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

        {/* Enhanced Game Stats Dashboard */}
        <div className="mb-8">
          <GameStats
            xp={gameState.xp}
            level={gameState.level}
            streak={gameState.streak}
            achievements={gameState.achievements}
            totalStudyTime={totalStudyTime}
            completedTopics={completedTopics}
          />
        </div>

        {/* Enhanced Quest System */}
        <div className="mb-8">
          <QuestSystem quests={quests} onQuestComplete={completeQuest} />
        </div>

        {/* Enhanced Custom Topics Manager */}
        <div className="mb-8">
          <CustomTopicsManager
            customTopics={customTopics}
            onTopicCreate={handleCustomTopicCreate}
            onTopicDelete={handleCustomTopicDelete}
            progress={progress}
          />
        </div>

        {/* Enhanced Study Timer */}
        <Card className="mb-8 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border-2 border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-500 shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center text-cyan-600">
              <Clock className="h-8 w-8 mr-3 animate-pulse" />
              ⏰ Focus Chamber - Channel Your Inner Warrior!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-8">
              <div className={`text-8xl font-bold timer-display transition-all duration-500 ${isRunning && isBreathing ? 'scale-125 text-cyan-600 drop-shadow-2xl animate-pulse' : 'scale-100'} bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent`}>
                {formatTime(time)}
              </div>
              
              <div className="flex space-x-6">
                {!isRunning ? (
                  <Button 
                    size="lg" 
                    onClick={start} 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-xl px-12 py-6 hover:scale-110 transition-all duration-300 shadow-2xl rounded-full"
                  >
                    <Play className="h-7 w-7 mr-3" />
                    Begin Epic Quest!
                  </Button>
                ) : (
                  <Button 
                    size="lg" 
                    onClick={pause} 
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold text-xl px-12 py-6 hover:scale-110 transition-all duration-300 shadow-2xl rounded-full"
                  >
                    <Pause className="h-7 w-7 mr-3" />
                    Pause Adventure
                  </Button>
                )}
                <Button 
                  size="lg" 
                  onClick={handleSessionEnd} 
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold text-xl px-12 py-6 hover:scale-110 transition-all duration-300 shadow-2xl rounded-full"
                >
                  <Square className="h-7 w-7 mr-3" />
                  Complete Quest
                </Button>
              </div>
              
              {isRunning && (
                <div className="text-center space-y-4">
                  <Badge variant="default" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xl px-8 py-4 animate-pulse shadow-2xl rounded-full">
                    🔥 DEEP FOCUS MODE ACTIVATED - You're in the zone! 🔥
                  </Badge>
                  <div className="flex items-center justify-center space-x-4 text-cyan-600">
                    <BarChart3 className="h-6 w-6 animate-bounce" />
                    <span className="text-lg font-semibold">XP Multiplier: 2x Active!</span>
                    <TrendingUp className="h-6 w-6 animate-bounce" />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Topics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {allTopics.map((topic, index) => (
            <div 
              key={topic.id} 
              className="animate-fade-in hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl"
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

        {/* Enhanced Motivational Footer */}
        {overallProgress > 0 && (
          <div className="text-center p-12 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 rounded-3xl border-2 border-primary/20 animate-fade-in relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 via-orange-400/5 to-red-400/5 animate-pulse"></div>
            <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent relative z-10">
              🏰 Keep Conquering, Legendary Developer! ⚔️
            </h3>
            <p className="text-muted-foreground text-2xl relative z-10 mb-8 max-w-4xl mx-auto">
              Every algorithm conquered, every data structure mastered brings you closer to coding greatness! Your legend grows with each victory! 🌟
            </p>
            <div className="flex flex-wrap justify-center gap-6 relative z-10">
              <Badge variant="outline" className="bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300 text-purple-800 px-6 py-3 text-xl hover:scale-110 transition-transform shadow-lg">
                <Award className="h-6 w-6 mr-2" />
                Level {gameState.level} Achieved
              </Badge>
              <Badge variant="outline" className="bg-gradient-to-r from-green-100 to-emerald-100 border-green-300 text-green-800 px-6 py-3 text-xl hover:scale-110 transition-transform shadow-lg">
                <Sparkles className="h-6 w-6 mr-2" />
                {gameState.xp} XP Earned
              </Badge>
              {gameState.streak > 0 && (
                <Badge variant="outline" className="bg-gradient-to-r from-orange-100 to-red-100 border-orange-300 text-orange-800 px-6 py-3 text-xl hover:scale-110 transition-transform shadow-lg">
                  <Calendar className="h-6 w-6 mr-2" />
                  {gameState.streak} Day Streak
                </Badge>
              )}
              <Badge variant="outline" className="bg-gradient-to-r from-blue-100 to-cyan-100 border-blue-300 text-blue-800 px-6 py-3 text-xl hover:scale-110 transition-transform shadow-lg">
                <Clock className="h-6 w-6 mr-2" />
                {Math.floor(totalStudyTime / 3600)}h {Math.floor((totalStudyTime % 3600) / 60)}m Studied
              </Badge>
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
