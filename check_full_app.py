#!/usr/bin/env python3
import os
from pathlib import Path
import sys

def print_directory_tree(startpath, prefix=''):
    """Print a directory tree starting from startpath"""
    for entry in os.listdir(startpath):
        if entry.startswith('.') or entry == 'node_modules':
            continue
        
        path = os.path.join(startpath, entry)
        print(f"{prefix}├── {entry}")
        if os.path.isdir(path):
            print_directory_tree(path, prefix + "│   ")

def check_missing_files():
    # Get the root directory of the project
    root_dir = os.getcwd()
    full_app_dir = os.path.join(root_dir, 'full_app')
    
    if not os.path.exists(full_app_dir):
        print(f"Error: full_app directory not found in {root_dir}")
        return
    
    print(f"\nProject structure:")
    print(f"Root directory: {root_dir}")
    print("\nFull app directory structure:")
    print_directory_tree(full_app_dir)
    
    # First, list all top-level directories
    root_dirs = [d for d in os.listdir(root_dir) 
                if os.path.isdir(os.path.join(root_dir, d)) 
                and not d.startswith('.') 
                and d != 'full_app'
                and d != 'node_modules']
    
    print("\nTop-level directories in root:")
    for d in sorted(root_dirs):
        print(f"  /{d}")
    
    missing_files = []
    
    print("\nAnalyzing files...")
    
    # Walk through all files and directories in full_app
    for dirpath, dirnames, filenames in os.walk(full_app_dir):
        # Remove hidden directories and node_modules from dirnames
        dirnames[:] = [d for d in dirnames if not d.startswith('.') and d != 'node_modules']
        
        for filename in filenames:
            # Skip hidden files
            if filename.startswith('.'):
                continue
                
            # Get full path in full_app
            full_app_path = os.path.join(dirpath, filename)
            
            # Get relative path from full_app directory
            rel_path = os.path.relpath(full_app_path, full_app_dir)
            
            # Skip if not in a subdirectory
            if '/' not in rel_path:
                continue
            
            # Get the first directory in the path (e.g., 'client', 'api', etc.)
            first_dir = rel_path.split('/')[0]
            
            # Skip if first_dir is not in root_dirs
            if first_dir not in root_dirs:
                continue
            
            # Construct the equivalent path in root directory
            root_path = os.path.join(root_dir, rel_path)
            
            # Check if file exists in root directory
            if not os.path.exists(root_path):
                missing_files.append({
                    'source': rel_path,
                    'destination': rel_path,
                    'first_dir': first_dir
                })
    
    # Print results grouped by first directory
    if missing_files:
        print("\nFiles present in full_app but missing in root directories:")
        print("-----------------------------------------------------")
        current_dir = None
        for file in sorted(missing_files, key=lambda x: (x['first_dir'], x['source'])):
            if current_dir != file['first_dir']:
                current_dir = file['first_dir']
                print(f"\nIn /{current_dir}:")
            rel_file_path = os.path.relpath(file['source'], current_dir)
            print(f"  {rel_file_path}")
            print(f"    From: full_app/{file['source']}")
            print(f"    To:   {file['destination']}")
    else:
        print("\nAll files from full_app are present in their respective root directories.")
    
    print("\nNote: This script only identifies missing files. No files were modified.")
    if missing_files:
        print(f"\nFound {len(missing_files)} missing files that could be copied from full_app.")

if __name__ == "__main__":
    try:
        check_missing_files()
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)
