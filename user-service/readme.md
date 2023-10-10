# Setup

1. `cp .env.example .env` and fill in the fields. JWT_SECRET can be a random string
2. Setup postgres docker container
3. Setup user-service container

# Postgres DB and user-service setup using Docker

1. Install docker desktop
2. In the root dir user-service/ run `docker build -f Dockerfile.postgres-db -t user-service-psql .`
3. Create user-service container
   `docker build -f Dockerfile.userservice-backend -t user-service-backend .`
4. Create network for user-service 
   `docker network create user-service`
5. Start DB container from image - replace fields 
   `docker run -e POSTGRES_PASSWORD=<db_password> --name user-service-db -d --network=user-service user-service-psql`
6. Get DB container IP - copy this value into DB_ADDR in .env
   `docker inspect user-service-db | grep IPAddress`
7. Start user-service container from image
   `docker run -p <FILL THIS TO LOCALMACHINE PORT>:3000 --env-file=.env --name user-service-backend -d --network=user-service user-service-backend`

Note: Verify user-service-backend prints admin accout created to ensure that DB is connected
Make a GET request to localhost:3000/v1/test where you will see `Hear you loud and clear`
DB is inaccessible to local machine, add expose flag if you want to access it

# Connecting to psql DB for verification

# Starting server - without using user-service container
Only do steps 2 and 5

## In Prod

1. Run `npm run build` - transpiles typescript into javascript
2. Run `npm run start:prod`

## In dev - note data is dropped on start

1. Run `npm run start:dev` - hot reloads using nodemon when files are changed

### Admin account

Username: admin@test.com
password: Set by ADMIN_PASSWORD field in .env
