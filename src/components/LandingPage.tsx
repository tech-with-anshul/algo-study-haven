
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Code, Trophy, Target, Zap, BookOpen, Users, Star, CheckCircle, Mail, Phone, Globe, Github, Linkedin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Trophy className="h-8 w-8 text-yellow-500" />,
      title: "Gamified Learning",
      description: "Level up, earn XP, and unlock achievements as you master DSA concepts"
    },
    {
      icon: <Target className="h-8 w-8 text-green-500" />,
      title: "Structured Path",
      description: "Follow a carefully designed curriculum from basics to advanced topics"
    },
    {
      icon: <Zap className="h-8 w-8 text-purple-500" />,
      title: "Interactive Quests",
      description: "Complete daily, weekly, and epic quests to stay motivated"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-blue-500" />,
      title: "Comprehensive Topics",
      description: "Cover all essential DSA topics with detailed explanations"
    }
  ];

  const stats = [
    { label: "DSA Topics", value: "25+" },
    { label: "Practice Problems", value: "500+" },
    { label: "Achievement Badges", value: "50+" },
    { label: "Learning Hours", value: "100+" }
  ];

  const topics = [
    "Arrays & Strings",
    "Linked Lists",
    "Stacks & Queues",
    "Trees & Graphs",
    "Dynamic Programming",
    "Sorting Algorithms",
    "Hash Tables",
    "Binary Search"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-indigo-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
              🚀 Master Data Structures & Algorithms
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Level Up Your
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent block">
                Coding Skills
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transform your programming journey with our gamified DSA learning platform. 
              Earn XP, unlock achievements, and master algorithms like never before!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => navigate('/tracker')}
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg font-semibold"
              >
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience a revolutionary approach to learning DSA with gamification and structured progression
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all duration-300 group">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-gray-50 rounded-full group-hover:bg-purple-50 transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Topics Section */}
      <div className="py-20 bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Master Essential Topics
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive coverage of all important data structures and algorithms
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topics.map((topic, index) => (
              <div key={index} className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span className="font-medium text-gray-800">{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* The Creator Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              The Creator
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Meet the developer behind this amazing DSA learning platform
            </p>
          </div>
          
          <Card className="max-w-4xl mx-auto border-2 border-purple-100 hover:border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-500">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img 
                      src="https://res.cloudinary.com/djrttnwvt/image/upload/v1750468177/DAY_1_ppbvml.jpg" 
                      alt="Anshul - The Creator"
                      className="w-64 h-64 object-cover rounded-full border-4 border-purple-200 shadow-lg hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 rounded-full shadow-lg">
                      <Code className="h-6 w-6" />
                    </div>
                  </div>
                </div>
                
                {/* Creator Info */}
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Anshul</h3>
                  <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm px-3 py-1">
                    Full Stack Developer
                  </Badge>
                  
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    Passionate about creating innovative educational tools that make learning programming 
                    concepts engaging and accessible. With expertise in modern web technologies, I've crafted 
                    this gamified platform to transform how developers master Data Structures and Algorithms.
                  </p>
                  
                  {/* Contact Links */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <a 
                      href="https://www.dev-anshul.tech/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 rounded-lg border border-purple-200 hover:border-purple-300 transition-all duration-300 group"
                    >
                      <Globe className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
                      <span className="font-medium text-purple-700">Official Website</span>
                    </a>
                    
                    <a 
                      href="mailto:kanshulmussoorie@gmail.com"
                      className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-lg border border-green-200 hover:border-green-300 transition-all duration-300 group"
                    >
                      <Mail className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
                      <span className="font-medium text-green-700">Email</span>
                    </a>
                    
                    <a 
                      href="tel:+919410147660"
                      className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-lg border border-blue-200 hover:border-blue-300 transition-all duration-300 group"
                    >
                      <Phone className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
                      <span className="font-medium text-blue-700">+91 9410147660</span>
                    </a>
                    
                    <a 
                      href="https://www.linkedin.com/in/anshultech1" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 rounded-lg border border-indigo-200 hover:border-indigo-300 transition-all duration-300 group"
                    >
                      <Linkedin className="h-5 w-5 text-indigo-600 group-hover:scale-110 transition-transform" />
                      <span className="font-medium text-indigo-700">LinkedIn</span>
                    </a>
                  </div>
                  
                  {/* GitHub Link */}
                  <div className="mt-4">
                    <a 
                      href="https://github.com/tech-with-anshul" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 p-3 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg transition-all duration-300 group shadow-lg hover:shadow-xl"
                    >
                      <Github className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Follow on GitHub</span>
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of developers who have transformed their coding skills with our platform
          </p>
          <Button 
            size="lg" 
            className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => navigate('/tracker')}
          >
            Begin Your Journey Now
            <Star className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">DSA Adventure</h3>
            <p className="text-gray-400 mb-6">Master algorithms, level up your skills</p>
            <div className="flex justify-center space-x-6">
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                About
              </Button>
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                Features
              </Button>
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                Contact
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
