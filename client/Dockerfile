# FROM node:16-alpine as builder
# WORKDIR './client'
# COPY ./package.json ./
# RUN npm install
# COPY . .
# EXPOSE 3002
# CMD ["npm", "start"]
FROM node:14-alpine
WORKDIR './client'
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3002
CMD ["npm", "start"]