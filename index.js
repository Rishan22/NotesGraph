const fs = require('fs');
const path = require('path');
const { fetchRepoData } = require('./repoData');


const repoUrls = [
   "https://github.com/repo",
    // Add more repository URLs here
   
  ];
  
  async function processRepoUrls(urls) {
    for (const url of urls) {
      await generateRepoDirectory(url);
    }
  }

async function generateRepoDirectory(url) {
    const data = await fetchRepoData(url);
    if (!data) {
        console.log("Failed to fetch repository data.");
        return;
    }

    const repoName = data.repoData.name;
    const repoDir = path.join(__dirname, 'Repos', repoName);

    // Create the repository directory
    fs.mkdirSync(repoDir, { recursive: true });

    // Create the index.md file for the repository
    const indexContent = `# ${repoName}\n\n`;
    fs.writeFileSync(path.join(repoDir, `${repoName}.md`), indexContent);

    // Process headings and create subdirectories
    const headings = extractHeadings(data.readmeData);
    const headingIndexLines = [];

    for (const heading of headings) {
        const headingDir = path.join(repoDir, heading.replace(/[^a-zA-Z0-9]/g, '_'));
        fs.mkdirSync(headingDir, { recursive: true });

        const headingIndexPath = path.join(headingDir, `${heading.replace(/[^a-zA-Z0-9]/g, '_')}.md`);
        fs.writeFileSync(headingIndexPath, `# ${heading}\n\n`);

        headingIndexLines.push(`[[${heading.replace(/[^a-zA-Z0-9]/g, '_')}]]`);

        processLinesUnderHeading(data.readmeData, heading, headingDir);
    }

    // Append the heading index lines to the repository index file
    fs.appendFileSync(path.join(repoDir, `${repoName}.md`), headingIndexLines.join('\n'));

    console.log('Repository directory generated successfully.');
}

function extractHeadings(content) {
    const headingRegex = /^##\s(.*)/gm;
    const headings = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
        headings.push(match[1].trim());
    }

    return headings;
}

function processLinesUnderHeading(content, heading, directory) {
    const lines = content.split('\n');
    let currentHeading = null;
    let currentContent = '';

    lines.forEach(line => {
        const match = line.match(/^##\s(.*)/);
        if (match) {
            if (currentHeading && currentContent.trim() !== '') {
                writeContentToFile(currentContent, currentHeading, directory);
            }
            currentHeading = match[1].trim();
            currentContent = '';
        } else if (currentHeading === heading) {
            currentContent += `${line}\n`;
        }
    });

    if (currentHeading === heading && currentContent.trim() !== '') {
        writeContentToFile(currentContent, currentHeading, directory);
    }
}

function writeContentToFile(content, heading, directory) {
    const fileName = `${heading.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    const filePath = path.join(directory, fileName);
    const indexPath = path.join(directory, `${heading.replace(/[^a-zA-Z0-9]/g, '_')}.md`);

    const links = extractLinks(content);
    const indexContent = links.map(link => `[[${link.title.replace(/[^a-zA-Z0-9]/g, '_')}]]`).join('\n');

    fs.appendFileSync(indexPath, `\n${indexContent}`);

    links.forEach(link => {
        const linkFileName = `${link.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
        const linkFilePath = path.join(directory, linkFileName);
        fs.writeFileSync(linkFilePath, `# ${link.title}\n\n${link.url}\n`);
    });
}

function extractLinks(content) {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const links = [];
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
        links.push({
            title: match[1],
            url: match[2]
        });
    }

    return links;
}

processRepoUrls(repoUrls);
