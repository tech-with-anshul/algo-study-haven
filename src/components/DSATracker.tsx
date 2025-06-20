import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Moon, Sun, Upload, Download, Trophy, Target, Clock, BookOpen, Sparkles, Brain, Rocket } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useTimer } from '@/hooks/useTimer';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';
import { dsaTopics } from '@/data/dsaTopics';
import TopicCard from './TopicCard';
import SessionModal from './SessionModal';
import { toast } from '@/hooks/use-toast';

const DSATracker = () => {
  const [progress, setProgress] = useLocalStorage('dsa-progress', {});
  const [sessionNotes, setSessionNotes] = useLocalStorage('dsa-session-notes', []);
  const [darkMode, setDarkMode] = useLocalStorage('dark-mode', false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [isBreathing, setIsBreathing] = useState(false);
  const [showStats, setShowStats] = useState(false);
  
  const { time, isRunning, start, pause, stop, reset } = useTimer();
  const { syncToSheets, isLoading: isSyncing, error: syncError } = useGoogleSheets();

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
    setProgress(prev => ({
      ...prev,
      [topicId]: {
        ...prev[topicId],
        [subtopicId]: !prev[topicId]?.[subtopicId]
      }
    }));

    // Show celebration for completion
    if (!progress[topicId]?.[subtopicId]) {
      toast({
        title: "🎉 Great job!",
        description: "Subtopic marked as completed!",
        duration: 2000,
      });
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
    reset();
    setCurrentTopic(null);
    setShowSessionModal(false);
    
    toast({
      title: "✅ Session Saved!",
      description: `Great work! You studied for ${formatTime(time)}`,
      duration: 3000,
    });
  };

  const handleGoogleSheetsSync = async () => {
    try {
      // Use the provided Google Apps Script URL
      const response = await fetch('https://script.google.com/macros/s/AKfycbxePhcjBRPyxlp2g3VT6DAfNIgX9xQV7Dt8IVNSPJV7J870fpPOevpN15mtTE3cJ8RZIA/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'syncProgress',
          progress,
          sessionNotes,
          topics: dsaTopics
        })
      });
      
      if (response.ok) {
        toast({
          title: "🔄 Sync Successful!",
          description: "Your progress has been synced to Google Sheets",
          duration: 3000,
        });
      } else {
        throw new Error('Sync failed');
      }
    } catch (error) {
      toast({
        title: "❌ Sync Failed",
        description: "Please check your Google Sheets setup",
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  const exportData = () => {
    const exportData = {
      progress,
      sessionNotes,
      exportDate: new Date().toISOString(),
      totalStudyTime: sessionNotes.reduce((acc, session) => acc + session.duration, 0),
      overallProgress: calculateOverallProgress()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dsa-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "📁 Data Exported!",
      description: "Your progress has been downloaded as JSON",
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 text-foreground transition-all duration-500 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto p-6 max-w-7xl relative z-10">
        {/* Enhanced Header with Interactive Elements */}
        <div className="flex items-center justify-between mb-8 p-8 bg-card/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-border/50 animate-fade-in relative overflow-hidden">
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 animate-gradient-x"></div>
          
          <div className="space-y-3 relative z-10">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-primary animate-pulse" />
              <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-scale-in">
                DSA Master
              </h1>
              <Sparkles className="h-6 w-6 text-yellow-500 animate-bounce" />
            </div>
            <p className="text-muted-foreground text-xl font-medium">Transform into a coding wizard through systematic practice 🧙‍♂️</p>
            <div className="flex items-center space-x-4 mt-4">
              <Badge variant="secondary" className="px-4 py-2 text-base hover:scale-105 transition-transform cursor-pointer">
                <Trophy className="h-5 w-5 mr-2" />
                {completedTopics}/{dsaTopics.length} Topics Mastered
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-base hover:scale-105 transition-transform cursor-pointer border-primary/30">
                <Target className="h-5 w-5 mr-2" />
                {overallProgress}% Journey Complete
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-base hover:scale-105 transition-transform cursor-pointer border-green-500/30">
                <Rocket className="h-5 w-5 mr-2" />
                Level {Math.floor(overallProgress / 20) + 1}
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
              <span className="font-medium">Export Data</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleGoogleSheetsSync}
              disabled={isSyncing}
              className="flex items-center space-x-2 hover:scale-105 transition-all duration-300 bg-background/50 backdrop-blur-sm border-2 hover:border-green-500/50 hover:shadow-lg"
            >
              <Upload className={`h-5 w-5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="font-medium">{isSyncing ? 'Syncing...' : 'Sync to Sheets'}</span>
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

        {/* Enhanced Stats Dashboard with Improved Animations */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/20 hover:border-primary/40 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold flex items-center text-primary">
                <Target className="h-5 w-5 mr-2" />
                Overall Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="space-y-3">
                <Progress value={overallProgress} className="h-4 bg-primary/20" />
                <div className="flex justify-between items-center">
                  <Badge variant="secondary" className="text-3xl font-bold px-4 py-2 bg-primary/10 text-primary border-primary/30">
                    {overallProgress}%
                  </Badge>
                  <span className="text-sm text-muted-foreground font-medium">
                    {dsaTopics.reduce((acc, topic) => acc + topic.subtopics.filter(sub => progress[topic.id]?.[sub.id]).length, 0)} / {dsaTopics.reduce((acc, topic) => acc + topic.subtopics.length, 0)} completed
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gradient-to-br from-green-500/10 via-green-500/5 to-background border-2 border-green-500/20 hover:border-green-500/40 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold flex items-center text-green-600">
                <Clock className="h-5 w-5 mr-2" />
                Study Time
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold timer-display bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent mb-2">
                {formatTime(totalStudyTime)}
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                {sessionNotes.length} sessions • Average: {sessionNotes.length > 0 ? formatTime(Math.floor(totalStudyTime / sessionNotes.length)) : '0:00:00'}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-background border-2 border-blue-500/20 hover:border-blue-500/40 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold flex items-center text-blue-600">
                <BookOpen className="h-5 w-5 mr-2" />
                Current Session
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-center space-x-4">
                <div className={`text-3xl font-bold timer-display transition-all duration-500 ${isRunning && isBreathing ? 'scale-110 text-blue-600 drop-shadow-lg' : 'scale-100'}`}>
                  {formatTime(time)}
                </div>
                <div className="flex space-x-2">
                  {!isRunning ? (
                    <Button 
                      size="sm" 
                      onClick={start} 
                      variant="outline"
                      className="hover:bg-green-500 hover:text-white transition-all duration-300 hover:scale-110 border-green-500/50"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={pause} 
                      variant="outline"
                      className="hover:bg-yellow-500 hover:text-white transition-all duration-300 hover:scale-110 border-yellow-500/50"
                    >
                      <Pause className="h-4 w-4" />
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    onClick={handleSessionEnd} 
                    variant="outline"
                    className="hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-110 border-red-500/50"
                  >
                    <Square className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {isRunning && (
                <div className="mt-3 flex items-center text-sm text-green-600 animate-pulse">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-ping"></div>
                  Deep focus mode activated...
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-background border-2 border-purple-500/20 hover:border-purple-500/40 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold flex items-center text-purple-600">
                <Trophy className="h-5 w-5 mr-2" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="space-y-3">
                <div className="text-3xl font-bold text-purple-600 flex items-center space-x-2">
                  <span>{completedTopics}</span>
                  <Sparkles className="h-6 w-6 animate-pulse" />
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  Topics conquered
                </p>
                <div className="flex flex-wrap gap-1">
                  {overallProgress >= 25 && (
                    <Badge variant="outline" className="text-xs bg-purple-50 border-purple-200 hover:scale-105 transition-transform">
                      🥉 Quarter Champion
                    </Badge>
                  )}
                  {overallProgress >= 50 && (
                    <Badge variant="outline" className="text-xs bg-purple-50 border-purple-300 hover:scale-105 transition-transform">
                      🥈 Half-Way Hero
                    </Badge>
                  )}
                  {overallProgress >= 75 && (
                    <Badge variant="outline" className="text-xs bg-purple-50 border-purple-400 hover:scale-105 transition-transform">
                      🥇 Elite Coder
                    </Badge>
                  )}
                  {overallProgress >= 100 && (
                    <Badge variant="outline" className="text-xs bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-400 hover:scale-105 transition-transform">
                      👑 DSA Grandmaster
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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

        {/* Motivational Footer */}
        {overallProgress > 0 && (
          <div className="mt-12 text-center p-8 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 rounded-3xl border border-primary/20 animate-fade-in">
            <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Keep Going, Code Warrior! 💪
            </h3>
            <p className="text-muted-foreground text-lg">
              Every algorithm mastered brings you closer to your dream job. You've got this! 🚀
            </p>
          </div>
        )}
      </div>

      <SessionModal
        isOpen={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        onSave={saveSession}
        sessionTime={time}
      />
    </div>
  );
};

export default DSATracker;
