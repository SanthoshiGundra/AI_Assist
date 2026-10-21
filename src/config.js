// src/config.js
import path from 'path';

// We get your home directory dynamically (e.g., C:\Users\username)
const homeDir = process.env.USERPROFILE || '';

export const securityConfig = {
    // Only allow the AI to read files in these specific folders
    allowedDirectories: [
        path.join(homeDir, 'ai assist', 'safe_workspace') // A sandbox folder we will create later
    ],
    
    // NEVER allow the AI near these folders or files
    deniedPaths: [
        path.join(homeDir, '.ssh'),         // SSH Keys
        path.join(homeDir, 'AppData'),      // Browser profiles, cookies, tokens
        'C:\\Windows',                      // System files
        '.env'                              // Our own secret keys
    ]
};

console.log("Security Config: LOADED");