
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
    
    // Page colors and styling
    const primaryColor = [88, 28, 135]; // Purple
    const accentColor = [147, 51, 234]; // Light purple
    const textColor = [31, 41, 55]; // Dark gray
    const lightGray = [156, 163, 175];
    
    // Cover Page - Enhanced Design
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 297, 'F'); // Full page background
    
    // Decorative header
    doc.setFillColor(255, 255, 255, 0.1);
    doc.rect(0, 0, 210, 80, 'F');
    
    // Main title with enhanced styling
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(36);
    doc.setFont('helvetica', 'bold');
    doc.text('🗡️ DSA Adventure Quest', 105, 50, { align: 'center' });
    
    doc.setFontSize(24);
    doc.setFont('helvetica', 'normal');
    doc.text('Progress Report', 105, 70, { align: 'center' });
    
    // Progress circle simulation
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(3);
    doc.circle(105, 130, 40);
    
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text(`${overallProgress}%`, 105, 135, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Overall Progress', 105, 145, { align: 'center' });
    
    // Key stats boxes
    const statsY = 190;
    const boxWidth = 45;
    const boxHeight = 30;
    
    // Topics Completed Box
    doc.setFillColor(255, 255, 255, 0.2);
    doc.rect(25, statsY, boxWidth, boxHeight, 'F');
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`${completedTopics}`, 47.5, statsY + 15, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Topics', 47.5, statsY + 25, { align: 'center' });
    
    // Study Time Box
    doc.rect(80, statsY, boxWidth, boxHeight, 'F');
    doc.setFontSize(18);
    doc.text(`${Math.floor(totalStudyTime / 3600)}h`, 102.5, statsY + 15, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Study Time', 102.5, statsY + 25, { align: 'center' });
    
    // Level Box
    doc.rect(135, statsY, boxWidth, boxHeight, 'F');
    doc.setFontSize(18);
    doc.text(`L${gameState.level || 1}`, 157.5, statsY + 15, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Level', 157.5, statsY + 25, { align: 'center' });
    
    // Date and user info
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255, 0.8);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 250, { align: 'center' });
    doc.text(`Level ${gameState.level || 1} Coding Hero • ${gameState.xp || 0} XP`, 105, 265, { align: 'center' });
    
    // New Page - Detailed Progress
    doc.addPage();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Header
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('📊 Detailed Progress Overview', 20, 30);
    
    // Decorative line
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.setLineWidth(2);
    doc.line(20, 35, 190, 35);
    
    // Progress Overview Section
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('🎯 Achievement Summary', 20, 55);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    let yPos = 70;
    
    const achievements = [
      `📈 Overall Progress: ${overallProgress}% Complete`,
      `🏆 Topics Mastered: ${completedTopics} out of ${allTopics.length}`,
      `⏰ Total Study Time: ${Math.floor(totalStudyTime / 3600)}h ${Math.floor((totalStudyTime % 3600) / 60)}m`,
      `🎮 Current Level: ${gameState.level || 1}`,
      `⭐ Experience Points: ${gameState.xp || 0} XP`,
      `🔥 Study Streak: ${gameState.streak || 0} days`,
      `📚 Study Sessions: ${sessionNotes.length} completed`
    ];
    
    achievements.forEach((achievement) => {
      doc.text(achievement, 30, yPos);
      yPos += 12;
    });
    
    // Topic Progress Section
    yPos += 20;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('🎯 Topic Mastery Breakdown', 20, yPos);
    yPos += 20;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    
    allTopics.forEach((topic, index) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 30;
      }
      
      const topicProgress = calculateTopicProgress(topic.id);
      const completed = topic.subtopics.filter(sub => progress[topic.id]?.[sub.id]).length;
      
      // Progress bar simulation
      doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.rect(30, yPos - 3, 100, 4, 'F');
      doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.rect(30, yPos - 3, (topicProgress / 100) * 100, 4, 'F');
      
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.text(`${topic.icon} ${topic.name}`, 30, yPos + 8);
      doc.text(`${topicProgress}% (${completed}/${topic.subtopics.length})`, 140, yPos + 8);
      
      yPos += 15;
    });
    
    // Recent Study Sessions
    if (sessionNotes.length > 0) {
      if (yPos > 200) {
        doc.addPage();
        yPos = 30;
      } else {
        yPos += 20;
      }
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('📚 Recent Study Sessions', 20, yPos);
      yPos += 20;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      
      const recentSessions = sessionNotes.slice(-8).reverse();
      
      recentSessions.forEach((session) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 30;
        }
        
        const sessionDate = new Date(session.date).toLocaleDateString();
        doc.text(`📅 ${sessionDate}`, 30, yPos);
        doc.text(`⏱️ ${session.formattedDuration}`, 100, yPos);
        
        if (session.note) {
          yPos += 8;
          doc.setFontSize(9);
          doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
          doc.text(`💭 ${session.note.substring(0, 70)}${session.note.length > 70 ? '...' : ''}`, 35, yPos);
          doc.setFontSize(10);
          doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        }
        yPos += 15;
      });
    }
    
    // Achievements Page
    if (gameState.achievements && gameState.achievements.length > 0) {
      doc.addPage();
      yPos = 30;
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('🏆 Unlocked Achievements', 20, yPos);
      yPos += 20;
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      
      gameState.achievements.forEach((achievement) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 30;
        }
        doc.text(`🎖️ ${achievement}`, 30, yPos);
        yPos += 12;
      });
    }
    
    // Credits and Contact Page
    doc.addPage();
    
    // Background gradient effect
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Header section
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 60, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('🚀 Created with Passion', 105, 35, { align: 'center' });
    
    // Main content
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('👨‍💻 About the Creator', 105, 90, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('This DSA Adventure Quest tracker was crafted with love and dedication', 105, 110, { align: 'center' });
    doc.text('to help developers master Data Structures and Algorithms in a fun,', 105, 125, { align: 'center' });
    doc.text('gamified way. Every feature is designed to make learning enjoyable!', 105, 140, { align: 'center' });
    
    // Contact section with styled boxes
    yPos = 170;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('📞 Get in Touch', 105, yPos, { align: 'center' });
    
    yPos += 25;
    
    // Contact info boxes
    const contactItems = [
      { icon: '🌐', label: 'Website', value: 'https://www.dev-anshul.tech/' },
      { icon: '📧', label: 'Email', value: 'Contact available on website' },
      { icon: '📱', label: 'Phone', value: 'Contact details on website' }
    ];
    
    contactItems.forEach((item, index) => {
      // Box background
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.setLineWidth(1);
      doc.rect(30, yPos - 5, 150, 20, 'FD');
      
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`${item.icon} ${item.label}:`, 35, yPos + 5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.text(item.value, 35, yPos + 15);
      
      yPos += 35;
    });
    
    // Footer message
    yPos += 20;
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you for using DSA Adventure Quest!', 105, yPos, { align: 'center' });
    doc.text('Keep coding, keep learning, keep growing! 🌟', 105, yPos + 12, { align: 'center' });
    
    // Decorative elements
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.setLineWidth(2);
    doc.line(60, yPos + 25, 150, yPos + 25);
    
    // Final branding
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('🏰 DSA Adventure Quest - Your Coding Journey Companion', 105, 285, { align: 'center' });
    
    // Save the PDF
    const fileName = `DSA-Adventure-Report-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    toast({
      title: "🎉 Epic Report Generated!",
      description: "Your beautifully crafted learning progress report has been downloaded! Share your achievements with pride! ✨",
      duration: 5000,
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
              className="flex items-center space-x-3 hover:scale-105 transition-all duration-300 bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 backdrop-blur-sm border-2 hover:border-emerald-500/50 hover:shadow-2xl text-emerald-700 font-bold px-8 py-4 rounded-2xl group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-green-400/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
              <Download className="h-6 w-6 group-hover:animate-bounce relative z-10" />
              <div className="flex flex-col items-start relative z-10">
                <span className="text-lg">Generate Epic Report</span>
                <span className="text-xs opacity-75">Download your adventure progress!</span>
              </div>
              <Sparkles className="h-4 w-4 text-yellow-500 group-hover:animate-spin relative z-10" />
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
