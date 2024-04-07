const axios = require('axios');
require('dotenv').config();

const githubToken = process.env.GITHUB_TOKEN;

async function fetchRepoData(url) {
    const repoOwnerAndName = extractRepoOwnerAndName(url);
    const apiUrl = `https://api.github.com/repos/${repoOwnerAndName}`;

    try {
        // Fetch repository details
        const repoResponse = await axios.get(apiUrl, {
            headers: { 'Authorization': `Bearer ${githubToken}` }
        });

        // Fetch README content from the repository's default branch
        const readmeResponse = await axios.get(`${apiUrl}/readme`, {
            headers: {
                'Authorization': `Bearer ${githubToken}`,
                'Accept': 'application/vnd.github.VERSION.raw'
            }
        });

        // Return structured repository and README data
        return {
            repoData: repoResponse.data,
            readmeData: readmeResponse.data // This is the raw content of README.md
        };
    } catch (error) {
        console.error('Error fetching data:', error.message);
        return null;
    }
}

function extractRepoOwnerAndName(url) {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    return match ? `${match[1]}/${match[2]}` : null;
}

module.exports = { fetchRepoData };
