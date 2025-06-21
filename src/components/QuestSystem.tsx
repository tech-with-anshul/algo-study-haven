
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Scroll, Sword, Shield, Target, CheckCircle, Clock, Star } from 'lucide-react';

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

interface QuestSystemProps {
  quests: Quest[];
  onQuestComplete: (questId: string) => void;
}

const QuestSystem: React.FC<QuestSystemProps> = ({ quests, onQuestComplete }) => {
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  const getQuestColor = (type: string) => {
    switch (type) {
      case 'daily': return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30';
      case 'weekly': return 'from-purple-500/20 to-pink-500/20 border-purple-500/30';
      case 'epic': return 'from-orange-500/20 to-red-500/20 border-orange-500/30';
      default: return 'from-gray-500/20 to-slate-500/20 border-gray-500/30';
    }
  };

  const getQuestIcon = (type: string) => {
    switch (type) {
      case 'daily': return <Target className="h-5 w-5" />;
      case 'weekly': return <Sword className="h-5 w-5" />;
      case 'epic': return <Shield className="h-5 w-5" />;
      default: return <Scroll className="h-5 w-5" />;
    }
  };

  return (
    <Card className="mb-8 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-2 border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-500">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center text-indigo-600">
          <Scroll className="h-7 w-7 mr-3 animate-pulse" />
          🗡️ Quest Board - Choose Your Adventure!
          <Star className="h-6 w-6 ml-3 text-yellow-500 animate-spin" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quests.map((quest) => (
            <Card 
              key={quest.id} 
              className={`relative overflow-hidden bg-gradient-to-br ${getQuestColor(quest.type)} transition-all duration-300 hover:scale-105 cursor-pointer ${quest.completed ? 'opacity-70' : ''}`}
              onClick={() => setSelectedQuest(quest)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getQuestIcon(quest.type)}
                    <Badge variant={quest.type === 'epic' ? 'default' : 'secondary'} className="text-xs font-bold">
                      {quest.type.toUpperCase()}
                    </Badge>
                  </div>
                  {quest.completed && (
                    <CheckCircle className="h-5 w-5 text-green-500 animate-pulse" />
                  )}
                </div>
                <CardTitle className="text-sm font-bold">{quest.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground mb-3">{quest.description}</p>
                <div className="space-y-2">
                  <Progress value={(quest.progress / quest.target) * 100} className="h-2" />
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">
                      {quest.progress}/{quest.target}
                    </span>
                    <Badge variant="outline" className="text-xs font-bold bg-yellow-50 border-yellow-300 text-yellow-700">
                      +{quest.xpReward} XP
                    </Badge>
                  </div>
                </div>
                {!quest.completed && quest.progress >= quest.target && (
                  <Button 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuestComplete(quest.id);
                    }}
                    className="w-full mt-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold animate-pulse"
                  >
                    🎉 Claim Reward!
                  </Button>
                )}
              </CardContent>
              {quest.type === 'epic' && (
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-b-[30px] border-b-orange-500">
                  <span className="absolute -top-6 -right-4 text-white text-xs font-bold rotate-45">
                    EPIC
                  </span>
                </div>
              )}
            </Card>
          ))}
        </div>
        
        {quests.length === 0 && (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">New quests will appear as you progress on your coding journey!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestSystem;
