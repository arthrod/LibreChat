import os
import shutil
from pathlib import Path

def check_paths():
    """Check if the required paths exist"""
    base = Path('client')
    duplicate = Path('full_app/client')
    
    print("Checking paths:")
    print(f"Base path ({base}): {'exists' if base.exists() else 'does not exist'}")
    print(f"Duplicate path ({duplicate}): {'exists' if duplicate.exists() else 'does not exist'}")
    
    return base.exists() and duplicate.exists()

def list_directory_contents(path):
    """List contents of a directory"""
    path = Path(path)
    if path.exists():
        print(f"\nContents of {path}:")
        for item in path.iterdir():
            print(f"  {'[DIR]' if item.is_dir() else '[FILE]'} {item.name}")
            if item.is_dir():
                # List contents of public directory
                if item.name in ['public', 'dist']:
                    for subitem in item.iterdir():
                        print(f"    {'[DIR]' if subitem.is_dir() else '[FILE]'} {subitem.name}")
    else:
        print(f"\nDirectory {path} does not exist")

def cleanup_duplicates():
    """Main cleanup function"""
    if not check_paths():
        print("Required paths do not exist. Aborting.")
        return
    
    print("\nListing current directory contents:")
    list_directory_contents('client')
    list_directory_contents('full_app/client')
    
    print("\nStarting cleanup process...")
    
    base = Path('client')
    duplicate = Path('full_app/client')
    
    # Process public directory
    base_public = base / 'public'
    dup_public = duplicate / 'public'
    
    if dup_public.exists():
        print(f"\nProcessing public directory:")
        for item in dup_public.iterdir():
            print(f"Found item in duplicate public: {item.name}")
            if (base_public / item.name).exists():
                print(f"Removing duplicate: {item}")
                if item.is_file():
                    item.unlink()
                else:
                    shutil.rmtree(item)
            else:
                print(f"Moving {item.name} to base public directory")
                shutil.move(str(item), str(base_public / item.name))
        
        # Try to remove empty public directory
        if dup_public.exists() and not any(dup_public.iterdir()):
            print("Removing empty public directory")
            dup_public.rmdir()
    
    # Try to remove empty client directory
    if duplicate.exists() and not any(duplicate.iterdir()):
        print("\nRemoving empty duplicate client directory")
        duplicate.rmdir()
    
    print("\nCleanup completed")
    
    print("\nFinal directory state:")
    list_directory_contents('client')
    list_directory_contents('full_app/client')

if __name__ == "__main__":
    cleanup_duplicates()
