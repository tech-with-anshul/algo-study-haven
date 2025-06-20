
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Check, Star, Zap } from 'lucide-react';

interface Subtopic {
  id: string;
  name: string;
}

interface Topic {
  id: string;
  name: string;
  icon: string;
  subtopics: Subtopic[];
}

interface TopicCardProps {
  topic: Topic;
  progress: Record<string, boolean>;
  onSubtopicToggle: (subtopicId: string) => void;
  topicProgress: number;
}

const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  progress,
  onSubtopicToggle,
  topicProgress
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [animatingSubtopic, setAnimatingSubtopic] = useState<string | null>(null);

  const handleSubtopicToggle = (subtopicId: string) => {
    setAnimatingSubtopic(subtopicId);
    onSubtopicToggle(subtopicId);
    setTimeout(() => setAnimatingSubtopic(null), 500);
  };

  const completedCount = topic.subtopics.filter(sub => progress[sub.id]).length;
  const isTopicComplete = topicProgress === 100;

  return (
    <Card className={`topic-card group hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border-2 ${
      isTopicComplete 
        ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20' 
        : 'hover:border-primary/20'
    }`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-accent/50 transition-all duration-300 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`text-3xl transition-transform duration-300 group-hover:scale-110 ${isOpen ? 'animate-bounce' : ''}`}>
                  {topic.icon}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <span>{topic.name}</span>
                    {isTopicComplete && (
                      <div className="flex items-center space-x-1 animate-fade-in">
                        <Star className="h-4 w-4 text-yellow-500 animate-pulse" />
                        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                          Complete!
                        </Badge>
                      </div>
                    )}
                  </CardTitle>
                  <div className="flex items-center space-x-3 mt-2">
                    <Progress 
                      value={topicProgress} 
                      className="w-32 h-2 transition-all duration-500" 
                    />
                    <Badge 
                      variant={topicProgress === 100 ? "default" : "secondary"} 
                      className={`text-xs px-2 transition-all duration-300 ${
                        topicProgress === 100 ? 'bg-green-500 animate-pulse' : ''
                      }`}
                    >
                      {topicProgress}%
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {completedCount}/{topic.subtopics.length}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {topicProgress > 0 &&
                <Zap className={`h-4 w-4 text-yellow-500 transition-all duration-300 ${isOpen ? 'animate-spin' : ''}`} />
                }
                {isOpen ? (
                  <ChevronDown className="h-5 w-5 transition-transform duration-300" />
                ) : (
                  <ChevronRight className="h-5 w-5 transition-transform duration-300" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent className="transition-all duration-500">
          <CardContent className="pt-0 space-y-1">
            {topic.subtopics.map((subtopic, index) => (
              <div
                key={subtopic.id}
                className={`subtopic-item group/item p-3 rounded-lg transition-all duration-300 hover:bg-accent/30 hover:scale-[1.01] ${
                  progress[subtopic.id] 
                    ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800' 
                    : 'hover:bg-accent/20'
                } ${animatingSubtopic === subtopic.id ? 'animate-pulse scale-105' : ''}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm transition-all duration-200 ${
                    progress[subtopic.id] 
                      ? 'text-green-700 dark:text-green-300 font-medium' 
                      : 'group-hover/item:text-foreground'
                  }`}>
                    {progress[subtopic.id] && '✅ '}
                    {subtopic.name}
                  </span>
                  <Button
                    size="sm"
                    variant={progress[subtopic.id] ? "default" : "outline"}
                    onClick={() => handleSubtopicToggle(subtopic.id)}
                    className={`h-8 w-8 p-0 transition-all duration-300 hover:scale-110 ${
                      progress[subtopic.id] 
                        ? 'bg-green-500 hover:bg-green-600 shadow-lg' 
                        : 'hover:bg-primary hover:text-primary-foreground'
                    }`}
                  >
                    {progress[subtopic.id] ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border-2 border-current opacity-50 group-hover/item:opacity-100 transition-opacity" />
                    )}
                  </Button>
                </div>
                {progress[subtopic.id] && (
                  <div className="mt-1 text-xs text-green-600 dark:text-green-400 animate-fade-in">
                    Completed! Great job! 🎉
                  </div>
                )}
              </div>
            ))}
            
            {isTopicComplete && (
              <div className="mt-4 p-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 animate-fade-in">
                <div className="flex items-center space-x-2 text-green-700 dark:text-green-300">
                  <Trophy className="h-4 w-4" />
                  <span className="text-sm font-medium">Topic Mastered! 🏆</span>
                </div>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  You've completed all subtopics in this section. Excellent work!
                </p>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default TopicCard;
