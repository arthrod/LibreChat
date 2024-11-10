import os
from pathlib import Path

def generate_tree(startpath, output_file):
    startpath = Path(startpath)  # Ensure startpath is a Path object
    with open(output_file, 'w', encoding='utf-8') as f:
        for root, dirs, files in os.walk(startpath):
            root_path = Path(root)  # Convert root to Path object
            level = len(root_path.relative_to(startpath).parts)
            indent = '│   ' * (level - 1) + '├── ' if level > 0 else ''
            f.write(f'{indent}{root_path.name}/\n')
            for file in files:
                sub_indent = '│   ' * level + '├── '
                f.write(f'{sub_indent}{file}\n')

if __name__ == '__main__':
    script_dir = Path(__file__).parent.absolute()
    output_file = script_dir / 'dir.txt'
    generate_tree(script_dir, output_file)
    print(f"Directory structure has been saved to {output_file}")
