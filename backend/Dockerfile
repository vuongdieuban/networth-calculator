FROM node:16.13.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g npm@7.24.2

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000
EXPOSE 9229
CMD [ "node", "dist/src/main.js" ]