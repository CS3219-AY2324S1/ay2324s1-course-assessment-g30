FROM node:14
WORKDIR './client'
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3002
CMD ["npm", "start"]
