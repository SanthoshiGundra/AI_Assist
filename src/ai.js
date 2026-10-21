// src/ai.js
import ollama from 'ollama';

const SYSTEM_PROMPT = `You are a privacy-focused local assistant. 
You must operate strictly within user-granted path permissions. 
Never attempt to access or modify paths outside the explicitly allowed workspace.`;

export async function askLocalAI(userPrompt) {
  try {
    const response = await ollama.chat({
      model: 'llama3.2',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
    });

    return response.message.content;
  } catch (error) {
    console.error('[AI ERROR]', error.message);
    throw new Error('Failed to communicate with local AI model.');
  }
}