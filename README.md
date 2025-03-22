# Webify Backend - Project Setup

## 📁 Directory Structure
```
back/
| .git/                  
| app/                   
| | config/              
| | controllers/         
| | | absenceController.js
| | | authController.js
| | | passResetController.js
| | | periodController.js
| | | userController.js
| | dist/               
| | models/             
| | | Absence.js
| | | Account.js
| | | BaseModel.js
| | | PasswordReset.js
| | routes/             
| | | absenceRoutes.js
| | | periodRoutes.js
| | | userRoutes.js
| | utils/              
| | .dockerignore       
| | db-test.js          
| | Dockerfile          
| | index.js            
| | package-lock.json   
| | package.json        
| db/                    
| .env                   
| .gitignore             
| README.md              
| docker-compose.yml     
| init.sql               
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

## SwaggerUI 2.0

- Interactive docs found at `/api-docs`
- Read more about SwaggerUI [here](https://swagger.io/tools/swagger-ui/)
