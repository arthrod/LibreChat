#!/usr/bin/env python3
import os
import sys
import filecmp
from pathlib import Path

def print_with_color(text, color):
    colors = {
        'red': '\033[91m',
        'green': '\033[92m',
        'yellow': '\033[93m',
        'blue': '\033[94m',
        'end': '\033[0m'
    }
    print(f"{colors.get(color, '')}{text}{colors['end']}")

def check_and_delete_duplicates(dry_run=True):
    # Get the root directory of the project
    root_dir = os.getcwd()
    full_app_dir = os.path.join(root_dir, 'full_app')
    
    if not os.path.exists(full_app_dir):
        print_with_color(f"Error: full_app directory not found in {root_dir}", 'red')
        return
    
    duplicates = []
    unique_files = []
    errors = []
    
    print_with_color("\nAnalyzing files...", 'blue')
    status = "DRY RUN - No files will be deleted" if dry_run else "WARNING: Files will be deleted!"
    print_with_color(status, 'yellow' if dry_run else 'red')
    print("-" * 50)
    
    # Walk through all files in full_app
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
            
            # Construct the equivalent path in root directory
            root_path = os.path.join(root_dir, rel_path)
            
            try:
                # If the file exists in both places
                if os.path.exists(root_path):
                    # Compare the files
                    if filecmp.cmp(full_app_path, root_path, shallow=False):
                        duplicates.append({
                            'path': rel_path,
                            'full_app_path': full_app_path,
                            'root_path': root_path
                        })
                        print(f"Found duplicate: {rel_path}")
                        
                        # Delete the file if not in dry run mode
                        if not dry_run:
                            try:
                                os.remove(full_app_path)
                                print_with_color(f"  Deleted: full_app/{rel_path}", 'green')
                            except Exception as e:
                                errors.append(f"Error deleting full_app/{rel_path}: {str(e)}")
                    else:
                        unique_files.append(f"Different content: {rel_path}")
                else:
                    unique_files.append(rel_path)
            except Exception as e:
                errors.append(f"Error processing {rel_path}: {str(e)}")
    
    # Print summary
    print_with_color("\nSummary:", 'blue')
    print(f"Total files analyzed: {len(duplicates) + len(unique_files)}")
    print(f"Duplicate files found: {len(duplicates)}")
    print(f"Unique files: {len(unique_files)}")
    
    if duplicates:
        print_with_color("\nDuplicate files" + (" to be deleted:" if dry_run else " deleted:"), 'yellow')
        current_dir = None
        for dup in sorted(duplicates, key=lambda x: x['path']):
            dir_name = dup['path'].split('/')[0]
            if current_dir != dir_name:
                current_dir = dir_name
                print_with_color(f"\nIn /{dir_name}:", 'blue')
            print(f"  {'/'.join(dup['path'].split('/')[1:])}")
    
    if unique_files:
        print_with_color("\nUnique files in full_app (will be kept):", 'green')
        current_dir = None
        for file in sorted(unique_files):
            if isinstance(file, str) and '/' in file:
                dir_name = file.split('/')[0]
                if current_dir != dir_name:
                    current_dir = dir_name
                    print_with_color(f"\nIn /{dir_name}:", 'blue')
                print(f"  {'/'.join(file.split('/')[1:])}")
    
    if errors:
        print_with_color("\nErrors encountered:", 'red')
        for error in errors:
            print(f"  {error}")
    
    if not dry_run:
        # Clean up empty directories
        print_with_color("\nCleaning up empty directories...", 'blue')
        for dirpath, dirnames, filenames in os.walk(full_app_dir, topdown=False):
            try:
                if not os.listdir(dirpath):
                    os.rmdir(dirpath)
                    print_with_color(f"Removed empty directory: {os.path.relpath(dirpath, full_app_dir)}", 'green')
            except Exception as e:
                print_with_color(f"Error removing directory {os.path.relpath(dirpath, full_app_dir)}: {str(e)}", 'red')

if __name__ == "__main__":
    try:
        print_with_color("This script will check for and optionally delete duplicate files in full_app that exist in root directories.", 'blue')
        print("\n1. Dry run (just show what would be deleted)")
        print("2. Delete files")
        print("3. Exit")
        
        choice = input("\nEnter your choice (1-3): ").strip()
        
        if choice == '1':
            check_and_delete_duplicates(dry_run=True)
        elif choice == '2':
            confirm = input("Are you sure you want to delete duplicate files? This cannot be undone! Type 'yes' to confirm: ")
            if confirm.lower() == 'yes':
                check_and_delete_duplicates(dry_run=False)
            else:
                print_with_color("Operation cancelled.", 'yellow')
        else:
            print_with_color("Operation cancelled.", 'yellow')
            
    except Exception as e:
        print_with_color(f"Error: {str(e)}", 'red')
        sys.exit(1)
    except KeyboardInterrupt:
        print_with_color("\nOperation cancelled by user.", 'yellow')
        sys.exit(0)
