
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Code, Trophy, Target, Zap, BookOpen, Users, Star, CheckCircle, Mail, Phone, Globe, Github, Linkedin, Play, Sparkles, TrendingUp, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentStat, setCurrentStat] = useState(0);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: <Trophy className="h-8 w-8 text-yellow-500" />,
      title: "Gamified Learning",
      description: "Level up, earn XP, and unlock achievements as you master DSA concepts",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: <Target className="h-8 w-8 text-green-500" />,
      title: "Structured Path",
      description: "Follow a carefully designed curriculum from basics to advanced topics",
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: <Zap className="h-8 w-8 text-purple-500" />,
      title: "Interactive Quests",
      description: "Complete daily, weekly, and epic quests to stay motivated",
      color: "from-purple-400 to-pink-500"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-blue-500" />,
      title: "Comprehensive Topics",
      description: "Cover all essential DSA topics with detailed explanations",
      color: "from-blue-400 to-cyan-500"
    }
  ];

  const stats = [
    { label: "DSA Topics", value: "25+", icon: <BookOpen className="h-6 w-6" /> },
    { label: "Practice Problems", value: "500+", icon: <Code className="h-6 w-6" /> },
    { label: "Achievement Badges", value: "50+", icon: <Award className="h-6 w-6" /> },
    { label: "Learning Hours", value: "100+", icon: <TrendingUp className="h-6 w-6" /> }
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

  // Animate stats counter
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-20 h-20 bg-indigo-200 rounded-full opacity-30 animate-bounce-slow"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-pink-200 rounded-full opacity-25 animate-pulse"></div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-indigo-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white animate-pulse hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-4 h-4 mr-2" />
              Master Data Structures & Algorithms
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 animate-fade-in">
              Level Up Your
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent block animate-scale-in">
                Coding Skills
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-slide-up">
              Transform your programming journey with our gamified DSA learning platform. 
              Earn XP, unlock achievements, and master algorithms like never before!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                onClick={() => navigate('/tracker')}
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg font-semibold hover:scale-105 transition-all duration-300 group"
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Stats Section */}
      <div className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`text-center p-6 rounded-xl transition-all duration-500 hover:scale-105 cursor-pointer ${
                  currentStat === index 
                    ? 'bg-gradient-to-br from-purple-50 to-indigo-50 shadow-lg border-2 border-purple-200' 
                    : 'hover:bg-white/80 hover:shadow-md'
                }`}
                onMouseEnter={() => setCurrentStat(index)}
              >
                <div className={`mx-auto mb-3 p-3 rounded-full transition-all duration-300 ${
                  currentStat === index 
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white scale-110' 
                    : 'bg-gray-100 text-purple-600'
                }`}>
                  {stat.icon}
                </div>
                <div className={`text-4xl font-bold mb-2 transition-all duration-300 ${
                  currentStat === index ? 'text-purple-600 scale-110' : 'text-purple-600'
                }`}>
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience a revolutionary approach to learning DSA with gamification and structured progression
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`border-2 border-gray-100 hover:border-purple-200 transition-all duration-300 group cursor-pointer transform hover:scale-105 ${
                  hoveredFeature === index ? 'shadow-xl bg-gradient-to-br from-white to-purple-50' : 'hover:shadow-lg'
                }`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto mb-4 p-3 rounded-full transition-all duration-500 ${
                    hoveredFeature === index 
                      ? `bg-gradient-to-r ${feature.color} text-white shadow-lg scale-110` 
                      : 'bg-gray-50 group-hover:bg-purple-50'
                  }`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-purple-700 transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Animated Topics Section */}
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
              <div 
                key={index} 
                className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 group cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium text-gray-800 group-hover:text-purple-700 transition-colors duration-300">{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Creator Section */}
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
          
          <Card className="max-w-4xl mx-auto border-2 border-purple-100 hover:border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-500 group">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img 
                      src="https://res.cloudinary.com/djrttnwvt/image/upload/v1750468177/DAY_1_ppbvml.jpg" 
                      alt="Anshul - The Creator"
                      className="w-64 h-64 object-cover rounded-full border-4 border-purple-200 shadow-lg hover:scale-105 transition-transform duration-300 group-hover:border-purple-300"
                    />
                    <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Code className="h-6 w-6" />
                    </div>
                  </div>
                </div>
                
                {/* Creator Info */}
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors duration-300">Anshul</h3>
                  <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm px-3 py-1 hover:scale-105 transition-transform duration-300">
                    Full Stack Developer
                  </Badge>
                  
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
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
                      className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 rounded-lg border border-purple-200 hover:border-purple-300 transition-all duration-300 group/link hover:scale-105"
                    >
                      <Globe className="h-5 w-5 text-purple-600 group-hover/link:scale-110 transition-transform" />
                      <span className="font-medium text-purple-700">Official Website</span>
                    </a>
                    
                    <a 
                      href="mailto:kanshulmussoorie@gmail.com"
                      className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-lg border border-green-200 hover:border-green-300 transition-all duration-300 group/link hover:scale-105"
                    >
                      <Mail className="h-5 w-5 text-green-600 group-hover/link:scale-110 transition-transform" />
                      <span className="font-medium text-green-700">Email</span>
                    </a>
                    
                    <a 
                      href="tel:+919410147660"
                      className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-lg border border-blue-200 hover:border-blue-300 transition-all duration-300 group/link hover:scale-105"
                    >
                      <Phone className="h-5 w-5 text-blue-600 group-hover/link:scale-110 transition-transform" />
                      <span className="font-medium text-blue-700">+91 9410147660</span>
                    </a>
                    
                    <a 
                      href="https://www.linkedin.com/in/anshultech1" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 rounded-lg border border-indigo-200 hover:border-indigo-300 transition-all duration-300 group/link hover:scale-105"
                    >
                      <Linkedin className="h-5 w-5 text-indigo-600 group-hover/link:scale-110 transition-transform" />
                      <span className="font-medium text-indigo-700">LinkedIn</span>
                    </a>
                  </div>
                  
                  {/* GitHub Link */}
                  <div className="mt-4">
                    <a 
                      href="https://github.com/tech-with-anshul" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 p-3 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg transition-all duration-300 group/github shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      <Github className="h-5 w-5 group-hover/github:scale-110 transition-transform" />
                      <span className="font-medium">Follow on GitHub</span>
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced CTA Section */}
      <div className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full animate-bounce-slow"></div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6 animate-fade-in">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl text-purple-100 mb-8 animate-slide-up">
            Join thousands of developers who have transformed their coding skills with our platform
          </p>
          <Button 
            size="lg" 
            className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group animate-scale-in"
            onClick={() => navigate('/tracker')}
          >
            Begin Your Journey Now
            <Star className="ml-2 h-5 w-5 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" />
          </Button>
        </div>
      </div>

      {/* Enhanced Footer */}
      <div className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4 group hover:text-purple-300 transition-colors duration-300">
              DSA Tracker
            </h3>
            <p className="text-gray-400 mb-6">Master algorithms, level up your skills</p>
            <div className="flex justify-center space-x-6">
              <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-purple-600/20 transition-all duration-300">
                About
              </Button>
              <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-purple-600/20 transition-all duration-300">
                Features
              </Button>
              <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-purple-600/20 transition-all duration-300">
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
