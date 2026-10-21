// src/index.js
import express from 'express';
import { askLocalAI } from './ai.js';

const app = express();
app.use(express.json());
app.use(express.static('public')); // Serves files from public folder

app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    const aiResponse = await askLocalAI(prompt);
    res.json({ response: aiResponse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`UI running at http://localhost:3000`);
});