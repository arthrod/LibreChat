import os

def update_file(file_path, new_content):
    """Update a file with new content, creating directories if needed."""
    try:
        # Create directories if they don't exist
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        # Read the existing file content
        with open(file_path, "r") as f:
            content = f.read()
            
        # Remove InfiniteCollections import
        content = content.replace("  InfiniteCollections,\n", "")
        
        with open(file_path, "w") as f:
            f.write(content)
        
        print(f"Successfully updated {file_path}")
        return True
    except Exception as e:
        print(f"Error updating {file_path}: {e!s}")
        return False

# File updates
files_to_update = {
    "client/src/data-provider/mutations.ts": "",  # Content will be read from existing file
}

def main():
    """Update all configured files."""
    for file_path, content in files_to_update.items():
        update_file(file_path, content)

if __name__ == "__main__":
    main()
