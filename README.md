# Obsidian Notes Graph

This tool automates building a knowledge base for quick learning or creating a reference guide. It fetches GitHub READMEs, adapts them for Obsidian, enabling users to visualise a topic and related fields using Obsidian's graph view.

## To-Do

- Expand to include plugins for additional websites.
- Explore alternative data collection methods.
- Enhance the reformatting process for Obsidian.
- Integrate a Language Model (LLM) for analyzing notes and determining structuring methods based on use cases.

## Features

- Fetches and reformats README files from GitHub for Obsidian compatibility.
- Utilizes environment variables for secure API key management.

## Prerequisites

- Node.js.
- A GitHub API key with repository access permissions.

## Setup

1. Clone this repository.
2. Install dependencies with `npm install`.
3. Create a `.env` file in the project's root, adding `GITHUB_API_KEY=your_api_key_here`.
4. Specify the repository URL in `index.js` (`const repoUrl = "[URL]"`).
5. Execute the script with the commands:

```bash
node index.js
