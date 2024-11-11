#!/bin/bash
set -e

# Initialize variables
TEMP_DIR="/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/aCode/LibreChat/temp_image_files"
COMPARISON_LOG="comparison.log"
IMAGE_NAME="arthrod82/librechat-dev"
CICERO_IMAGE_NAME="arthrod82/cicero-dev"  # AMD64 specific image

echo "Starting sync process..."
true > "$COMPARISON_LOG"  # Clear log file

# Get current version from existing image
echo "Getting current version..."
current_version=$(docker images "$IMAGE_NAME" --format "{{.Tag}}" | grep -v 'latest' | sort -V | tail -n1)
if [ -z "$current_version" ]; then
    current_version="0.0.0"
fi

# Increment version
IFS='.' read -ra version_parts <<< "$current_version"
MINOR_VERSION=$((version_parts[2] + 1))
NEW_VERSION="${version_parts[0]}.${version_parts[1]}.$MINOR_VERSION"

echo "Current version: $current_version"
echo "New version: $NEW_VERSION"

# Function to build initial image
build_initial_image() {
    local platform=$1
    local image_name=$2
    echo "Building initial image for $platform..."
    docker build --platform $platform -t "$image_name:$NEW_VERSION" .
    docker tag "$image_name:$NEW_VERSION" "$image_name:latest"
}

# Function to sync files
sync_files() {
    local platform=$1
    local image_name=$2
    
    # Check if image exists
    if ! docker image inspect "$image_name:latest" >/dev/null 2>&1; then
        build_initial_image "$platform" "$image_name"
        return
    fi
    
    local container_id=$(docker create --platform $platform "$image_name:latest")
    
    echo "Extracting files from container ($platform)..."
    mkdir -p "$TEMP_DIR"
    docker cp "$container_id:/app/." "$TEMP_DIR/"
    echo "Successfully copied $(du -sh "$TEMP_DIR" | cut -f1) to $TEMP_DIR/"
    
    echo "Comparing files..."
    
    # Process root files first
    echo "Processing root files..."
    for file in ./*; do
        if [ -f "$file" ] && [[ ! "$file" =~ ^\./.git ]]; then
            rel_path=${file#./}
            image_file="$TEMP_DIR/$rel_path"
            compare_and_log "$file" "$image_file" "$rel_path"
        fi
    done

    # Process directories
    for dir in api client docs e2e packages utils "client/dist"; do
        if [ -d "$dir" ]; then
            echo "Processing directory: $dir"
            find "./$dir" -type f | while read -r local_file; do
                rel_path=${local_file#./}
                image_file="$TEMP_DIR/$rel_path"
                compare_and_log "$local_file" "$image_file" "$rel_path"
            done
        fi
    done

    # Copy files back to container
    echo "Copying updated files back to container..."
    docker cp "$TEMP_DIR/." "$container_id:/app/"
    echo "Successfully copied $(du -sh "$TEMP_DIR" | cut -f1) to $container_id:/app/"
    
    # Create new version from container
    docker commit "$container_id" "$image_name:$NEW_VERSION"
    docker tag "$image_name:$NEW_VERSION" "$image_name:latest"
    
    # Cleanup container
    docker rm "$container_id"
}

# Function to compare files
compare_and_log() {
    local_file=$1
    image_file=$2
    rel_path=$3

    # Skip node_modules and .git directories
    if [[ $rel_path == *"node_modules"* ]] || [[ $rel_path == *".git"* ]] || [[ $rel_path == *".DS_Store"* ]]; then
        return
    fi

    # If local file exists but not in image
    if [ ! -f "$image_file" ]; then
        echo "NEW: $rel_path" | tee -a "$COMPARISON_LOG"
        mkdir -p "$(dirname "$image_file")"
        cp "$local_file" "$image_file"
        return
    fi

    # Check if files are different
    if ! cmp -s "$local_file" "$image_file"; then
        echo "MODIFIED: $rel_path" | tee -a "$COMPARISON_LOG"
        cp "$local_file" "$image_file"
    fi
}

# Build for ARM64 (default)
echo "Building for ARM64..."
sync_files "linux/arm64" "$IMAGE_NAME"

# Build for AMD64 (cicero)
echo "Building for AMD64..."
sync_files "linux/amd64" "$CICERO_IMAGE_NAME"

# Push all images to Docker Hub
echo "Pushing images to Docker Hub..."
docker push "$IMAGE_NAME:$NEW_VERSION"
docker push "$IMAGE_NAME:latest"
docker push "$CICERO_IMAGE_NAME:$NEW_VERSION"
docker push "$CICERO_IMAGE_NAME:latest"

# Cleanup
echo "Cleaning up..."
rm -rf "$TEMP_DIR"

echo "Sync complete! Check $COMPARISON_LOG for details."
echo "ARM64 image: $IMAGE_NAME:$NEW_VERSION and $IMAGE_NAME:latest"
echo "AMD64 image: $CICERO_IMAGE_NAME:$NEW_VERSION and $CICERO_IMAGE_NAME:latest"
