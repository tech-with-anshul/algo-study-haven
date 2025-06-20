// Google Apps Script Code for DSA Progress Tracker
// Deploy this as a Web App with execute permissions set to "Anyone"

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    const payload = data.data;
    
    console.log('Received action:', action);
    console.log('Payload:', JSON.stringify(payload));
    
    if (action === 'updateProgress') {
      return updateProgressSheet(payload);
    } else if (action === 'updateSessions') {
      return updateSessionsSheet(payload);
    } else if (action === 'getProgress') {
      return getProgressData();
    } else if (action === 'getSessions') {
      return getSessionsData();
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: 'Invalid action'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('DSA Progress Tracker API is running')
    .setMimeType(ContentService.MimeType.TEXT);
}

function updateProgressSheet(progressData) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('DSA_Progress');
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet('DSA_Progress');
      // Add headers with formatting
      const headers = ['Topic ID', 'Topic Name', 'Subtopic ID', 'Subtopic Name', 'Completed', 'Last Updated', 'Progress %'];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#4285f4').setFontColor('white');
      sheet.setFrozenRows(1);
    }
    
    // Clear existing data (keep headers)
    if (sheet.getLastRow() > 1) {
      sheet.getRange(2, 1, sheet.getLastRow() - 1, 7).clear();
    }
    
    // Add new data
    const values = progressData.map(item => [
      item.topicId,
      item.topicName,
      item.subtopicId,
      item.subtopicName,
      item.completed ? 'Yes' : 'No',
      new Date(item.timestamp),
      item.completed ? '100%' : '0%'
    ]);
    
    if (values.length > 0) {
      const dataRange = sheet.getRange(2, 1, values.length, 7);
      dataRange.setValues(values);
      
      // Format completed column
      const completedRange = sheet.getRange(2, 5, values.length, 1);
      completedRange.createTextFinder('Yes').replaceAllWith('✅ Yes');
      completedRange.createTextFinder('No').replaceAllWith('❌ No');
    }
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, 7);
    
    console.log('Progress sheet updated successfully');
    return ContentService
      .createTextOutput(JSON.stringify({success: true, message: 'Progress updated successfully', rowsUpdated: values.length}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error updating progress sheet:', error);
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function updateSessionsSheet(sessionData) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Study_Sessions');
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet('Study_Sessions');
      // Add headers with formatting
      const headers = ['Session ID', 'Date', 'Duration (seconds)', 'Formatted Duration', 'Topic', 'Notes', 'Productivity Score'];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#34a853').setFontColor('white');
      sheet.setFrozenRows(1);
    }
    
    // Clear existing data (keep headers)
    if (sheet.getLastRow() > 1) {
      sheet.getRange(2, 1, sheet.getLastRow() - 1, 7).clear();
    }
    
    // Add new data
    const values = sessionData.map(session => [
      session.id,
      new Date(session.date),
      session.duration,
      session.formattedDuration || formatDuration(session.duration),
      session.topic || 'General Study',
      session.note || 'No notes provided',
      calculateProductivityScore(session.duration)
    ]);
    
    if (values.length > 0) {
      const dataRange = sheet.getRange(2, 1, values.length, 7);
      dataRange.setValues(values);
      
      // Format duration column
      const durationRange = sheet.getRange(2, 4, values.length, 1);
      durationRange.setNumberFormat('[h]:mm:ss');
    }
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, 7);
    
    // Add summary row
    addSessionSummary(sheet, sessionData);
    
    console.log('Sessions sheet updated successfully');
    return ContentService
      .createTextOutput(JSON.stringify({success: true, message: 'Sessions updated successfully', rowsUpdated: values.length}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error updating sessions sheet:', error);
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function addSessionSummary(sheet, sessionData) {
  const totalSessions = sessionData.length;
  const totalTime = sessionData.reduce((acc, session) => acc + session.duration, 0);
  const avgSessionTime = totalSessions > 0 ? totalTime / totalSessions : 0;
  
  const summaryRow = sheet.getLastRow() + 2;
  sheet.getRange(summaryRow, 1, 1, 7).setValues([
    ['SUMMARY', '', totalTime, formatDuration(totalTime), `${totalSessions} sessions`, `Avg: ${formatDuration(avgSessionTime)}`, '']
  ]);
  sheet.getRange(summaryRow, 1, 1, 7).setFontWeight('bold').setBackground('#fff2cc');
}

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours}h ${minutes}m ${secs}s`;
}

function calculateProductivityScore(duration) {
  if (duration < 900) return 'Low'; // Less than 15 minutes
  if (duration < 3600) return 'Medium'; // Less than 1 hour
  return 'High'; // 1 hour or more
}

function getProgressData() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('DSA_Progress');
    
    if (!sheet || sheet.getLastRow() <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify({success: true, data: []}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 6).getValues();
    const progressData = data.map(row => ({
      topicId: row[0],
      topicName: row[1],
      subtopicId: row[2],
      subtopicName: row[3],
      completed: row[4] === 'Yes',
      timestamp: row[5]
    }));
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true, data: progressData}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getSessionsData() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Study_Sessions');
    
    if (!sheet || sheet.getLastRow() <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify({success: true, data: []}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 6).getValues();
    const sessionData = data.map(row => ({
      id: row[0],
      date: row[1],
      duration: row[2],
      formattedDuration: row[3],
      topic: row[4],
      note: row[5]
    }));
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true, data: sessionData}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
