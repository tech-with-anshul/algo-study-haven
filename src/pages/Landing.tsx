
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Brain, Trophy, Target, Github, Linkedin, Mail, Phone, Globe, Sparkles, Code, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "Interactive Learning",
      description: "Master DSA concepts through gamified challenges and real-world problem solving"
    },
    {
      icon: Trophy,
      title: "Achievement System",
      description: "Earn XP, unlock achievements, and track your coding journey progress"
    },
    {
      icon: Target,
      title: "Quest-Based Learning",
      description: "Complete daily quests and structured learning paths to stay motivated"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            {/* Main Title */}
            <div className="space-y-4">
              <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300 text-purple-700 px-4 py-2 text-sm font-medium">
                <Sparkles className="h-4 w-4 mr-2" />
                Master Data Structures & Algorithms
              </Badge>
              
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight">
                🗡️ DSA Adventure Quest
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Transform your coding journey into an epic adventure. Learn, practice, and master Data Structures & Algorithms through gamified challenges and interactive quests.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => navigate('/tracker')}
                size="lg"
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white font-semibold px-8 py-4 text-lg group"
              >
                <Zap className="mr-2 h-5 w-5" />
                Start Your Adventure
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-primary/20 hover:border-primary/40 px-8 py-4 text-lg"
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Code className="mr-2 h-5 w-5" />
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-foreground">
              Why Choose DSA Adventure Quest?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience a revolutionary approach to learning programming concepts through interactive gameplay and structured challenges.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-2 border-primary/10 hover:border-primary/20 transition-all duration-300 hover:shadow-xl group">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Creator Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <Badge className="bg-gradient-to-r from-emerald-100 to-teal-100 border-emerald-300 text-emerald-700 px-4 py-2">
                <Code className="h-4 w-4 mr-2" />
                Meet The Creator
              </Badge>
              <h2 className="text-4xl font-bold text-foreground">
                Crafted with Passion by Anshul
              </h2>
            </div>

            <Card className="bg-card/50 backdrop-blur-sm border-2 border-primary/10 overflow-hidden">
              <CardContent className="p-0">
                <div className="md:flex items-center">
                  {/* Creator Image */}
                  <div className="md:w-1/3 p-8 flex justify-center">
                    <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-primary/20 shadow-xl">
                      <img
                        src="https://res.cloudinary.com/djrttnwvt/image/upload/v1750468177/DAY_1_ppbvml.jpg"
                        alt="Anshul - The Creator"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Creator Info */}
                  <div className="md:w-2/3 p-8 space-y-6">
                    <div className="space-y-3">
                      <h3 className="text-3xl font-bold text-foreground">Anshul</h3>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        A passionate full-stack developer and DSA enthusiast who believes in making complex programming concepts accessible and engaging. With years of experience in software development and a deep understanding of data structures and algorithms, Anshul created this platform to help fellow developers master these essential skills through an interactive and gamified approach.
                      </p>
                    </div>

                    {/* Contact Information */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <a
                        href="https://www.dev-anshul.tech/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 transition-all duration-200 group"
                      >
                        <Globe className="h-5 w-5 text-blue-600" />
                        <span className="text-blue-700 font-medium group-hover:text-blue-800">Portfolio</span>
                      </a>

                      <a
                        href="mailto:kanshulmussoorie@gmail.com"
                        className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 border border-red-200 transition-all duration-200 group"
                      >
                        <Mail className="h-5 w-5 text-red-600" />
                        <span className="text-red-700 font-medium group-hover:text-red-800">Email</span>
                      </a>

                      <a
                        href="https://www.linkedin.com/in/anshultech1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border border-blue-200 transition-all duration-200 group"
                      >
                        <Linkedin className="h-5 w-5 text-blue-600" />
                        <span className="text-blue-700 font-medium group-hover:text-blue-800">LinkedIn</span>
                      </a>

                      <a
                        href="https://github.com/tech-with-anshul"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100 border border-gray-200 transition-all duration-200 group"
                      >
                        <Github className="h-5 w-5 text-gray-600" />
                        <span className="text-gray-700 font-medium group-hover:text-gray-800">GitHub</span>
                      </a>
                    </div>

                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                      <Phone className="h-5 w-5 text-green-600" />
                      <span className="text-green-700 font-medium">+91 9410147660</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold text-foreground">
              Ready to Begin Your Coding Adventure?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of developers who are mastering DSA through our gamified learning platform. Your epic coding journey starts here!
            </p>
            <Button
              onClick={() => navigate('/tracker')}
              size="lg"
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white font-semibold px-12 py-6 text-xl group"
            >
              <Trophy className="mr-3 h-6 w-6" />
              Start Your Quest Now
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
