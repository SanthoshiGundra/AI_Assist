// src/logger.js
import fs from 'fs';
import path from 'path';

// Save the log file in the main folder
const logFilePath = path.join(process.cwd(), 'audit.log');

export function logAction(toolName, action, result) {
    const timestamp = new Date().toISOString();
    // Format the log entry
    const logEntry = `[${timestamp}] TOOL: ${toolName} | ACTION: ${action} | RESULT: ${result}\n`;
    
    // Append to the file (creates it if it doesn't exist)
    fs.appendFileSync(logFilePath, logEntry, 'utf8');
    
    console.log(`[AUDIT] Logged: ${toolName} -> ${result}`);
}