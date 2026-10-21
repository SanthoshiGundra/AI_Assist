// src/server.js
import express from 'express';
import { WebSocketServer } from 'ws';
import path from 'path';

const app = express();
const PORT = 3000;

// Serve the UI files
app.use(express.static(path.join(process.cwd(), 'src', 'ui')));

export function startServer() {
    const server = app.listen(PORT, () => {
        console.log(`\n🌐 UI Server is running at http://localhost:${PORT}`);
    });

    // Start WebSocket for real-time chat and approvals
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws) => {
        console.log('Client connected to WebSocket.');
        
        // Welcome message
        ws.send(JSON.stringify({ 
            type: 'chat', 
            role: 'assistant', 
            content: 'Hello! I am your secure local assistant. My brain is not connected yet, but my UI is working!' 
        }));

        ws.on('message', (message) => {
            const data = JSON.parse(message);
            console.log('Received from UI:', data);
            
            // For now, we just echo back what you typed
            if (data.type === 'chat') {
                ws.send(JSON.stringify({
                    type: 'chat',
                    role: 'assistant',
                    content: `You said: "${data.content}". (AI Brain connection pending...)`
                }));
            }
        });
    });
}