
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const UserProfile = () => {
  const { user, signOut } = useAuth();

  if (!user) return null;

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const getDisplayName = () => {
    if (user.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user.user_metadata?.name) return user.user_metadata.name;
    return user.email?.split('@')[0] || 'User';
  };

  return (
    <div className="flex items-center space-x-4 bg-card/50 backdrop-blur-sm rounded-lg p-3 border border-border/50">
      <Avatar className="h-10 w-10 border-2 border-primary/20">
        <AvatarImage 
          src={user.user_metadata?.avatar_url} 
          alt={getDisplayName()} 
        />
        <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white font-bold">
          {getInitials(user.email || '')}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium text-foreground truncate">
            {getDisplayName()}
          </p>
          <Badge variant="secondary" className="text-xs">
            Hero
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {user.email}
        </p>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={signOut}
        className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
        title="Sign Out"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default UserProfile;
