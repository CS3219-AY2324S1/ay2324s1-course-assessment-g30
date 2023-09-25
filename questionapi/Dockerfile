FROM alpine:latest
RUN apk update && \
    apk add nodejs npm
RUN npm install -g nodemon
WORKDIR '/questionapi'
COPY package*.json ./
RUN npm install
# RUN npm ci --omit=dev
COPY . .
EXPOSE 8080
CMD [ "nodemon", "index.js" ]