# Setup

1. Run npm install
2. Install postgresql onto your machine
3. Create a DB for postgresql and fill the DB detailsin .env
4. Copy .env.example into .env file and fill in details to connect to your local instance of postgresql. JWT_SECRET can be a random string

# Starting server

## In Prod

1. Run `npm run build` - transpiles typescript into javascript
2. Run `npm run start:prod`

## In dev - note data is dropped on start

1. Run `npm run start:dev` - hot reloads using nodemon when files are changed
