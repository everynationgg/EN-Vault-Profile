const fs = require('fs');
const path = require('path');
const readline = require('readline');

const logPath = 'C:/Users/yoggn/.gemini/antigravity-ide/brain/b2d9112c-40a9-4e4c-bd16-af1ba08a3670/.system_generated/logs/transcript_full.jsonl';

const rl = readline.createInterface({
  input: fs.createReadStream(logPath)
});

rl.on('line', (line) => {
  if (line.includes('"step_index":356')) {
    try {
      const obj = JSON.parse(line);
      console.log('FULL CONTENT:', obj.content);
    } catch (e) {
      console.error(e);
    }
  }
});
