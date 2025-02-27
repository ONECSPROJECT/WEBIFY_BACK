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
   git clone <repo_url>
   cd back
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

4. Check application logs:
   ```sh
   docker-compose logs -f app
   ```

---

## 🔄 Working as a Team

### **Developer 1 (Backend Development)**
- Modify **`index.js`** or add new routes
- Install dependencies inside the container:
  ```sh
  docker-compose exec app npm install <package>
  ```
- Restart the app if needed:
  ```sh
  docker-compose restart app
  ```

### **Developer 2 (Database Management)**
- Modify **`init.sql`** for schema updates
- Access the database shell:
  ```sh
  docker-compose exec db mysql -u root -p
  ```
- Run custom SQL commands:
  ```sql
  USE suphours;
  SELECT * FROM users;
  ```
- Apply changes and restart the database:
  ```sh
  docker-compose restart db
  ```

---

## 🛠️ Managing Dependencies
- To install a new package:
  ```sh
  docker-compose exec app npm install <package> --save
  ```
- To update dependencies:
  ```sh
  docker-compose exec app npm update
  ```
- If facing issues with `node_modules`, force rebuild:
  ```sh
  docker-compose down -v
  docker-compose build --no-cache
  docker-compose up -d
  ```

---

## 🛢️ Database Usage
- Default credentials (stored in `docker-compose.yml`):
  ```env
  DATABASE_HOST=db
  DATABASE_USER=root
  DATABASE_PASSWORD=rootpassword
  DATABASE_NAME=suphours
  ```
- Initial schema is set by `init.sql`
- To persist data, volumes are used (`mariadb_data`)

---

## 📌 Common Issues & Fixes
### Express module not found (`MODULE_NOT_FOUND`)
1. Ensure dependencies are installed inside the container:
   ```sh
   docker-compose exec app npm install
   ```
2. Bind-mount `node_modules` to prevent overwriting:
   Modify `docker-compose.yml`:
   ```yaml
   volumes:
     - ./app:/usr/src/app
     - /usr/src/app/node_modules
   ```
3. Rebuild everything:
   ```sh
   docker-compose down -v
   docker-compose up -d --build
   ```

### Database not starting
1. Check logs:
   ```sh
   docker-compose logs -f db
   ```
2. Ensure `init.sql` does not have syntax errors.

---

## 🎯 Next Steps
- Define API endpoints []
- Implement authentication []

🚀 **Happy Coding!**


