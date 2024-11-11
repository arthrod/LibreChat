#!/usr/bin/env python3

import os
import json
from pathlib import Path
from typing import Dict, List, Set
import sys
import re


class ProjectStructureChecker:
    def __init__(self, root_dir: str):
        self.root_dir = Path(root_dir)
        self.required_dirs = {
            "api",
            "client",
            "packages/data-provider",
        }
        self.required_files = {
            "package.json",
            "api/package.json",
            "client/package.json",
            "packages/data-provider/package.json",
            "Dockerfile.cicero",
            "syncx64.sh",
        }
        self.required_scripts = {
            "root": {"frontend", "backend"},
            "data-provider": {"build", "clean"},
        }
        self.issues: List[str] = []

    def check_directories(self) -> None:
        print("\n🔍 Checking required directories...")
        for dir_path in self.required_dirs:
            full_path = self.root_dir / dir_path
            if not full_path.is_dir():
                self.issues.append(f"❌ Missing directory: {dir_path}")
            else:
                print(f"✅ Found directory: {dir_path}")

    def check_files(self) -> None:
        print("\n🔍 Checking required files...")
        for file_path in self.required_files:
            full_path = self.root_dir / file_path
            if not full_path.is_file():
                self.issues.append(f"❌ Missing file: {file_path}")
            else:
                print(f"✅ Found file: {file_path}")

    def check_package_scripts(self) -> None:
        print("\n🔍 Checking package.json scripts...")

        # Check root package.json
        root_pkg = self.read_package_json(self.root_dir / "package.json")
        if root_pkg:
            self._verify_scripts(root_pkg, self.required_scripts["root"], "root")

        # Check data-provider package.json
        data_provider_pkg = self.read_package_json(
            self.root_dir / "packages/data-provider/package.json"
        )
        if data_provider_pkg:
            self._verify_scripts(
                data_provider_pkg,
                self.required_scripts["data-provider"],
                "data-provider",
            )

    def read_package_json(self, path: Path) -> Dict:
        try:
            with open(path) as f:
                return json.load(f)
        except Exception as e:
            self.issues.append(f"❌ Error reading {path}: {str(e)}")
            return {}

    def _verify_scripts(
        self, package: Dict, required_scripts: Set[str], pkg_name: str
    ) -> None:
        if "scripts" not in package:
            self.issues.append(f"❌ No scripts section in {pkg_name} package.json")
            return

        scripts = package["scripts"]
        for script in required_scripts:
            if script not in scripts:
                self.issues.append(
                    f"❌ Missing required script '{script}' in {pkg_name} package.json"
                )
            else:
                print(f"✅ Found script '{script}' in {pkg_name} package.json")

    def command_exists(self, content: str, cmd: str) -> bool:
        # Define patterns for different command formats
        patterns = [
            rf'CMD \[.*"{cmd}".*\]',  # CMD ["npm", "run", "backend"]
            rf'CMD \[.*"npm", "run", "{cmd}".*\]',  # CMD ["npm", "run", "backend"]
            rf"CMD npm run {cmd}",  # CMD npm run backend
            rf"RUN .*npm run {cmd}",  # RUN npm run backend
            rf'RUN .*"{cmd}"',  # RUN "backend"
        ]

        return any(re.search(pattern, content, re.MULTILINE) for pattern in patterns)

    def check_dockerfile_cicero(self) -> None:
        print("\n🔍 Checking Dockerfile.cicero content...")
        dockerfile_path = self.root_dir / "Dockerfile.cicero"
        if not dockerfile_path.exists():
            self.issues.append("❌ Dockerfile.cicero not found")
            return

        required_commands = [
            ("WORKDIR /app", "WORKDIR command"),
            ("COPY package*.json", "package.json copy"),
            ("npm ci", "npm install"),
            ("npm run build", "build command"),
            ("npm run frontend", "frontend build"),
            (
                "backend",
                "backend command",
            ),  # Changed to just 'backend' to match any format
        ]

        try:
            with open(dockerfile_path) as f:
                content = f.read()
                for cmd, desc in required_commands:
                    if not (cmd in content or self.command_exists(content, cmd)):
                        self.issues.append(
                            f"❌ Missing {desc} in Dockerfile.cicero: {cmd}"
                        )
                    else:
                        print(f"✅ Found {desc} in Dockerfile.cicero")
        except Exception as e:
            self.issues.append(f"❌ Error reading Dockerfile.cicero: {str(e)}")

    def run_checks(self) -> bool:
        print("🚀 Starting project structure verification...")
        self.check_directories()
        self.check_files()
        self.check_package_scripts()
        self.check_dockerfile_cicero()

        if self.issues:
            print("\n❌ Found issues:")
            for issue in self.issues:
                print(f"  {issue}")
            return False

        print("\n✅ All checks passed! Project structure is correct for Docker build.")
        return True


def main():
    # Get the project root directory (current directory or from argument)
    root_dir = sys.argv[1] if len(sys.argv) > 1 else os.getcwd()

    checker = ProjectStructureChecker(root_dir)
    success = checker.run_checks()

    # Exit with appropriate status code
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
