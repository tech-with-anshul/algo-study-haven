
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Crown, Sword, Shield, Zap, Star, Trophy } from 'lucide-react';

interface AdventureThemeProps {
  level: number;
  xp: number;
  streak: number;
  children: React.ReactNode;
}

const AdventureTheme: React.FC<AdventureThemeProps> = ({ level, xp, streak, children }) => {
  const getThemeElements = () => {
    if (level >= 30) return { bg: 'from-purple-900/20 via-indigo-900/20 to-blue-900/20', particles: '✨🌟⭐' };
    if (level >= 20) return { bg: 'from-blue-900/20 via-cyan-900/20 to-teal-900/20', particles: '⚔️🛡️🗡️' };
    if (level >= 10) return { bg: 'from-green-900/20 via-emerald-900/20 to-teal-900/20', particles: '🌟💎🔮' };
    return { bg: 'from-slate-900/20 via-gray-900/20 to-zinc-900/20', particles: '✨🌟💫' };
  };

  const theme = getThemeElements();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg} relative overflow-hidden`}>
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce text-2xl opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            {theme.particles[Math.floor(Math.random() * theme.particles.length)]}
          </div>
        ))}
      </div>

      {/* Floating Power-ups */}
      {streak > 0 && (
        <div className="fixed top-20 right-4 z-30 animate-bounce">
          <Badge variant="default" className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl px-4 py-2 text-lg">
            🔥 {streak} Day Streak!
          </Badge>
        </div>
      )}

      {level >= 10 && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-30 animate-pulse">
          <Badge variant="outline" className="bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300 text-purple-800 shadow-xl px-4 py-2 text-lg">
            <Crown className="h-5 w-5 mr-2" />
            Level {level} Hero
          </Badge>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Achievement Notifications */}
      <div className="fixed bottom-4 right-4 z-40 space-y-2">
        {/* These would be populated by achievement system */}
      </div>
    </div>
  );
};

export default AdventureTheme;
