import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Code, Trophy, Target, Zap, BookOpen, Users, Star, CheckCircle, Mail, Phone, Globe, Github, Linkedin, Play, Sparkles, TrendingUp, Award, Brain, Rocket, Lightbulb, ChevronDown, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentStat, setCurrentStat] = useState(0);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Trophy className="h-10 w-10 text-yellow-500" />,
      title: "Gamified Learning",
      description: "Level up, earn XP, and unlock achievements as you master DSA concepts with our revolutionary reward system",
      color: "from-yellow-400 to-orange-500",
      gradient: "bg-gradient-to-br from-yellow-50 to-orange-50"
    },
    {
      icon: <Target className="h-10 w-10 text-green-500" />,
      title: "Structured Learning Path",
      description: "Follow a carefully designed curriculum from basics to advanced topics with progressive difficulty",
      color: "from-green-400 to-emerald-500",
      gradient: "bg-gradient-to-br from-green-50 to-emerald-50"
    },
    {
      icon: <Zap className="h-10 w-10 text-purple-500" />,
      title: "Interactive Quests",
      description: "Complete daily, weekly, and epic quests to stay motivated and track your learning journey",
      color: "from-purple-400 to-pink-500",
      gradient: "bg-gradient-to-br from-purple-50 to-pink-50"
    },
    {
      icon: <Brain className="h-10 w-10 text-blue-500" />,
      title: "Smart Progress Tracking",
      description: "Advanced analytics and insights to monitor your growth and identify areas for improvement",
      color: "from-blue-400 to-cyan-500",
      gradient: "bg-gradient-to-br from-blue-50 to-cyan-50"
    },
    {
      icon: <Lightbulb className="h-10 w-10 text-indigo-500" />,
      title: "Custom Topics",
      description: "Create your own learning modules and tailor the experience to your specific needs",
      color: "from-indigo-400 to-purple-500",
      gradient: "bg-gradient-to-br from-indigo-50 to-purple-50"
    },
    {
      icon: <Rocket className="h-10 w-10 text-red-500" />,
      title: "Performance Analytics",
      description: "Detailed insights into your learning patterns with comprehensive progress reports",
      color: "from-red-400 to-pink-500",
      gradient: "bg-gradient-to-br from-red-50 to-pink-50"
    }
  ];

  const stats = [
    { label: "DSA Topics", value: "25+", icon: <BookOpen className="h-8 w-8" />, color: "text-blue-600" },
    { label: "Practice Problems", value: "500+", icon: <Code className="h-8 w-8" />, color: "text-green-600" },
    { label: "Achievement Badges", value: "50+", icon: <Award className="h-8 w-8" />, color: "text-yellow-600" },
    { label: "Learning Hours", value: "100+", icon: <TrendingUp className="h-8 w-8" />, color: "text-purple-600" }
  ];

  const topics = [
    "Arrays & Strings", "Linked Lists", "Stacks & Queues", "Trees & Graphs",
    "Dynamic Programming", "Sorting Algorithms", "Hash Tables", "Binary Search",
    "Greedy Algorithms", "Backtracking", "Bit Manipulation", "Graph Algorithms"
  ];

  // Animate stats counter
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 overflow-x-hidden">
      {/* Floating Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-white/95 backdrop-blur-lg shadow-xl' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                DSA Tracker
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">Features</a>
              <a href="#topics" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">Topics</a>
              <a href="#creator" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">Creator</a>
              <Button 
                onClick={() => navigate('/tracker')}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Start Learning
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200">
            <div className="px-4 py-2 space-y-2">
              <a href="#features" className="block py-2 text-gray-600 hover:text-purple-600 transition-colors">Features</a>
              <a href="#topics" className="block py-2 text-gray-600 hover:text-purple-600 transition-colors">Topics</a>
              <a href="#creator" className="block py-2 text-gray-600 hover:text-purple-600 transition-colors">Creator</a>
              <Button 
                onClick={() => navigate('/tracker')}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white mt-2"
              >
                Start Learning
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden pt-20 pb-32">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-purple-200 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-indigo-200 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-pink-200 rounded-full opacity-15 animate-pulse"></div>
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-yellow-200 rounded-full opacity-20 animate-bounce"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white animate-pulse hover:scale-105 transition-transform duration-300 px-6 py-3 text-lg rounded-full shadow-lg">
                <Sparkles className="w-5 h-5 mr-2" />
                Master Data Structures & Algorithms
              </Badge>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-8 animate-fade-in leading-tight">
              Level Up Your
              <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent block animate-scale-in mt-4">
                Coding Journey
              </span>
            </h1>
            
            <p className="text-2xl text-gray-600 mb-12 max-w-4xl mx-auto animate-slide-up leading-relaxed">
              Transform your programming skills with our gamified DSA learning platform. 
              Earn XP, unlock achievements, and master algorithms like never before!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-12 py-6 text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 group rounded-full"
                onClick={() => navigate('/tracker')}
              >
                <Rocket className="mr-3 h-6 w-6 group-hover:animate-bounce" />
                Start Your Adventure
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-3 border-purple-600 text-purple-600 hover:bg-purple-50 px-12 py-6 text-xl font-bold hover:scale-110 transition-all duration-500 group rounded-full shadow-xl"
              >
                <Play className="mr-3 h-6 w-6 group-hover:scale-125 transition-transform duration-300" />
                Watch Demo
              </Button>
            </div>

            {/* Scroll Indicator */}
            <div className="mt-20 animate-bounce">
              <ChevronDown className="h-8 w-8 text-purple-600 mx-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Interactive Stats Section */}
      <div className="py-24 bg-gradient-to-r from-white to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Why Developers Choose Us
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of developers who have accelerated their career growth
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`text-center p-8 rounded-2xl transition-all duration-700 hover:scale-110 cursor-pointer group ${
                  currentStat === index 
                    ? 'bg-gradient-to-br from-purple-50 to-indigo-50 shadow-2xl border-2 border-purple-200 transform scale-110' 
                    : 'hover:bg-white hover:shadow-xl bg-white/50 backdrop-blur-sm'
                }`}
                onMouseEnter={() => setCurrentStat(index)}
              >
                <div className={`mx-auto mb-6 p-4 rounded-full transition-all duration-500 ${
                  currentStat === index 
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white scale-125 shadow-xl' 
                    : 'bg-gray-100 text-purple-600 group-hover:bg-purple-100 group-hover:scale-110'
                }`}>
                  {stat.icon}
                </div>
                <div className={`text-5xl font-bold mb-4 transition-all duration-500 ${
                  currentStat === index ? 'text-purple-600 scale-125' : stat.color
                }`}>
                  {stat.value}
                </div>
                <div className="text-gray-700 font-semibold text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Features Section */}
      <div id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-fade-in">
            <Badge className="mb-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 text-lg rounded-full">
              Premium Features
            </Badge>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience a revolutionary approach to learning DSA with cutting-edge gamification
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`border-2 border-gray-100 hover:border-purple-200 transition-all duration-500 group cursor-pointer transform hover:scale-105 hover:rotate-1 ${
                  hoveredFeature === index ? `shadow-2xl ${feature.gradient} border-purple-300` : 'hover:shadow-xl'
                }`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <CardHeader className="text-center pb-6">
                  <div className={`mx-auto mb-6 p-4 rounded-full transition-all duration-700 ${
                    hoveredFeature === index 
                      ? `bg-gradient-to-r ${feature.color} text-white shadow-2xl scale-125 animate-pulse` 
                      : 'bg-gray-50 group-hover:bg-purple-50 group-hover:scale-110'
                  }`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors duration-300 mb-4">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center group-hover:text-gray-700 transition-colors duration-300 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Topics Section */}
      <div id="topics" className="py-24 bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 text-lg rounded-full">
              Comprehensive Curriculum
            </Badge>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Master Essential Topics
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete coverage of all important data structures and algorithms with hands-on practice
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {topics.map((topic, index) => (
              <div 
                key={index} 
                className="flex items-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 group cursor-pointer animate-fade-in border-2 border-transparent hover:border-purple-200"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mr-4 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <span className="font-semibold text-gray-800 group-hover:text-purple-700 transition-colors duration-300 text-lg">
                  {topic}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Creator Section */}
      <div id="creator" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 text-lg rounded-full">
              Meet the Visionary
            </Badge>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              The Creator
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the passionate developer behind this revolutionary learning platform
            </p>
          </div>
          
          <Card className="max-w-5xl mx-auto border-2 border-purple-100 hover:border-purple-200 shadow-2xl hover:shadow-3xl transition-all duration-700 group rounded-3xl overflow-hidden">
            <CardContent className="p-12">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full animate-pulse opacity-20"></div>
                    <img 
                      src="https://res.cloudinary.com/djrttnwvt/image/upload/v1750468177/DAY_1_ppbvml.jpg" 
                      alt="Anshul - The Creator"
                      className="w-80 h-80 object-cover rounded-full border-4 border-purple-200 shadow-2xl hover:scale-110 transition-transform duration-500 group-hover:border-purple-400 relative z-10"
                    />
                    <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl group-hover:scale-125 transition-transform duration-500 z-20">
                      <Code className="h-8 w-8" />
                    </div>
                  </div>
                </div>
                
                {/* Creator Info */}
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-4xl font-bold text-gray-900 mb-4 group-hover:text-purple-700 transition-colors duration-300">
                    Anshul
                  </h3>
                  <Badge className="mb-6 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-lg px-6 py-3 hover:scale-110 transition-transform duration-300 rounded-full shadow-lg">
                    Full Stack Developer & Educator
                  </Badge>
                  
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    Passionate about creating innovative educational tools that make learning programming 
                    concepts engaging and accessible. With expertise in modern web technologies, I've crafted 
                    this gamified platform to transform how developers master Data Structures and Algorithms.
                  </p>
                  
                  {/* Contact Links */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <a 
                      href="https://www.dev-anshul.tech/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 rounded-xl border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 group/link hover:scale-105 shadow-lg"
                    >
                      <Globe className="h-6 w-6 text-purple-600 group-hover/link:scale-125 transition-transform" />
                      <span className="font-semibold text-purple-700">Official Website</span>
                    </a>
                    
                    <a 
                      href="mailto:kanshulmussoorie@gmail.com"
                      className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl border-2 border-green-200 hover:border-green-300 transition-all duration-300 group/link hover:scale-105 shadow-lg"
                    >
                      <Mail className="h-6 w-6 text-green-600 group-hover/link:scale-125 transition-transform" />
                      <span className="font-semibold text-green-700">Email</span>
                    </a>
                    
                    <a 
                      href="tel:+919410147660"
                      className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-xl border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 group/link hover:scale-105 shadow-lg"
                    >
                      <Phone className="h-6 w-6 text-blue-600 group-hover/link:scale-125 transition-transform" />
                      <span className="font-semibold text-blue-700">+91 9410147660</span>
                    </a>
                    
                    <a 
                      href="https://www.linkedin.com/in/anshultech1" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 rounded-xl border-2 border-indigo-200 hover:border-indigo-300 transition-all duration-300 group/link hover:scale-105 shadow-lg"
                    >
                      <Linkedin className="h-6 w-6 text-indigo-600 group-hover/link:scale-125 transition-transform" />
                      <span className="font-semibold text-indigo-700">LinkedIn</span>
                    </a>
                  </div>
                  
                  {/* GitHub Link */}
                  <div className="text-center">
                    <a 
                      href="https://github.com/tech-with-anshul" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 p-4 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl transition-all duration-300 group/github shadow-2xl hover:shadow-3xl hover:scale-105"
                    >
                      <Github className="h-6 w-6 group-hover/github:scale-125 transition-transform" />
                      <span className="font-semibold text-lg">Follow on GitHub</span>
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced CTA Section */}
      <div className="py-32 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        
        <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-6xl font-bold text-white mb-8 animate-fade-in">
            Ready to Transform Your Career? 🚀
          </h2>
          <p className="text-2xl text-purple-100 mb-12 animate-slide-up max-w-3xl mx-auto leading-relaxed">
            Join thousands of developers who have accelerated their growth and landed their dream jobs
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-50 px-12 py-6 text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 group animate-scale-in rounded-full"
              onClick={() => navigate('/tracker')}
            >
              <Rocket className="mr-3 h-6 w-6 group-hover:animate-bounce" />
              Begin Your Journey Now
              <Star className="ml-3 h-6 w-6 group-hover:rotate-12 group-hover:scale-125 transition-transform duration-300" />
            </Button>
            <Badge className="bg-yellow-400 text-yellow-900 px-6 py-3 text-lg font-bold rounded-full animate-pulse">
              100% Free Forever
            </Badge>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white group hover:text-purple-300 transition-colors duration-300">
                DSA Tracker
              </h3>
            </div>
            <p className="text-xl text-gray-400 mb-8">Master algorithms, level up your skills, transform your career</p>
            <div className="flex justify-center space-x-8 mb-8">
              <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-purple-600/20 transition-all duration-300 text-lg px-6 py-3">
                About
              </Button>
              <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-purple-600/20 transition-all duration-300 text-lg px-6 py-3">
                Features
              </Button>
              <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-purple-600/20 transition-all duration-300 text-lg px-6 py-3">
                Contact
              </Button>
            </div>
            <div className="border-t border-gray-800 pt-8">
              <p className="text-gray-500">© 2024 DSA Tracker. Created with ❤️ by Anshul</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
