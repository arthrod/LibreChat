#!/bin/bash

# Set variables
ORIGINAL_IMAGE="ghcr.io/danny-avila/librechat-dev:latest"
NEW_IMAGE="arthrod82/librechat-dev:latest"

echo "Building custom LibreChat image..."

# Pull the original image
echo "Pulling original image..."
docker pull $ORIGINAL_IMAGE

# Create a temporary container and copy the app folder
echo "Creating temporary container..."
docker create --name temp_container $ORIGINAL_IMAGE
docker cp temp_container:/app/client ./temp_client
docker rm temp_container

echo "Replacing and adding files..."
# Iterate through all files in our local client directory
find ./client -type f | while read local_file; do
    # Get the relative path by removing ./client/
    rel_path=${local_file#./client/}
    
    # Create directory if it doesn't exist
    mkdir -p "$(dirname "./temp_client/$rel_path")"
    
    # Copy the file (this will either replace existing or create new)
    cp -f "$local_file" "./temp_client/$rel_path"
    
    # Log important route-related files
    if [[ "$rel_path" == *"/routes/"* ]] || [[ "$rel_path" == *"AuthContext"* ]]; then
        echo "Processed route file: $rel_path"
    fi
done

# Build new image using our Dockerfile
echo "Building new image..."
docker build -t $NEW_IMAGE -f Dockerfile.custom .

# Clean up
echo "Cleaning up..."
rm -rf ./temp_client

# Push to Docker Hub
echo "Pushing image to Docker Hub..."
docker push $NEW_IMAGE

echo "Done! Your custom image is now available at $NEW_IMAGE"
