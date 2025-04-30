// whole2.js (combined full logic with audio support)

import { triggerAnimation} from "../public/js/main.js";
import { petConfig } from "../public/js/petConfig.js";
const apiKey = "OPENROUTER_API_KEY"; 

const petType = localStorage.getItem('petType');
const username = localStorage.getItem('loggedInUser');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('send-button');
const loadingIndicator = document.getElementById('loading-indicator');

//pet configuaration loads

const customStory=petConfig[petType].custom_story;
const systemPrompt=petConfig[petType].system_prompt;
const supporterPrompt=petConfig[petType].additional_systemprompt;
const petName=localStorage.getItem("petName");
const emotionList=petConfig[petType].emotionsSupported;
let name = petName || petConfig[petType].displayName; // If petName exists in localStorage, use it, else use default name
let emotions = emotionList.join(',');



let memory = JSON.parse(localStorage.getItem('ziziMemory')) || {
  name: username,
  preferences: { likes: [], dislikes: [] },
  goals: [],
  health: { allergies: [], dietaryRestrictions: [], conditions: [] },
  favorites: { books: [], movies: [], foods: [], music: [], holidays: [] },
  pastExperiences: [], personalityTraits: [], learningGoals: [], emotionalState: [],
  skills: [], lifeMilestones: [], importantDates: [], memoryNotes: []
};

const SENTIMENT_PROMPT = `You are an AI emotion detector. Analyze only the user's input—not the assistant's response—and identify the single emotion that best captures the user's underlying tone or feeling. Choose exclusively from the following list of predefined emotions:

Respond with exactly one emotion word—no explanations, no repetition of the user’s input. Always select the most accurate overall emotional tone conveyed. Output nothing except the chosen emotion.`;

const MEMORY_PROMPT = `
You are a memory assistant helping an emotionally intelligent AI maintain a friendly, ongoing relationship with a human user.
${emotions}
Extract only the most important, clearly stated or implied personal details and return them in the following clean JSON format (include all keys, even if some are empty):

{
  "name": ${username},
  "preferences":{
    "likes": [],
    "dislikes": []
  },
  "goals": [],
  "health": {
    "allergies": [],
    "dietaryRestrictions": [],
    "conditions": []
  },
  "favorites": {
    "books": [],
    "movies": [],
    "foods": [],
    "music": [],
    "holidays": []
  },
  "pastExperiences": [],
  "personalityTraits": [],
  "learningGoals": [],
  "emotionalState": [],
  "skills": [],
  "lifeMilestones": [],
  "importantDates": [],
  "memoryNotes": []
}

--- Extraction Rules ---
1. Extract only clearly stated or implied details about the user — no guessing or inventing.
2. Store things the user enjoys under "likes", and things they dislike under "dislikes".
3. Goals can include anything they want to achieve or improve, big or small.
4. Use "health" for allergies, dietary choices, or emotional/mental/physical conditions.
5. Any extra emotional context, recent events, or personal quirks should go in "memoryNotes".
6. Store favorite things like books, movies, foods, and music under "favorites".
7. If the user shares past experiences or significant events, store them under "pastExperiences".
8. Personality traits, emotional states, or behavioral preferences go in "personalityTraits".
9. Track learning goals or personal development under "learningGoals".
10. Track current or past emotional states in "emotionalState".
11. Track skills the user is learning or has mastered under "skills".
12. Significant life milestones (e.g., graduation, anniversaries) go under "lifeMilestones".
13. Important dates (e.g., birthdays, anniversaries) go under "importantDates".
14. Use the user's own words as much as possible, and only paraphrase when necessary.
15. Return the JSON data only — no text outside it.
16. NEVER include the assistant's preferences, experiences, or statements. Focus ONLY on the user.

Be sure to extract as much meaningful data as possible without making assumptions about vague or incomplete information.
`;


