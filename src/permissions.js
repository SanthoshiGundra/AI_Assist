// src/permissions.js
import path from 'path';
import crypto from 'crypto';
import { securityConfig } from './config.js';
import { logAction } from './logger.js';

// Store for pending actions requiring human approval
const pendingActions = new Map();

export function isPathAllowed(requestedPath) {
    const absolutePath = path.resolve(requestedPath);
    
    // Check DENY list
    for (const denied of securityConfig.deniedPaths) {
        if (absolutePath.toLowerCase().startsWith(denied.toLowerCase())) {
            logAction('permission_broker', `BLOCKED access to denied path: ${absolutePath}`, 'DENIED');
            return false;
        }
    }

    // Check ALLOW list
    for (const allowed of securityConfig.allowedDirectories) {
        if (absolutePath.toLowerCase().startsWith(allowed.toLowerCase())) {
            return true;
        }
    }

    logAction('permission_broker', `BLOCKED access to unlisted path: ${absolutePath}`, 'DENIED');
    return false;
}

// Request approval for a state-changing action
export function requestApproval(toolName, target, details) {
    const tokenId = crypto.randomBytes(8).toString('hex');
    const pendingAction = {
        tokenId,
        toolName,
        target,
        details,
        createdAt: Date.now()
    };
    
    pendingActions.set(tokenId, pendingAction);
    logAction('permission_broker', `APPROVAL_REQUESTED for ${toolName} on ${target} (Token: ${tokenId})`, 'PENDING');
    
    return pendingAction;
}

// Validate and consume an approval token
export function consumeApprovalToken(tokenId) {
    if (!pendingActions.has(tokenId)) {
        logAction('permission_broker', `INVALID or EXPIRED token used: ${tokenId}`, 'DENIED');
        return false;
    }

    const action = pendingActions.get(tokenId);
    
    // Expire token immediately after check (one-time use)
    pendingActions.delete(tokenId);
    
    logAction('permission_broker', `APPROVED and CONSUMED token: ${tokenId} for ${action.toolName}`, 'ALLOWED');
    return action;
}