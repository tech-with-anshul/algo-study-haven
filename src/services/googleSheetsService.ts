
// Google Sheets Integration Service
// You'll need to set up Google Apps Script and get your Web App URL

interface ProgressData {
  topicId: string;
  topicName: string;
  subtopicId: string;
  subtopicName: string;
  completed: boolean;
  timestamp: string;
}

interface SessionData {
  id: number;
  date: string;
  duration: number;
  note: string;
  topic: string | null;
  formattedDuration: string;
}

class GoogleSheetsService {
  private webAppUrl: string;

  constructor(webAppUrl: string) {
    this.webAppUrl = webAppUrl;
  }

  async syncProgress(progress: Record<string, Record<string, boolean>>, dsaTopics: any[]) {
    const progressData: ProgressData[] = [];
    
    dsaTopics.forEach(topic => {
      topic.subtopics.forEach((subtopic: any) => {
        progressData.push({
          topicId: topic.id,
          topicName: topic.name,
          subtopicId: subtopic.id,
          subtopicName: subtopic.name,
          completed: progress[topic.id]?.[subtopic.id] || false,
          timestamp: new Date().toISOString()
        });
      });
    });

    try {
      const response = await fetch(this.webAppUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateProgress',
          data: progressData
        })
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error syncing progress to Google Sheets:', error);
      throw error;
    }
  }

  async syncSessionNotes(sessionNotes: SessionData[]) {
    const formattedSessions = sessionNotes.map(session => ({
      ...session,
      formattedDuration: this.formatDuration(session.duration),
      date: new Date(session.date).toLocaleDateString()
    }));

    try {
      const response = await fetch(this.webAppUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateSessions',
          data: formattedSessions
        })
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error syncing sessions to Google Sheets:', error);
      throw error;
    }
  }

  private formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
}

export default GoogleSheetsService;
