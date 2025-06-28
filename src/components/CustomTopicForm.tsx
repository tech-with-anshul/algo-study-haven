
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Plus, X, Save, BookOpen } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';

interface CustomTopicFormProps {
  onTopicCreate: (topic: any) => void;
  onClose: () => void;
}

const CustomTopicForm: React.FC<CustomTopicFormProps> = ({ onTopicCreate, onClose }) => {
  const [subtopics, setSubtopics] = useState<string[]>(['']);
  const [currentSubtopic, setCurrentSubtopic] = useState('');

  const form = useForm({
    defaultValues: {
      name: '',
      icon: '📚',
      description: ''
    }
  });

  const addSubtopic = () => {
    if (currentSubtopic.trim()) {
      setSubtopics([...subtopics.filter(s => s), currentSubtopic.trim()]);
      setCurrentSubtopic('');
    }
  };

  const removeSubtopic = (index: number) => {
    setSubtopics(subtopics.filter((_, i) => i !== index));
  };

  const onSubmit = (data: any) => {
    if (subtopics.filter(s => s).length === 0) {
      toast({
        title: "❌ Missing Subtopics",
        description: "Please add at least one subtopic to your custom topic!",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const customTopic = {
      id: `custom-${Date.now()}`,
      name: data.name,
      icon: data.icon,
      description: data.description,
      isCustom: true,
      subtopics: subtopics
        .filter(s => s.trim())
        .map((name, index) => ({
          id: `${data.name.toLowerCase().replace(/\s+/g, '-')}-${index}`,
          name: name.trim(),
          completed: false
        }))
    };

    onTopicCreate(customTopic);
    
    toast({
      title: "🎉 Custom Topic Created!",
      description: `Your custom topic "${data.name}" has been added to your adventure!`,
      duration: 4000,
    });

    onClose();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold flex items-center text-purple-700">
            <BookOpen className="h-6 w-6 mr-2" />
            🚀 Create Your Custom Topic
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Topic name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-purple-700 font-medium">Topic Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Machine Learning Algorithms" 
                        {...field}
                        className="border-purple-300 focus:border-purple-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-purple-700 font-medium">Icon (Emoji)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="🤖" 
                        {...field}
                        className="border-purple-300 focus:border-purple-500"
                        maxLength={2}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-purple-700 font-medium">Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description of what this topic covers..."
                      {...field}
                      className="border-purple-300 focus:border-purple-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel className="text-purple-700 font-medium">Subtopics</FormLabel>
              
              <div className="flex space-x-2">
                <Input
                  placeholder="Add a subtopic..."
                  value={currentSubtopic}
                  onChange={(e) => setCurrentSubtopic(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtopic())}
                  className="border-purple-300 focus:border-purple-500"
                />
                <Button
                  type="button"
                  onClick={addSubtopic}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-purple-50 rounded-lg border border-purple-200">
                {subtopics.filter(s => s).length === 0 ? (
                  <span className="text-purple-400 text-sm">No subtopics added yet...</span>
                ) : (
                  subtopics.filter(s => s).map((subtopic, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-purple-100 text-purple-800 hover:bg-purple-200 cursor-pointer"
                      onClick={() => removeSubtopic(index)}
                    >
                      {subtopic}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))
                )}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-3"
              >
                <Save className="h-5 w-5 mr-2" />
                Create Custom Topic
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="px-6 border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CustomTopicForm;
