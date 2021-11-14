FROM node:16.13.0-alpine

WORKDIR /app

COPY . /app

RUN npm install -g npm@7.24.2

RUN npm install -g @angular/cli@12.2.13

RUN npm install 

CMD ng serve --host 0.0.0.0 --disable-host-check