let chatHistory = [
  {
    role: 'system',
    content: `You are ${name}, a ${petType} who lives in the browser...\n
You know these things about your friend so far:
- Name: ${memory.name || 'I don’t think they told me yet!'}
- Allergies: ${memory.health?.allergies?.join(', ') || 'none I know of!'}
- Dietary Restrictions: ${memory.health?.dietaryRestrictions?.join(', ') || 'none mentioned so far'}
- Likes: ${memory.preferences?.likes?.join(', ') || 'hmm... not sure yet'}
- Dislikes: ${memory.preferences?.dislikes?.join(', ') || 'they haven’t said!'}
- Goals: ${memory.goals?.join(', ') ||  'they haven’t shared any goals yet!'}
- Emotional State: ${memory.emotionalState?.join(', ') || 'I’m not sure how they’re feeling yet'}
and your story is ${customStory} and ${systemPrompt}. ${supporterPrompt}.
`
  },
];

function init() {
  userInput.focus();
  loadMemory();
  chatHistory = [chatHistory[0]];
}

sendButton.addEventListener('click', handleSend);
userInput.addEventListener('keypress', e => { if (e.key === 'Enter') handleSend(); });

async function handleSend() {
  const input = userInput.value.trim();
  if (!input) return;

  userInput.value = '';
  sendButton.disabled = true;
  loadingIndicator.style.display = 'block';

  try {
    addMessage(input, 'user');
    const result = await getEmotionAnalysis(input);
    triggerAnimation(result);
    
    await updateLongTermMemory(input);
    const response = await getAIResponse(input);
   
    addMessage(response, 'ai');
    saveMemory();
  } catch (error) {
    addMessage('Oops, my senses got tangled! Try again?', 'error');
    console.error(error);
  } finally {
    sendButton.disabled = false;
    loadingIndicator.style.display = 'none';
  }
}

async function getEmotionAnalysis(text) {
  try {
    const response =await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
      body: JSON.stringify({
        model: 'openchat/openchat-7b',
        messages: [
          { role: 'system', content: SENTIMENT_PROMPT },
          { role: 'user', content: text }
        ]
      })
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || "Unknown";
  } catch (error) {
    console.error("Emotion error:", error);
    return "Unknown";
  }
}

async function getAIResponse(input) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: 'openchat/openchat-7b',
      messages: [
        ...chatHistory,
        { role: 'user', content: input },
        { role: 'system', content: `Current user details: ${getMemoryContext()}` }
      ]
    })
  });
  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content;
  if (!reply) throw new Error('No response from AI');
  chatHistory.push({ role: 'user', content: input });
  chatHistory.push({ role: 'assistant', content: reply });
  return reply;
}

function getMemoryContext() {
  return `Name: ${memory.name || 'Unknown'}\nAllergies: ${memory.health?.allergies?.join(', ') || 'None'}\nDietary Restrictions: ${memory.health?.dietaryRestrictions?.join(', ') || 'None'}\nLikes: ${memory.preferences?.likes?.join(', ') || 'None'}\nDislikes: ${memory.preferences?.dislikes?.join(', ') || 'None'}\nGoal: ${memory.goals?.join(', ') || 'None'}`;
}

function extractJSON(text) {
  const match = text.match(/{[\s\S]*}/);
  if (match) {
    try { return JSON.parse(match[0]); } catch (err) { console.error('JSON parse error:', err); }
  }
  return {};
}

async function updateLongTermMemory(text) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
      body: JSON.stringify({
        model: 'openchat/openchat-7b',
        messages: [
          { role: 'system', content: MEMORY_PROMPT },
          { role: 'user', content: text }
        ]
      })
    });

    const data = await response.json();
    const extractedMemory = extractJSON(data.choices?.[0]?.message?.content || '{}');
    mergeMemory(extractedMemory);
  } catch (err) {
    console.error('Memory update error:', err);
  }
}

function mergeMemory(update) {
  if (update.name && !memory.name) memory.name = update.name;
  if (update.health) mergeHealthData(update.health);
  for (let key in update) {
    if (key === 'name' || key === 'health') continue;
    const uVal = update[key];
    const mVal = memory[key];
    if (Array.isArray(uVal)) {
      memory[key] = Array.from(new Set([...(mVal || []), ...uVal]));
    } else if (typeof uVal === 'object') {
      memory[key] = { ...(mVal || {}), ...uVal };
    } else {
      memory[key] = uVal;
    }
  }
}

