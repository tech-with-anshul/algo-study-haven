
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

  const gameSystem = useGameSystem({
    gameState,
    updateGameState,
    progress,
    updateProgress
  });

  const handleProgressUpdate = async (topicId: string, subtopicId: string, completed: boolean) => {
    await updateProgress(topicId, subtopicId, completed);
    
    if (completed) {
      await gameSystem.onSubtopicComplete();
    }
  };

  const handleSessionSave = async (sessionData: any) => {
    await saveSessionNote(sessionData);
    await gameSystem.onStudySession(sessionData.duration || 0);
  };

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
              <DSATracker 
                progress={progress} 
                onProgressUpdate={handleProgressUpdate}
              />
            </TabsContent>

            <TabsContent value="stats" className="space-y-6">
              <GameStats 
                gameState={gameState}
                sessionNotes={sessionNotes}
                progress={progress}
              />
            </TabsContent>

            <TabsContent value="quests" className="space-y-6">
              <QuestSystem
                gameState={gameState}
                progress={progress}
                onQuestComplete={gameSystem.completeQuest}
              />
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <div className="text-center p-8">
                <h2 className="text-2xl font-bold mb-4">Hero Profile</h2>
                <p className="text-muted-foreground">Your coding journey and achievements will be displayed here.</p>
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
