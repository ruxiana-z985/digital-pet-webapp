const fs = require('fs');
const path = require('path');

// Read your JS file
const filePath = path.join(__dirname, 'src', 'w.js');
let content = fs.readFileSync(filePath, 'utf8');

// Replace placeholders with Netlify environment variables
content = content.replace(/'OPENROUTER_API_KEY'/, `'${process.env.OPENROUTER_API_KEY}'`);
content = content.replace(/'ELEVENLABS_API_KEY'/, `'${process.env.ELEVENLABS_API_KEY}'`);

// Save the modified file
fs.writeFileSync(filePath, content, 'utf8');