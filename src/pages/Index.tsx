
import { useState } from "react";
import DSATracker from "@/components/DSATracker";
import GameStats from "@/components/GameStats";
import QuestSystem from "@/components/QuestSystem";
import SessionModal from "@/components/SessionModal";
import AdventureTheme from "@/components/AdventureTheme";
import FirebaseUserProfile from "@/components/FirebaseUserProfile";
import { useFirebaseSupabaseData } from "@/hooks/useFirebaseSupabaseData";
import { useGameSystem } from "@/hooks/useGameSystem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Timer, Trophy, Scroll, User } from "lucide-react";

const Index = () => {
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("tracker");
  const [sessionTime, setSessionTime] = useState(0);
  
  const {
    progress,
    sessionNotes,
    gameState,
    loading,
    updateProgress,
    saveSessionNote,
    updateGameState,
    refreshData
  } = useFirebaseSupabaseData();

  const gameSystem = useGameSystem(gameState, updateGameState);

  const handleProgressUpdate = async (topicId: string, subtopicId: string, completed: boolean) => {
    console.log('Updating progress:', topicId, subtopicId, completed);
    await updateProgress(topicId, subtopicId, completed);
    
    if (completed) {
      await gameSystem.onSubtopicComplete();
    }
  };

  const handleSessionSave = async (sessionData: any) => {
    console.log('Saving session:', sessionData);
    await saveSessionNote(sessionData);
    await gameSystem.onStudySession(sessionData.duration || 0);
  };

  // Calculate total study time from session notes
  const totalStudyTime = sessionNotes.reduce((total, session) => total + session.duration, 0);
  
  // Calculate completed topics from progress
  const completedTopics = Object.values(progress).reduce((count, topicProgress) => {
    const totalSubtopics = Object.keys(topicProgress).length;
    const completedSubtopics = Object.values(topicProgress).filter(Boolean).length;
    return totalSubtopics > 0 && completedSubtopics === totalSubtopics ? count + 1 : count;
  }, 0);

  console.log('Index component - loading:', loading, 'progress:', progress, 'gameState:', gameState);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg text-muted-foreground">Loading your adventure...</p>
        </div>
      </div>
    );
  }

  return (
    <AdventureTheme level={gameState.level} xp={gameState.xp} streak={gameState.streak}>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 p-6">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                🗡️ DSA Adventure Quest
              </h1>
              <p className="text-muted-foreground mt-2">Master Data Structures & Algorithms through Epic Challenges!</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setIsSessionModalOpen(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              >
                <Timer className="mr-2 h-4 w-4" />
                Start Study Session
              </Button>
              <FirebaseUserProfile />
            </div>
          </div>

          {/* Debug info */}
          <div className="mb-4 p-4 bg-card rounded-lg border">
            <h3 className="font-semibold mb-2">Debug Info:</h3>
            <p>Loading: {loading.toString()}</p>
            <p>Progress keys: {Object.keys(progress).length}</p>
            <p>Session notes: {sessionNotes.length}</p>
            <p>Game State XP: {gameState.xp}</p>
            <p>Game State Level: {gameState.level}</p>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur-sm">
              <TabsTrigger value="tracker" className="flex items-center space-x-2">
                <Scroll className="h-4 w-4" />
                <span>Quest Tracker</span>
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center space-x-2">
                <Trophy className="h-4 w-4" />
                <span>Stats & Achievements</span>
              </TabsTrigger>
              <TabsTrigger value="quests" className="flex items-center space-x-2">
                <Timer className="h-4 w-4" />
                <span>Daily Quests</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Hero Profile</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tracker" className="space-y-6">
              <div className="bg-card p-6 rounded-lg border">
                <h2 className="text-2xl font-bold mb-4">DSA Quest Tracker</h2>
                <p className="text-muted-foreground mb-4">Track your progress through Data Structures and Algorithms!</p>
                <DSATracker />
              </div>
            </TabsContent>

            <TabsContent value="stats" className="space-y-6">
              <GameStats 
                xp={gameState.xp}
                level={gameState.level}
                streak={gameState.streak}
                achievements={gameState.achievements}
                totalStudyTime={totalStudyTime}
                completedTopics={completedTopics}
              />
            </TabsContent>

            <TabsContent value="quests" className="space-y-6">
              <QuestSystem
                quests={gameSystem.quests}
                onQuestComplete={gameSystem.completeQuest}
              />
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <div className="bg-card p-8 rounded-lg border text-center">
                <h2 className="text-2xl font-bold mb-4">Hero Profile</h2>
                <div className="space-y-4">
                  <div className="text-left max-w-md mx-auto">
                    <h3 className="font-semibold mb-2">Your Stats:</h3>
                    <ul className="space-y-2 text-sm">
                      <li>Level: {gameState.level}</li>
                      <li>XP: {gameState.xp}</li>
                      <li>Streak: {gameState.streak} days</li>
                      <li>Study Time: {Math.floor(totalStudyTime / 3600)}h {Math.floor((totalStudyTime % 3600) / 60)}m</li>
                      <li>Topics Completed: {completedTopics}</li>
                      <li>Sessions: {sessionNotes.length}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Session Modal */}
          <SessionModal
            isOpen={isSessionModalOpen}
            onClose={() => setIsSessionModalOpen(false)}
            onSave={handleSessionSave}
            sessionTime={sessionTime}
          />
        </div>
      </div>
    </AdventureTheme>
  );
};

export default Index;
