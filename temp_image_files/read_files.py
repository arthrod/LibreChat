from pathlib import Path

# Define the FILES constant with file paths (both full and relative)
FILES = [
    '/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/aCode/LibreChat/client/src/localization/languages/Eng.ts',
    '/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/aCode/LibreChat/client/src/localization/languages/Br.ts',
    '/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/aCode/LibreChat/client/src/components/ui/Button.tsx',
    '/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/aCode/LibreChat/client/tailwind.config.cjs',
    '/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/aCode/LibreChat/client/src/style.css',
    '/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/aCode/LibreChat/client/src/routes/LandingPage.tsx',
]


def condense_files(files, output_file='all_files.txt'):
    with open(output_file, 'w', encoding='utf-8') as outfile:
        for file_path in files:
            path = Path(file_path)

            # Handle relative paths
            if not path.is_absolute():
                path = Path.cwd() / path

            if path.exists():
                with open(path, 'r', encoding='utf-8') as infile:
                    content = infile.read()
                    outfile.write(f"{path.absolute()}:\n{content}\n\n")
            else:
                print(f"Warning: File not found - {path}")

if __name__ == '__main__':
    condense_files(FILES)
    print(f"All files have been condensed into all_files.txt")