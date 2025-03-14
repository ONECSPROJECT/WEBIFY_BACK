# Webify Backend - Project Setup

## 📁 Directory Structure
```
back/
├── app
│   ├── config
│   │   ├── db.js
│   │   └── swagger.json
│   ├── controllers
│   │   ├── authController.js
│   │   └── passResetController.js
│   ├── Dockerfile
│   ├── index.js
│   ├── models
│   │   ├── Account.js
│   │   └── PasswordReset.js
│   ├── package.json
│   ├── package-lock.json
│   ├── routes
│   │   └── userRoutes.js
│   └── utils
│       └── emailService.js
├── db
│   └── init.sql
├── docker-compose.yml
├── README.md
└── run.sh
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
