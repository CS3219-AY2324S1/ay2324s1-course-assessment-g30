# MongoDB questionapi setup using docker

1. Install docker desktop
2. In the root dir questionapi/ run `docker build . -t <docker-username>/question-api`
3. Amend container name and port as needed and run the command
   `docker run -p 3001:3001 -d <docker-username>/question-api`

Note: To access docker container:
Use the following link: `http://localhost:3001/`
You should see the following display: `You are on the question api service!`

# Starting sev (Dev mode)

1. Run `npm i` => install all dependencies from package.json
2. Run `nodemon index.js` => hot reloads the event loop
