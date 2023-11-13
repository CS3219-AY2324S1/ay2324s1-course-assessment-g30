# Setting up PeerPrep

1. Install docker desktop
2. In the root directory, run `docker-compose up -d --force-recreate --build`
3. Once the container is built, the application should be running on localhost:3002


# Help
* Give the containers sometime to start up
* Delete the docker containers and images and rebuild the containers

# Deployment of Peerprep onto GKE
1. Initialize secrets in shell environment 
```export DB_NAME=user-service-db
export DB_USERNAME=x
export DB_PASSWORD=x
export JWT_KEY=x
export ADMIN_PASSWORD=x
export OPENAI_KEY=x
```
2. Run deployment.sh, as such `sh deployment.sh`, this will build all the images and push them to artifact registry, create the config endpoints, secrets, service accounts needed and start the load balancers.
3. Get the load balancer IP for each service and amend client/.env. This is required since in React, the environment variables have to be built with the application, therefore we are not able to build the frontend, deploy it and then inject the variables later
4. Run deployclient.sh as such `sh deployclient.sh`
5. Amend endpoint-config-map.yaml with the external IP for all services and apply it `Kubectl apply -f endpoint-config-map.yaml`
6. Recreate all pods `Kubectl delete pods –all`



You can email e0725346@u.nus.edu or contact @hongshenggggg on telegram should you need more assistance! 
