FROM node:16-alpine as builder
WORKDIR './client'
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3002
CMD ["npm", "start"]