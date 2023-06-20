const express = require('express');
const cors = require('cors');
const open = require('open');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Define the emoji representations
const numberEmojis = ['||:zero:||', '||:one:||', '||:two:||', '||:three:||', '||:four:||', '||:five:||', '||:six:||', '||:seven:||', '||:eight:||'];
const mine = '||:boom:||';

// Offsets to find surrounding cells
let offsets = [];
for(let i=-1; i<=1; i++) {
  for(let j=-1; j<=1; j++) {
    if(i !== 0 || j !== 0) offsets.push([i, j]);
  }
}

function createField(width, height, mines) {
  // Create an empty field
  let field = Array(height).fill().map(() => Array(width).fill(0));

  // Place mines
  for(let i = 0; i < mines; i++) {
    while(true) {
      let x = Math.floor(Math.random() * width);
      let y = Math.floor(Math.random() * height);
      if(field[y][x] === 0) {
        field[y][x] = mine;
        break;
      }
    }
  }

  // Calculate numbers
  for(let y = 0; y < height; y++) {
    for(let x = 0; x < width; x++) {
      if(field[y][x] !== mine) {
        let count = offsets.reduce((acc, [dx, dy]) => {
          let nx = x + dx, ny = y + dy;
          if(nx >= 0 && nx < width && ny >= 0 && ny < height && field[ny][nx] === mine) {
            return acc + 1;
          }
          return acc;
        }, 0);
        field[y][x] = numberEmojis[count];
      }
    }
  }

  return field;
}

function printField(field) {
  return field.map(row => row.join('')).join('\n');
}

function splitField(field, maxWidth=9, maxHeight=9) {
  let sections = [];
  let width = field[0].length, height = field.length;
  for(let y = 0; y < height; y += maxHeight) {
    for(let x = 0; x < width; x += maxWidth) {
      let section = field.slice(y, y + maxHeight).map(row => row.slice(x, x + maxWidth));
      sections.push(section);
    }
  }
  return sections;
}

app.post('/generate', (req, res) => {
  let size = req.body.size;
  let difficulty = req.body.difficulty;
  let sizeMap = {
    'Small': [5, 5],
    'Medium': [8, 8],
    'Large': [9, 9],
  };
  let difficultyMap = {
    'Easy': 5,
    'Medium': 14,
    'Hard': 20,
  };
  let [width
  let height] = sizeMap[size];
  let mines = difficultyMap[difficulty];
  let field = createField(width, height, mines);
  let sections = splitField(field);
  let sectionsStr = sections.map(printField);
  res.json({fields: sectionsStr});
});

app.get('/', (req, res) => {
  // Assuming you have a file `index.html` in a directory named `public`
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  open(`http://localhost:${port}`);
});