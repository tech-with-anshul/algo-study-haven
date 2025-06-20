// Google Apps Script Code for DSA Progress Tracker
// Deploy this as a Web App with execute permissions set to "Anyone"

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    const payload = data.data;
    
    if (action === 'updateProgress') {
      return updateProgressSheet(payload);
    } else if (action === 'updateSessions') {
      return updateSessionsSheet(payload);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: 'Invalid action'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function updateProgressSheet(progressData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('DSA_Progress');
  
  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet('DSA_Progress');
    // Add headers
    sheet.getRange(1, 1, 1, 6).setValues([
      ['Topic ID', 'Topic Name', 'Subtopic ID', 'Subtopic Name', 'Completed', 'Last Updated']
    ]);
  }
  
  // Clear existing data (keep headers)
  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, 6).clear();
  }
  
  // Add new data
  const values = progressData.map(item => [
    item.topicId,
    item.topicName,
    item.subtopicId,
    item.subtopicName,
    item.completed ? 'Yes' : 'No',
    new Date(item.timestamp)
  ]);
  
  if (values.length > 0) {
    sheet.getRange(2, 1, values.length, 6).setValues(values);
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({success: true, message: 'Progress updated'}))
    .setMimeType(ContentService.MimeType.JSON);
}

function updateSessionsSheet(sessionData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Study_Sessions');
  
  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet('Study_Sessions');
    // Add headers
    sheet.getRange(1, 1, 1, 6).setValues([
      ['Session ID', 'Date', 'Duration (seconds)', 'Formatted Duration', 'Topic', 'Notes']
    ]);
  }
  
  // Clear existing data (keep headers)
  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, 6).clear();
  }
  
  // Add new data
  const values = sessionData.map(session => [
    session.id,
    session.date,
    session.duration,
    session.formattedDuration,
    session.topic || 'General',
    session.note
  ]);
  
  if (values.length > 0) {
    sheet.getRange(2, 1, values.length, 6).setValues(values);
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({success: true, message: 'Sessions updated'}))
    .setMimeType(ContentService.MimeType.JSON);
}
