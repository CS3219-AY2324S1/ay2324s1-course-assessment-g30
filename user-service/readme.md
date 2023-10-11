# Postgres setup using docker

1. Install docker desktop
2. In the root dir user-service/ run `docker build -f Dockerfile.postgres-db -t user-service-psql .`
3. Amend the password, container name and port as needed and run the command
   `docker run -p <db_port number>:5432 -e POSTGRES_PASSWORD=<db_password> --name <container_name> -d user-service-psql`

# Setup

1. Setup postgres docker contaier
2. Run npm install
3. `cp .env.example .env` and fill in the fields. JWT_SECRET can be a random string

# Starting server

## In Prod

1. Run `npm run build` - transpiles typescript into javascript
2. Run `npm run start:prod`

## In dev - note data is dropped on start

1. Run `npm run start:dev` - hot reloads using nodemon when files are changed

### Admin account

Username: admin@test.com
password: Set by ADMIN_PASSWORD field
