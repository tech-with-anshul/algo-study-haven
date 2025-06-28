
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Settings, Trash2, Edit, Sparkles } from 'lucide-react';
import CustomTopicForm from './CustomTopicForm';
import { toast } from '@/hooks/use-toast';

interface CustomTopicsManagerProps {
  customTopics: any[];
  onTopicCreate: (topic: any) => void;
  onTopicDelete: (topicId: string) => void;
  progress: Record<string, Record<string, boolean>>;
}

const CustomTopicsManager: React.FC<CustomTopicsManagerProps> = ({
  customTopics,
  onTopicCreate,
  onTopicDelete,
  progress
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleDeleteTopic = (topicId: string, topicName: string) => {
    if (window.confirm(`Are you sure you want to delete "${topicName}"? This action cannot be undone.`)) {
      onTopicDelete(topicId);
      toast({
        title: "🗑️ Topic Deleted",
        description: `Custom topic "${topicName}" has been removed from your adventure.`,
        duration: 3000,
      });
    }
  };

  const calculateTopicProgress = (topicId: string, subtopics: any[]) => {
    if (!subtopics.length) return 0;
    const completed = subtopics.filter(sub => progress[topicId]?.[sub.id]).length;
    return Math.round((completed / subtopics.length) * 100);
  };

  return (
    <Card className="mb-8 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold flex items-center text-purple-700">
            <Sparkles className="h-6 w-6 mr-2 animate-pulse" />
            🎨 Your Custom Topics ({customTopics.length})
          </CardTitle>
          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold">
                <Plus className="h-5 w-5 mr-2" />
                Create New Topic
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <CustomTopicForm
                onTopicCreate={onTopicCreate}
                onClose={() => setShowCreateForm(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {customTopics.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-purple-700 mb-2">No Custom Topics Yet!</h3>
            <p className="text-purple-600 mb-6">
              Create your own learning paths tailored to your specific needs and interests.
            </p>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-8 py-3"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Custom Topic
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customTopics.map((topic) => {
              const topicProgress = calculateTopicProgress(topic.id, topic.subtopics);
              const isComplete = topicProgress === 100;
              
              return (
                <Card
                  key={topic.id}
                  className={`group hover:shadow-lg transition-all duration-300 border-2 ${
                    isComplete 
                      ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50' 
                      : 'border-purple-200 hover:border-purple-300'
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{topic.icon}</span>
                        <div>
                          <h4 className="font-bold text-purple-800">{topic.name}</h4>
                          {topic.description && (
                            <p className="text-xs text-purple-600 mt-1">{topic.description}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTopic(topic.id, topic.name)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant={isComplete ? "default" : "secondary"}
                        className={`text-xs ${isComplete ? 'bg-green-500' : 'bg-purple-100 text-purple-800'}`}
                      >
                        {topicProgress}% Complete
                      </Badge>
                      <span className="text-xs text-purple-600">
                        {topic.subtopics.filter((sub: any) => progress[topic.id]?.[sub.id]).length}/{topic.subtopics.length} done
                      </span>
                    </div>
                    <div className="w-full bg-purple-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          isComplete ? 'bg-green-500' : 'bg-purple-500'
                        }`}
                        style={{ width: `${topicProgress}%` }}
                      />
                    </div>
                    {isComplete && (
                      <div className="mt-2 text-center">
                        <Badge className="bg-green-100 text-green-800 border-green-300">
                          🏆 Mastered!
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomTopicsManager;
