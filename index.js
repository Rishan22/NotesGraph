// index.js
const fs = require('fs');
const { fetchRepoData } = require('./repoData');

const repoUrl = ""



async function generateMarkdownFile(url) {
    const data = await fetchRepoData(url);
    if (!data) {
        console.log("Failed to fetch repository data.");
        return;
    }

    // Format the markdown content
    const markdownContent = `
# Repository Info

- **ID**: ${data.repoData.id}
- **Node ID**: ${data.repoData.node_id}
- **Name**: ${data.repoData.name}
- **Full Name**: ${data.repoData.full_name}
- **Author**: [${data.repoData.owner.login}](${data.repoData.owner.html_url})

## Readme Content

${data.readmeData}
`;

    // Write to a markdown file
    fs.writeFileSync('RepoInfo.md', markdownContent);
    console.log('Markdown file generated successfully.');
}

generateMarkdownFile(repoUrl);
