import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Moon, Sun, Upload } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useTimer } from '@/hooks/useTimer';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';
import { dsaTopics } from '@/data/dsaTopics';
import TopicCard from './TopicCard';
import SessionModal from './SessionModal';

const DSATracker = () => {
  const [progress, setProgress] = useLocalStorage('dsa-progress', {});
  const [sessionNotes, setSessionNotes] = useLocalStorage('dsa-session-notes', []);
  const [darkMode, setDarkMode] = useLocalStorage('dark-mode', false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [currentTopic, setCurrentTopic] = useState(null);
  
  const { time, isRunning, start, pause, stop, reset } = useTimer();
  const { syncToSheets, isLoading: isSyncing, error: syncError } = useGoogleSheets();

  const toggleSubtopic = (topicId: string, subtopicId: string) => {
    setProgress(prev => ({
      ...prev,
      [topicId]: {
        ...prev[topicId],
        [subtopicId]: !prev[topicId]?.[subtopicId]
      }
    }));
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
      topic: currentTopic
    };
    
    setSessionNotes(prev => [...prev, newSession]);
    reset();
    setCurrentTopic(null);
    setShowSessionModal(false);
  };

  const handleGoogleSheetsSync = async () => {
    try {
      await syncToSheets(progress, sessionNotes, dsaTopics);
      alert('Successfully synced to Google Sheets!');
    } catch (error) {
      alert('Failed to sync to Google Sheets. Please check your setup.');
    }
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

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gradient">DSA Progress Tracker</h1>
            <p className="text-muted-foreground mt-2">Track your Data Structures & Algorithms journey</p>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleGoogleSheetsSync}
              disabled={isSyncing}
              className="flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>{isSyncing ? 'Syncing...' : 'Sync to Sheets'}</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {syncError && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive rounded-lg">
            <p className="text-destructive text-sm">{syncError}</p>
          </div>
        )}

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Progress value={overallProgress} className="flex-1" />
                <Badge variant="secondary">{overallProgress}%</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Study Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold timer-display">
                {formatTime(totalStudyTime)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Current Session</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold timer-display">
                  {formatTime(time)}
                </div>
                <div className="flex space-x-1">
                  {!isRunning ? (
                    <Button size="sm" onClick={start} variant="outline">
                      <Play className="h-3 w-3" />
                    </Button>
                  ) : (
                    <Button size="sm" onClick={pause} variant="outline">
                      <Pause className="h-3 w-3" />
                    </Button>
                  )}
                  <Button size="sm" onClick={handleSessionEnd} variant="outline">
                    <Square className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {dsaTopics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              progress={progress[topic.id] || {}}
              onSubtopicToggle={(subtopicId) => toggleSubtopic(topic.id, subtopicId)}
              topicProgress={calculateTopicProgress(topic.id)}
            />
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
