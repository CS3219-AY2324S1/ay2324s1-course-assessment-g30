#!/bin/bash
gcloud auth configure-docker \
    asia-southeast1-docker.pkg.dev
gcloud container clusters get-credentials peerprep --region asia-southeast1
kubectl apply -f endpoint-config-map.yaml
cd user-service
kubectl apply -f service-account.yaml

kubectl annotate serviceaccount \
  ksa-cloud-sql  \
  iam.gke.io/gcp-service-account=gke-service-account@cs3219-402913.iam.gserviceaccount.com



# Create postgres secrets
kubectl create secret generic gke-cloud-sql-secrets --from-literal=database=$DB_NAME --from-literal=username=$DB_USERNAME --from-literal=password=$DB_PASSWORD

# Create user-service-secrets
kubectl create secret generic user-service-secrets --from-literal=jwt-private-key=$JWT_KEY --from-literal=admin-password=$ADMIN_PASSWORD

cd ../ 
# Build and tag user service
cd user-service;
docker build -f Dockerfile.userservice-backend  -t userservice_prod --platform=linux/amd64 .
docker tag userservice_prod asia-southeast1-docker.pkg.dev/cs3219-402913/peerprep/userservice_prod
docker push asia-southeast1-docker.pkg.dev/cs3219-402913/peerprep/userservice_prod

# Create user-service deployment and expose user-service
kubectl apply -f deployment.yaml

cd ..

# Build and tag question service
cd question-service
docker build -f Dockerfile -t questionservice_prod --platform=linux/amd64 .
docker tag questionservice_prod asia-southeast1-docker.pkg.dev/cs3219-402913/peerprep/questionservice_prod
docker push asia-southeast1-docker.pkg.dev/cs3219-402913/peerprep/questionservice_prod

# Create question-service deployment and expose question-service
kubectl apply -f deployment.yaml


cd ../
cd collaboration-service
# Build and tag collaboration service
docker build -f Dockerfile -t collaborationservice_prod --platform=linux/amd64 .
docker tag collaborationservice_prod asia-southeast1-docker.pkg.dev/cs3219-402913/peerprep/collaborationservice_prod
docker push asia-southeast1-docker.pkg.dev/cs3219-402913/peerprep/collaborationservice_prod

# Create collaboration-service deployment and expose collaboration-service
kubectl apply -f deployment.yaml

cd ../
cd matching-service

# Build and tag matching service
docker build -f Dockerfile -t matchingservice_prod --platform=linux/amd64 .
docker tag matchingservice_prod asia-southeast1-docker.pkg.dev/cs3219-402913/peerprep/matchingservice_prod
docker push asia-southeast1-docker.pkg.dev/cs3219-402913/peerprep/matchingservice_prod

# Create matching-service deployment and expose matching-service
kubectl apply -f deployment.yaml

cd ../
cd openai-service
# Build and tag openai service
docker build -f Dockerfile -t openaiservice_prod --platform=linux/amd64 .
docker tag openaiservice_prod asia-southeast1-docker.pkg.dev/cs3219-402913/peerprep/openaiservice_prod
docker push asia-southeast1-docker.pkg.dev/cs3219-402913/peerprep/openaiservice_prod

# Create Openai secrets
kubectl create secret generic openai-service-secrets --from-literal=api-key=$OPENAI_KEY

# Create openai-service deployment and expose openai-service
kubectl apply -f deployment.yaml