#!/bin/bash

# Set variables
ORIGINAL_IMAGE="ghcr.io/danny-avila/librechat-dev:latest"

echo "Pulling original image..."
docker pull $ORIGINAL_IMAGE

echo "Creating temporary container..."
docker create --name temp_container $ORIGINAL_IMAGE
docker cp temp_container:/app ./full_app
docker rm temp_container

echo -e "\n=== Directory Structure ==="
find ./full_app -type d

echo -e "\n=== Route Files ==="
find ./full_app -type f -path "*/routes/*"

echo -e "\n=== Shell Scripts ==="
find ./full_app -type f -name "*.sh" -exec sh -c 'echo -e "\nContent of {}:\n"; cat {}' \;
