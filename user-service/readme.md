# Postgres setup using docker

1. Install docker desktop
2. In the root dir user-service/ run the following commands

- `docker build -f Dockerfile.postgres-db -t user-service-psql .`
- `docker build -f Dockerfile.userservice-backend -t user-service-backend .`
- `docker network create user-service`
- `docker run -p 1111:5432 -e POSTGRES_PASSWORD=<FILL PASSWORD> --name user-service-db -d --network=user-service user-service-psql`
- `docker inspect user-service-db | grep IPAddress` # copy this value into DB_ADDR in .env
- `docker run -p <FILL THIS TO LOCALMACHINE PORT>:3000 --env-file=.env --name user-service-backend -d --network=user-service user-service-backend`

Note: To connect to docker container
docker exec -it <container_num> bash

To verify docker container has db:

1. docker exec -it <container_num> bash
2. Once connected to the container run `psql -U postgres` to connect to the docker postgres instance
3. Type `\c` and verify that the userservice database has been created

# Setup

1. Run npm install
2. If using your local intance of psql skip this step. Setup psql for user service using above docker instruction
3. Copy .env.example into .env file and fill in details to connect to your local instance of postgresql or docker instance. JWT_SECRET can be a random string

# Starting server

## In Prod

1. Run `npm run build` - transpiles typescript into javascript
2. Run `npm run start:prod`

## In dev - note data is dropped on start

1. Run `npm run start:dev` - hot reloads using nodemon when files are changed
