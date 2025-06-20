
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: string) => void;
  sessionTime: number;
}

const SessionModal: React.FC<SessionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  sessionTime
}) => {
  const [note, setNote] = useState('');

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const handleSave = () => {
    onSave(note);
    setNote('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>End Study Session</DialogTitle>
          <DialogDescription>
            You studied for {formatTime(sessionTime)}. Add a reflection or note about your session.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="session-note">Session Reflection</Label>
            <Textarea
              id="session-note"
              placeholder="What did you learn? What challenges did you face? Any insights?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionModal;
