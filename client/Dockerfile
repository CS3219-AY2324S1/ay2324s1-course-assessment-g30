FROM node:16-alpine as builder
WORKDIR '/client'
COPY ./package.json ./
COPY . .
RUN npm ci
RUN npm run build

FROM nginx:alpine
COPY --from=builder /client/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf  
CMD ["nginx", "-g", "daemon off;"]

# For dev mode
# FROM node:16-alpine as builder
# WORKDIR './client'
# COPY ./package.json ./
# RUN npm install
# COPY . .
# # RUN npm run build // only use for deployment
# EXPOSE 3002
# CMD ["npm", "start"]