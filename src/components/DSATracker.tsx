
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Moon, Sun, Upload, Download, Trophy, Target, Clock, BookOpen } from 'lucide-react';
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

  // Breathing animation for timer when running
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setIsBreathing(prev => !prev);
      }, 1000);
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
      await syncToSheets(progress, sessionNotes, dsaTopics);
      toast({
        title: "🔄 Sync Successful!",
        description: "Your progress has been synced to Google Sheets",
        duration: 3000,
      });
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 text-foreground transition-all duration-500">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Enhanced Header with Floating Effect */}
        <div className="flex items-center justify-between mb-8 p-6 bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg border animate-fade-in">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-scale-in">
              DSA Progress Tracker
            </h1>
            <p className="text-muted-foreground text-lg">Master Data Structures & Algorithms with style 🚀</p>
            <div className="flex items-center space-x-4 mt-4">
              <Badge variant="secondary" className="px-3 py-1">
                <Trophy className="h-4 w-4 mr-1" />
                {completedTopics}/{dsaTopics.length} Topics
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                <Target className="h-4 w-4 mr-1" />
                {overallProgress}% Complete
              </Badge>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={exportData}
              className="flex items-center space-x-2 hover:scale-105 transition-transform"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleGoogleSheetsSync}
              disabled={isSyncing}
              className="flex items-center space-x-2 hover:scale-105 transition-transform"
            >
              <Upload className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              className="hover:scale-105 transition-transform"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {syncError && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-xl animate-fade-in">
            <p className="text-destructive text-sm font-medium">⚠️ {syncError}</p>
          </div>
        )}

        {/* Enhanced Stats Dashboard with Animations */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Overall Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Progress value={overallProgress} className="h-3" />
                <div className="flex justify-between text-sm">
                  <Badge variant="secondary" className="text-2xl font-bold px-3">
                    {overallProgress}%
                  </Badge>
                  <span className="text-muted-foreground">
                    {dsaTopics.reduce((acc, topic) => acc + topic.subtopics.filter(sub => progress[topic.id]?.[sub.id]).length, 0)} / {dsaTopics.reduce((acc, topic) => acc + topic.subtopics.length, 0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-green-500/5 to-green-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Total Study Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold timer-display bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                {formatTime(totalStudyTime)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {sessionNotes.length} sessions completed
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-blue-500/5 to-blue-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Current Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <div className={`text-2xl font-bold timer-display transition-all duration-300 ${isRunning && isBreathing ? 'scale-110 text-primary' : 'scale-100'}`}>
                  {formatTime(time)}
                </div>
                <div className="flex space-x-1">
                  {!isRunning ? (
                    <Button 
                      size="sm" 
                      onClick={start} 
                      variant="outline"
                      className="hover:bg-green-500 hover:text-white transition-all duration-200"
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={pause} 
                      variant="outline"
                      className="hover:bg-yellow-500 hover:text-white transition-all duration-200"
                    >
                      <Pause className="h-3 w-3" />
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    onClick={handleSessionEnd} 
                    variant="outline"
                    className="hover:bg-red-500 hover:text-white transition-all duration-200"
                  >
                    <Square className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              {isRunning && (
                <div className="mt-2 flex items-center text-sm text-green-600 animate-pulse">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Session in progress...
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-purple-500/5 to-purple-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Trophy className="h-4 w-4 mr-2" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-purple-600">
                  {completedTopics}
                </div>
                <p className="text-sm text-muted-foreground">
                  Topics mastered
                </p>
                {overallProgress >= 25 && (
                  <Badge variant="outline" className="text-xs bg-purple-50">
                    🏅 Quarter Master
                  </Badge>
                )}
                {overallProgress >= 50 && (
                  <Badge variant="outline" className="text-xs bg-purple-50">
                    🏆 Half Way Hero
                  </Badge>
                )}
                {overallProgress >= 100 && (
                  <Badge variant="outline" className="text-xs bg-purple-50">
                    👑 DSA Master
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Topics Grid with Stagger Animation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {dsaTopics.map((topic, index) => (
            <div 
              key={topic.id} 
              className="animate-fade-in"
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
