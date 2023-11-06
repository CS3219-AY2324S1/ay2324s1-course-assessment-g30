FROM node:16-alpine as builder
WORKDIR '/client'
COPY ./package.json ./
COPY .env ./
COPY . .
RUN npm ci
RUN npm run build

FROM  node:16-alpine
COPY --from=builder /client/build /client/build
WORKDIR /client
RUN npm install -g serve
EXPOSE 3002
CMD ["serve", "-s", "build", "-l", "3002"];

# To test it alone, run "docker build -t client ." inside /client
# To run the image, run "docker run -d -p 3002:3002 client" inside /client

# For dev mode
# FROM node:16-alpine as builder
# WORKDIR './client'
# COPY ./package.json ./
# RUN npm install
# COPY . .
# # RUN npm run build // only use for deployment
# EXPOSE 3002
# CMD ["npm", "start"]