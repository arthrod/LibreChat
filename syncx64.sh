#!/bin/bash
set -e

# Initialize variables
TEMP_DIR="/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/aCode/LibreChat/temp_image_files"
COMPARISON_LOG="comparison.log"
CICERO_IMAGE_NAME="arthrod82/cicero-dev"

echo "Starting sync process for AMD64..."
true > "$COMPARISON_LOG"

# Get current version
echo "Getting current version..."
current_version=$(docker images "$CICERO_IMAGE_NAME" --format "{{.Tag}}" | grep -v 'latest' | sort -V | tail -n1)
if [ -z "$current_version" ]; then
    current_version="0.0.0"
fi

# Increment version
IFS='.' read -ra version_parts <<< "$current_version"
MINOR_VERSION=$((version_parts[2] + 1))
NEW_VERSION="${version_parts[0]}.${version_parts[1]}.$MINOR_VERSION"

echo "Current version: $current_version"
echo "New version: $NEW_VERSION"

# Create temporary build context
echo "Creating temporary build context..."
BUILD_CONTEXT=$(mktemp -d)

# Copy project files to build context
echo "Copying project files..."
rsync -av --exclude '.git' \
         --exclude 'node_modules' \
         --exclude 'dist' \
         --exclude 'build' \
         . "$BUILD_CONTEXT/"

# Copy librechat.yaml to build context root
echo "Copying librechat.yaml..."
cp "$TEMP_DIR/librechat.yaml" "$BUILD_CONTEXT/librechat.yaml"

# Verify file exists in build context
if [ ! -f "$BUILD_CONTEXT/librechat.yaml" ]; then
    echo "Error: librechat.yaml not found in build context"
    exit 1
fi

# Build data-provider package
echo "Building data-provider package..."
cd packages/data-provider
npm install
npm run clean
npm run build
cd ../..

# Build the image
echo "Building AMD64 image..."
docker buildx create --name cicero-builder --driver docker-container --bootstrap || true
docker buildx use cicero-builder

# Build using the build context
docker buildx build --platform linux/amd64 \
    -t "$CICERO_IMAGE_NAME:$NEW_VERSION" \
    -t "$CICERO_IMAGE_NAME:latest" \
    -f Dockerfile.cicero \
    --push \
    "$BUILD_CONTEXT"

# Cleanup
echo "Cleaning up..."
docker buildx rm cicero-builder
rm -rf "$BUILD_CONTEXT"

echo "Build complete!"
echo "AMD64 image: $CICERO_IMAGE_NAME:$NEW_VERSION and $CICERO_IMAGE_NAME:latest"
