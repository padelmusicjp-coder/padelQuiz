const fs = require('fs'); const data = JSON.parse(fs.readFileSync('./src/data/questions.json', 'utf8')); console.log([...new Set(data.map(q = 
