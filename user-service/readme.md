# Postgres setup using docker

1. Install docker desktop
2. In the root dir user-service/ run `docker build -t user-service-psql .`
3. Amend the password, container name and port as needed and run the command
   `docker run -p <port>:5432 -e POSTGRES_PASSWORD=<db_password> --name <container_name> -d user-service-psql`

Note: To connect to docker container
docker exec -it <container_num> bash

To verify docker container has db:

1. docker exec -it <container_num> bash
2. Once connected to the container run `psql -U posgres` to connect to the docker postgres instance
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
