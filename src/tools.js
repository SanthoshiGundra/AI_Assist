// src/tools.js
import os from 'os';
import fs from 'fs';
import { isPathAllowed, consumeApprovalToken } from './permissions.js';
import { logAction } from './logger.js';

export function getSystemInfo() {
    const info = {
        platform: os.platform(),
        architecture: os.arch(),
        cpuCores: os.cpus().length,
        freeMemoryGB: (os.freemem() / 1024 / 1024 / 1024).toFixed(2),
        totalMemoryGB: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2)
    };
    logAction('getSystemInfo', 'read_os_stats', 'SUCCESS');
    return info;
}

export function readSafeFile(filePath) {
    if (!isPathAllowed(filePath)) {
        return "ERROR: Access Denied by Permission Broker.";
    }

    try {
        const content = fs.readFileSync(filePath, 'utf8');
        logAction('readSafeFile', `read_${filePath}`, 'SUCCESS');
        return content;
    } catch (error) {
        logAction('readSafeFile', `read_${filePath}`, `ERROR: ${error.message}`);
        return `ERROR: Could not read file.`;
    }
}

// State-Changing Tool: Writing a file (Requires a valid Approval Token)
export function writeSafeFile(filePath, content, approvalToken) {
    if (!isPathAllowed(filePath)) {
        return "ERROR: Access Denied. Path outside allowed directory.";
    }

    // Verify token
    const verifiedAction = consumeApprovalToken(approvalToken);
    if (!verifiedAction) {
        return "ERROR: Unauthorized. Missing or invalid approval token.";
    }

    try {
        fs.writeFileSync(filePath, content, 'utf8');
        logAction('writeSafeFile', `wrote_to_${filePath}`, 'SUCCESS');
        return "SUCCESS: File written successfully.";
    } catch (error) {
        logAction('writeSafeFile', `wrote_to_${filePath}`, `ERROR: ${error.message}`);
        return `ERROR: Failed to write file.`;
    }
}