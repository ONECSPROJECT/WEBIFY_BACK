FROM node:20-slim

WORKDIR /usr/src/app

RUN npm i -g nodemon

COPY package.json package-lock.json ./
RUN npm i

COPY . .

CMD ["nodemon", "index.js"]

