#!/bin/bash
cd client
# Build on cloud build
gcloud builds submit --ignore-file Deployment/.gcloudignore --tag asia-southeast1-docker.pkg.dev/cs3219-402913/peerprep/client_prod . 


# Create client deployment and expose client
kubectl apply -f deployment.yaml