# Webify Backend - Project Setup

## 📁 Directory Structure
```
back/
| .git/                  # Git repository
| app/                   # Application code
| | config/              # Configuration files
| | Dockerfile           # Dockerfile for the Node.js app
| | index.js             # Main server file
| | package-lock.json    # NPM lock file
| | package.json         # Node.js dependencies
| db/                    # Database-related files
| .env                   # Environment variables (not committed)
| .gitignore             # Git ignore rules
| README.md              # Documentation
| docker-compose.yml     # Docker Compose configuration
| init.sql               # SQL initialization script
```

---

## 🚀 Getting Started

### Prerequisites
- [Docker](https://www.docker.com/) installed
- [Docker Compose](https://docs.docker.com/compose/) installed

### 🔧 Setup Instructions
1. Clone the repository:
   ```sh
   git clone https://github.com/ONECSPROJECT/WEBIFY_BACK
   cd WEBIFY_BACK
   ```

2. Build and start the services:
   ```sh
   docker-compose up -d --build
   ```
   - `-d`: Runs containers in detached mode
   - `--build`: Ensures fresh build of images

3. Verify running containers:
   ```sh
   docker ps
   ```
   - `app`: Node.js application (Express)
   - `db`: MariaDB database

---

## 🔄 Working as a Team (meant for backend devs)

> [!TIP]
> We'll we using [`nodemon`](https://github.com/remy/nodemon) to enable hot-reload for development

To start the application. Use **nodemon** instead of **node**

```sh
npm install -g nodemon
# within the app/ dir
nodemon index.js
```

---

## 🎯 Next Steps
- Define API endpoints []
- Implement authentication []
