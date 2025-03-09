### GitHub API Node.js Server

# This is a simple Node.js server using Express.js to interact with the GitHub API. It allows you to:

- Fetch your GitHub profile details.

- Fetch repository details.

- Create an issue in a specified repository.

## Installation

1. Clone this repository:

```bash
https://github.com/Suryakantdsa/cactro-backend.git
cd cactro-backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

- Generate a GitHub Personal Access Token from GitHub Developer Settings with repo access.
- Create a .env file in the root directory.
- Add your GitHub Personal Access Token:

```bash
PORT=port_number
GITHUB_TOKEN=github_api_token
GITHUB_USERNAME=your_github_user_name

```

4. Start the Server

```bash
npm run start
```

## The server runs on http://localhost:8008.
