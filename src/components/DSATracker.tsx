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
    
    // Clean color palette
    const primaryColor = [37, 99, 235]; // Blue
    const secondaryColor = [99, 102, 241]; // Indigo
    const accentColor = [16, 185, 129]; // Emerald
    const textColor = [31, 41, 55]; // Gray-800
    const lightGray = [156, 163, 175]; // Gray-400
    const darkGray = [75, 85, 99]; // Gray-600
    
    // Cover Page
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Header section
    doc.setFillColor(255, 255, 255, 0.1);
    doc.rect(0, 0, 210, 60, 'F');
    
    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.text('DSA Learning Progress Report', 105, 40, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('Data Structures & Algorithms Mastery Journey', 105, 55, { align: 'center' });
    
    // Progress circle
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(4);
    doc.circle(105, 120, 35);
    
    doc.setFontSize(36);
    doc.setFont('helvetica', 'bold');
    doc.text(`${overallProgress}%`, 105, 128, { align: 'center' });
    doc.setFontSize(14);
    doc.text('Complete', 105, 140, { align: 'center' });
    
    // Key statistics
    const statsY = 180;
    const boxWidth = 50;
    const boxHeight = 35;
    
    // Topics Completed
    doc.setFillColor(255, 255, 255, 0.15);
    doc.rect(20, statsY, boxWidth, boxHeight, 'F');
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(`${completedTopics}`, 45, statsY + 18, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Topics Mastered', 45, statsY + 28, { align: 'center' });
    
    // Study Time
    doc.rect(80, statsY, boxWidth, boxHeight, 'F');
    doc.setFontSize(24);
    doc.text(`${Math.floor(totalStudyTime / 3600)}`, 105, statsY + 18, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Hours Studied', 105, statsY + 28, { align: 'center' });
    
    // Level
    doc.rect(140, statsY, boxWidth, boxHeight, 'F');
    doc.setFontSize(24);
    doc.text(`${gameState.level || 1}`, 165, statsY + 18, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Current Level', 165, statsY + 28, { align: 'center' });
    
    // Date
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255, 0.8);
    doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 105, 250, { align: 'center' });
    doc.text(`Student Level: ${gameState.level || 1} | Experience: ${gameState.xp || 0} XP`, 105, 265, { align: 'center' });
    
    // Page 2 - Overview
    doc.addPage();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Header
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('Progress Overview', 20, 30);
    
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(2);
    doc.line(20, 35, 190, 35);
    
    // Summary section
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Learning Summary', 20, 55);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    let yPos = 70;
    
    const summaryItems = [
      `Overall Progress: ${overallProgress}% Complete`,
      `Topics Completed: ${completedTopics} out of ${allTopics.length}`,
      `Total Study Time: ${Math.floor(totalStudyTime / 3600)} hours ${Math.floor((totalStudyTime % 3600) / 60)} minutes`,
      `Current Level: ${gameState.level || 1}`,
      `Experience Points: ${gameState.xp || 0} XP`,
      `Study Sessions: ${sessionNotes.length} completed`,
      `Learning Streak: ${gameState.streak || 0} days`
    ];
    
    summaryItems.forEach((item) => {
      doc.text(`• ${item}`, 30, yPos);
      yPos += 10;
    });
    
    // Topic Progress
    yPos += 20;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Topic Breakdown', 20, yPos);
    yPos += 15;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    
    allTopics.forEach((topic) => {
      if (yPos > 260) {
        doc.addPage();
        yPos = 30;
      }
      
      const topicProgress = calculateTopicProgress(topic.id);
      const completed = topic.subtopics.filter(sub => progress[topic.id]?.[sub.id]).length;
      
      // Progress bar
      doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.rect(30, yPos - 2, 80, 3, 'F');
      doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.rect(30, yPos - 2, (topicProgress / 100) * 80, 3, 'F');
      
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.text(`${topic.name}`, 30, yPos + 8);
      doc.text(`${topicProgress}%`, 120, yPos + 8);
      doc.text(`(${completed}/${topic.subtopics.length})`, 140, yPos + 8);
      
      yPos += 18;
    });
    
    // Study Sessions
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
      doc.text('Recent Study Sessions', 20, yPos);
      yPos += 15;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      
      const recentSessions = sessionNotes.slice(-10).reverse();
      
      recentSessions.forEach((session) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 30;
        }
        
        const sessionDate = new Date(session.date).toLocaleDateString();
        doc.text(`Date: ${sessionDate}`, 30, yPos);
        doc.text(`Duration: ${session.formattedDuration}`, 120, yPos);
        
        if (session.note) {
          yPos += 8;
          doc.setFontSize(9);
          doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
          const noteText = session.note.length > 60 ? session.note.substring(0, 60) + '...' : session.note;
          doc.text(`Notes: ${noteText}`, 35, yPos);
          doc.setFontSize(10);
          doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        }
        yPos += 15;
      });
    }
    
    // Contact Information Page
    doc.addPage();
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Header
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 50, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('About the Developer', 105, 32, { align: 'center' });
    
    // Content
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('DSA Adventure Quest', 105, 80, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('A comprehensive Data Structures and Algorithms learning tracker', 105, 95, { align: 'center' });
    doc.text('designed to make programming education engaging and effective.', 105, 107, { align: 'center' });
    
    // Contact section
    yPos = 140;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Contact Information', 105, yPos, { align: 'center' });
    
    yPos += 25;
    
    const contactInfo = [
      { label: 'Team Members', value: 'Vanshika (23bca0151), Janvi (23bca0118)' },
      { label: '', value: 'Gaurav Chauhan (23bca0134), Lakhan Negi (23bca0155)' },
      { label: 'Project', value: 'DSA Tracker - Gamified Learning Platform' }
    ];
    
    contactInfo.forEach((info) => {
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.setLineWidth(1);
      doc.rect(30, yPos - 5, 150, 18, 'FD');
      
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`${info.label}:`, 35, yPos + 3);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text(info.value, 35, yPos + 10);
      
      yPos += 25;
    });
    
    // Footer
    yPos += 30;
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you for using DSA Adventure Quest!', 105, yPos, { align: 'center' });
    doc.text('Keep learning and growing your programming skills.', 105, yPos + 12, { align: 'center' });
    
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(1);
    doc.line(60, yPos + 25, 150, yPos + 25);
    
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('DSA Adventure Quest - Programming Education Made Simple', 105, 285, { align: 'center' });
    
    // Save PDF
    const fileName = `DSA-Progress-Report-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    toast({
      title: "Report Generated Successfully!",
      description: "Your clean and professional progress report has been downloaded.",
      duration: 4000,
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
              className="flex items-center space-x-3 hover:scale-105 transition-all duration-300 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 backdrop-blur-sm border-2 hover:border-blue-500/50 hover:shadow-xl text-blue-700 font-semibold px-6 py-3 rounded-xl group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
              <Download className="h-5 w-5 group-hover:animate-bounce relative z-10" />
              <div className="flex flex-col items-start relative z-10">
                <span className="text-base">Download Report</span>
                <span className="text-xs opacity-75">Professional PDF</span>
              </div>
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
