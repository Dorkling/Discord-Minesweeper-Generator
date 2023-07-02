// Define the emoji representations for the Minesweeper game
let numberEmojis = [
  ':o:', 
  '||:one:||', 
  '||:two:||', 
  '||:three:||', 
  '||:four:||', 
  '||:five:||', 
  '||:six:||', 
  '||:seven:||', 
  '||:eight:||'
];
let mine = '||:x:||';

// Define the offsets to find surrounding cells in the game grid
let offsets = [];
for(let i = -1; i < 2; i++) {
    for(let j = -1; j < 2; j++) {
        if(i != 0 || j != 0) {
            offsets.push([i, j]);
        }
    }
}

// Function to create the Minesweeper field
function createField(width, height, mines) {
    // Initialize an empty field
    let field = Array(height).fill().map(() => Array(width).fill(0));

    // Randomly place mines in the field
    for(let i = 0; i < mines; i++) {
        while(true) {
            let x = Math.floor(Math.random() * width);
            let y = Math.floor(Math.random() * height);
            if(field[y][x] == 0) {
                field[y][x] = mine;
                break;
            }
        }
    }

    // Calculate the numbers for each cell in the field
    for(let y = 0; y < height; y++) {
        for(let x = 0; x < width; x++) {
            if(field[y][x] != mine) {
                let count = 0;
                for(let offset of offsets) {
                    let dx = offset[0], dy = offset[1];
                    if(0 <= x + dx && x + dx < width && 0 <= y + dy && y + dy < height && field[y + dy][x + dx] == mine) {
                        count++;
                    }
                }
                field[y][x] = numberEmojis[count];
            }
        }
    }

    return field;
}

// Function to convert the Minesweeper field into a string representation
function printField(field) {
    return field.map(row => row.join('')).join('\n');
}

// Function to split the Minesweeper field into sections
function splitField(field, maxWidth = 9, maxHeight = 9) {
    let sections = [];
    let width = field[0].length;
    let height = field.length;
    for(let y = 0; y < height; y += maxHeight) {
        for(let x = 0; x < width; x += maxWidth) {
            let section = field.slice(y, y + maxHeight).map(row => row.slice(x, x + maxWidth));
            sections.push(section);
        }
    }
    return sections;
}

// Event listener for the 'Generate' button
document.getElementById('generate').addEventListener('click', () => {
    let difficulty = document.getElementById('difficulty').value;
    let size = document.getElementById('size').value;
    
    let width, height, mines;
    if(size === 'small') {
        width = 6 
        height = 5;
    } else if(size === 'medium') {
        width = height = 7;
    } else {
        width = height = 9;
    }
    
    if(difficulty === 'easy') {
        mines = Math.floor(0.1 * width * height);
    } else if(difficulty === 'medium') {
        mines = Math.floor(0.15 * width * height);
    } else {
        mines = Math.floor(0.2 * width * height);
    }
    
    let field = createField(width, height, mines);
    let code = printField(field);
    
    // Display the generated code in the output area
    document.getElementById('code').textContent = code;
});

// Event listener for the 'Copy to Clipboard' button
document.getElementById('copy').addEventListener('click', () => {
    let code = document.getElementById('code').textContent;
    navigator.clipboard.writeText(code);
});


