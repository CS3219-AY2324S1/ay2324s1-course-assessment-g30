FROM node:latest

WORKDIR '/collaboration-service'

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3004

CMD ["node", "server.js"]