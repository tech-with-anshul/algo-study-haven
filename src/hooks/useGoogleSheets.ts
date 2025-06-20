
import { useState } from 'react';
import GoogleSheetsService from '../services/googleSheetsService';

export function useGoogleSheets() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // You'll need to replace this with your actual Google Apps Script Web App URL
  const WEB_APP_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
  
  const sheetsService = new GoogleSheetsService(WEB_APP_URL);

  const syncToSheets = async (progress: any, sessionNotes: any, dsaTopics: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        sheetsService.syncProgress(progress, dsaTopics),
        sheetsService.syncSessionNotes(sessionNotes)
      ]);
      console.log('Successfully synced to Google Sheets');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sync to Google Sheets';
      setError(errorMessage);
      console.error('Sync error:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    syncToSheets,
    isLoading,
    error
  };
}
