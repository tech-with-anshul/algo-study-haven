
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sword, Shield, Zap, Crown, Flame, Star, Trophy, Target } from 'lucide-react';

interface GameStatsProps {
  xp: number;
  level: number;
  streak: number;
  achievements: string[];
  totalStudyTime: number;
  completedTopics: number;
}

const GameStats: React.FC<GameStatsProps> = ({
  xp,
  level,
  streak,
  achievements,
  totalStudyTime,
  completedTopics
}) => {
  const xpForNextLevel = level * 1000;
  const currentLevelXp = xp % 1000;
  const xpProgress = (currentLevelXp / 1000) * 100;

  const getRankTitle = (level: number) => {
    if (level >= 50) return "🏆 DSA Grandmaster";
    if (level >= 40) return "⚔️ Algorithm Warrior";
    if (level >= 30) return "🧙‍♂️ Code Wizard";
    if (level >= 20) return "🛡️ Data Knight";
    if (level >= 10) return "🗡️ Logic Adventurer";
    return "🌟 Code Explorer";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {/* Level & XP */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-blue-500/10 border-2 border-purple-500/20 hover:border-purple-500/40 transition-all duration-500 hover:scale-105 group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <CardHeader className="pb-2 relative z-10">
          <CardTitle className="text-sm font-bold flex items-center text-purple-600">
            <Crown className="h-5 w-5 mr-2 animate-pulse" />
            Level & Rank
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-4xl font-bold text-purple-600 flex items-center">
                {level}
                <Zap className="h-6 w-6 ml-2 text-yellow-500 animate-bounce" />
              </div>
              <Badge variant="outline" className="bg-purple-50 border-purple-300 text-purple-700 hover:scale-105 transition-transform">
                {Math.floor(totalStudyTime / 3600)}h studied
              </Badge>
            </div>
            <Progress value={xpProgress} className="h-3 bg-purple-100" />
            <div className="text-xs text-muted-foreground font-medium">
              {currentLevelXp} / 1000 XP to next level
            </div>
            <Badge variant="secondary" className="w-full justify-center text-xs font-bold bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border-purple-200">
              {getRankTitle(level)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Streak */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-orange-500/10 via-red-500/10 to-pink-500/10 border-2 border-orange-500/20 hover:border-orange-500/40 transition-all duration-500 hover:scale-105 group">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <CardHeader className="pb-2 relative z-10">
          <CardTitle className="text-sm font-bold flex items-center text-orange-600">
            <Flame className="h-5 w-5 mr-2 animate-pulse" />
            Streak Power
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="space-y-3">
            <div className="text-5xl font-bold text-orange-600 flex items-center justify-center animate-pulse">
              🔥 {streak}
            </div>
            <div className="text-center">
              <Badge variant="outline" className="bg-orange-50 border-orange-300 text-orange-700">
                {streak > 0 ? `${streak} day${streak > 1 ? 's' : ''} on fire!` : 'Start your streak!'}
              </Badge>
            </div>
            {streak >= 7 && (
              <div className="text-center animate-bounce">
                <Badge variant="default" className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
                  🏆 Week Warrior!
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Total XP */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 border-2 border-green-500/20 hover:border-green-500/40 transition-all duration-500 hover:scale-105 group">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <CardHeader className="pb-2 relative z-10">
          <CardTitle className="text-sm font-bold flex items-center text-green-600">
            <Star className="h-5 w-5 mr-2 animate-spin" />
            Total Experience
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="space-y-3">
            <div className="text-4xl font-bold text-green-600 flex items-center">
              {xp.toLocaleString()}
              <span className="text-lg ml-2">XP</span>
            </div>
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700">
                ⚔️ {completedTopics} Topics Conquered
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-yellow-500/10 via-amber-500/10 to-orange-500/10 border-2 border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-500 hover:scale-105 group">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 to-amber-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <CardHeader className="pb-2 relative z-10">
          <CardTitle className="text-sm font-bold flex items-center text-yellow-600">
            <Trophy className="h-5 w-5 mr-2 animate-bounce" />
            Achievement Hall
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="space-y-3">
            <div className="text-4xl font-bold text-yellow-600 flex items-center">
              🏆 {achievements.length}
            </div>
            <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
              {achievements.slice(0, 3).map((achievement, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-yellow-50 border-yellow-300 text-yellow-700 hover:scale-105 transition-transform">
                  {achievement}
                </Badge>
              ))}
              {achievements.length > 3 && (
                <Badge variant="outline" className="text-xs bg-yellow-50 border-yellow-300 text-yellow-700">
                  +{achievements.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameStats;
