FROM node:16.13.0-alpine

ENV NODE_VERSION 14.16.1

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000
EXPOSE 9229
CMD [ "node", "dist/main" ]