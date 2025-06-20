
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Check } from 'lucide-react';

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

  return (
    <Card className="topic-card">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{topic.icon}</span>
                <div>
                  <CardTitle className="text-lg">{topic.name}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <Progress value={topicProgress} className="w-20 h-2" />
                    <Badge variant="secondary" className="text-xs">
                      {topicProgress}%
                    </Badge>
                  </div>
                </div>
              </div>
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {topic.subtopics.map((subtopic) => (
                <div
                  key={subtopic.id}
                  className="subtopic-item"
                >
                  <span className="text-sm">{subtopic.name}</span>
                  <Button
                    size="sm"
                    variant={progress[subtopic.id] ? "default" : "outline"}
                    onClick={() => onSubtopicToggle(subtopic.id)}
                    className="h-8 w-8 p-0"
                  >
                    {progress[subtopic.id] && <Check className="h-3 w-3" />}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default TopicCard;
