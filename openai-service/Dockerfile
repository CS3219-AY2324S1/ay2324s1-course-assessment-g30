FROM alpine:latest
RUN apk update && \
    apk add nodejs npm
RUN npm install -g nodemon
WORKDIR '/openai-service'
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3005
CMD [ "nodemon", "index.js" ]