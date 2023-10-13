FROM node:19.5.0-alpine
WORKDIR './client'
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3002
CMD ["npm", "start"]
