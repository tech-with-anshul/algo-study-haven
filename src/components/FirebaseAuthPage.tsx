
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Mail, Lock, Github, Chrome, Twitter, Sparkles, Brain, Rocket } from 'lucide-react';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';

const FirebaseAuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { 
    signInWithEmail, 
    signUpWithEmail, 
    signInWithGoogle, 
    signInWithTwitter, 
    signInWithGithub 
  } = useFirebaseAuth();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      // Navigation will be handled by the auth state change in useFirebaseAuth
    } catch (error) {
      console.error('Auth error:', error);
      // Error handling is done in the auth hook
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'github' | 'twitter') => {
    try {
      switch (provider) {
        case 'google':
          await signInWithGoogle();
          break;
        case 'github':
          await signInWithGithub();
          break;
        case 'twitter':
          await signInWithTwitter();
          break;
      }
      // Navigation will be handled by the auth state change
    } catch (error) {
      console.error('Social auth error:', error);
      // Error handling is done in the auth hook
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <Card className="w-full max-w-md relative z-10 shadow-2xl border-2 border-primary/20 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center mb-4">
            <Brain className="h-10 w-10 text-white" />
          </div>
          
          <div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              🗡️ DSA Adventure
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              {isSignUp ? 'Begin your coding quest!' : 'Welcome back, brave coder!'}
            </p>
          </div>
          
          <div className="flex justify-center space-x-2">
            <Badge variant="secondary" className="bg-gradient-to-r from-green-100 to-emerald-100 border-green-300">
              <Sparkles className="h-3 w-3 mr-1" />
              Epic Learning
            </Badge>
            <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-300">
              <Rocket className="h-3 w-3 mr-1" />
              Level Up
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Social Auth Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => handleSocialAuth('google')}
              variant="outline"
              className="w-full flex items-center justify-center space-x-2 hover:bg-red-50 hover:border-red-200 transition-colors"
            >
              <Chrome className="h-5 w-5 text-red-500" />
              <span>Continue with Google</span>
            </Button>
            
            <Button
              onClick={() => handleSocialAuth('github')}
              variant="outline"
              className="w-full flex items-center justify-center space-x-2 hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              <Github className="h-5 w-5" />
              <span>Continue with GitHub</span>
            </Button>
            
            <Button
              onClick={() => handleSocialAuth('twitter')}
              variant="outline"
              className="w-full flex items-center justify-center space-x-2 hover:bg-blue-50 hover:border-blue-200 transition-colors"
            >
              <Twitter className="h-5 w-5 text-blue-500" />
              <span>Continue with Twitter</span>
            </Button>
          </div>

          <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-card px-3 text-muted-foreground text-sm">or</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                </div>
              ) : (
                <span>{isSignUp ? '🚀 Start Adventure' : '⚔️ Continue Quest'}</span>
              )}
            </Button>
          </form>

          <div className="text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FirebaseAuthPage;