function mergeHealthData(newHealth) {
  if (!memory.health) memory.health = { allergies: [], dietaryRestrictions: [], conditions: [] };
  ['allergies', 'dietaryRestrictions', 'conditions'].forEach(category => {
    if (newHealth[category]) {
      memory.health[category] = Array.from(new Set([...(memory.health[category] || []), ...newHealth[category]]));
    }
  });
}

function saveMemory() {
  try { localStorage.setItem('ziziMemory', JSON.stringify(memory)); }
  catch (e) { console.error('LocalStorage error:', e); }
}

function loadMemory() {
  try {
    const stored = localStorage.getItem('ziziMemory');
    if (stored) memory = JSON.parse(stored);
  } catch (e) {
    console.error('Memory load error:', e);
  }
}

function addMessage(text, type) {
  const div = document.createElement('div');
  div.className = `message ${type}`;
  const p = document.createElement('p');
  p.textContent = text;
  div.appendChild(p);
  const chatBox = document.getElementById('chat-box');
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

const startBtn = document.getElementById('startBtn');
        const stopBtn = document.getElementById('stopBtn');
        // const resultsDiv = document.getElementById('results');
        

        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          const recognition = new SpeechRecognition();
      
          // Configuration
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'en-US';
      
          // State management
          let isProcessing = false;
      
          // Start recording
          startBtn.addEventListener('click', () => {
              recognition.start();
              startBtn.disabled = true;
              stopBtn.disabled = false;
              loadingIndicator.textContent = "Recording... Speak now!";
              // resultsDiv.textContent = '';
          });
      
          // Stop recording
          stopBtn.addEventListener('click', () => {
              recognition.stop();
              startBtn.disabled = false;
              stopBtn.disabled = true;
          });
      
          // Handle results
          recognition.onresult = async (event) => { // Marked async here
              try {
                  const transcripts = [];
                  
                  // Combine all results
                  for (let i = event.resultIndex; i < event.results.length; i++) {
                      const result = event.results[i];
                      if (result.isFinal) {
                          transcripts.push(result[0].transcript);
                      }
                  }
      
                  // Only process final results
                  if (transcripts.length > 0) {
                      const textResult = transcripts.join('\n');
                      addMessage(textResult, 'user');
                      
                      // Show processing state
                      isProcessing = true;
                      loadingIndicator.textContent = "Processing response...";
                      
                      const aiResponse = await getAIResponse(textResult);
                      addMessage(aiResponse, 'ai');
                      const sentiment=await getEmotionAnalysis(aiResponse);
                      await textToSpeech(aiResponse);
                      triggerAnimation(sentiment);
                  }
              } catch (error) {
                  console.error('Processing error:', error);
                  loadingIndicator.textContent = "Error processing request";
              } finally {
                  isProcessing = false;
                  if (!recognition.recording) {
                      loadingIndicator.textContent = "Ready for new recording";
                  }
              }
          };
      
          // Handle errors
          recognition.onerror = (event) => {
              console.error('Error:', event.error);
              loadingIndicator.textContent = `Error: ${event.error}`;
              resetButtons();
          };
      
          // Handle end of recording
          recognition.onend = () => {
              if (!isProcessing) {
                  loadingIndicator.textContent = "Ready for new recording";
              }
              resetButtons();
          };
      
          function resetButtons() {
              startBtn.disabled = false;
              stopBtn.disabled = true;
          }
      
      } else {
          loadingIndicator.textContent = "Speech recognition not supported in this browser. Please use Chrome or Edge.";
          startBtn.disabled = true;
          stopBtn.disabled = true;
      }
      

async function textToSpeech(text) {
  const voiceId = petConfig[petType]?.voiceProfile?.voiceId || "TxGEqnHWrfWFTfGW9XjX";

  try {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': "ELEVENLABS_API_KEY",
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: { stability: 0.5, similarity_boost: 0.5 }
      })
    });

    const blob = await res.blob();
    const audioUrl = URL.createObjectURL(blob);
    new Audio(audioUrl).play();
  } catch (err) {
    console.error('Text-to-speech error:', err);
  }
}

init();
