const fs = require('fs');
const path = require('path');


const inputFilePath = 'RepoInfo.md'; // Adjust to the correct path of your RepoInfo.md
const outputBasePath = path.join(__dirname, 'NotesV4'); // Change 'ObsidianNotes' to your desired output directory name

// Function to ensure a directory exists
function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

// Function to sanitize names for file and directory creation
function sanitizeName(name) {
    return name.replace(/[<>:"\/\\|?*\x00-\x1F]/g, '').replace(/\s+/g, '-');
}

// Track created files for each directory
let directoryFiles = {};

const readmeContent = fs.readFileSync(inputFilePath, 'utf8');
const lines = readmeContent.split('\n');

let currentPath = outputBasePath;
ensureDirectoryExists(currentPath);
directoryFiles[currentPath] = [];

lines.forEach(line => {
    if (line.startsWith('#')) {
        const level = line.match(/^#+/)[0].length - 1;
        const title = line.substring(level + 1).trim();
        const sanitizedTitle = sanitizeName(title);
        currentPath = path.join(outputBasePath, ...(new Array(level).fill('')), sanitizedTitle);
        ensureDirectoryExists(currentPath);
        directoryFiles[currentPath] = [];
    } else if (line.match(/\[.*?\]\(.*?\)/)) {
        const match = line.match(/\[(.*?)\]\((.*?)\)/);
        if (match) {
            const [_, linkText, linkUrl] = match;
            const filename = sanitizeName(linkText) + '.md';
            const filePath = path.join(currentPath, filename);
            const content = `# ${linkText}\n\n${linkUrl}\n`;
            fs.writeFileSync(filePath, content);
            directoryFiles[currentPath].push(filename);
        }
    }
});

// Create index.md files
Object.keys(directoryFiles).forEach(dirPath => {
    const files = directoryFiles[dirPath];
    const dirName = path.basename(dirPath);
    const indexPath = path.join(dirPath, `${dirName}.md`);
    const indexContent = files.map(file => `[[${file.replace('.md', '')}]]`).join('\n');
    fs.writeFileSync(indexPath, `# ${dirName}\n\n${indexContent}`);
});

console.log('Structure generated successfully with index files.');
