#!/usr/bin/env python3

import json
from pathlib import Path


def check_scripts():
    root_dir = Path.cwd()

    # Check root package.json
    print("\n📦 Checking root package.json scripts:")
    try:
        with open(root_dir / "package.json") as f:
            root_pkg = json.load(f)
            scripts = root_pkg.get("scripts", {})
            print("\nRoot scripts found:")
            for script, command in scripts.items():
                print(f"  - {script}: {command}")

            # Check specific required scripts
            required_root = {"frontend", "backend"}
            missing_root = required_root - set(scripts.keys())
            if missing_root:
                print(f"\n❌ Missing required root scripts: {missing_root}")
            else:
                print("\n✅ All required root scripts found")
    except FileNotFoundError:
        print("❌ Root package.json not found")
    except json.JSONDecodeError:
        print("❌ Error parsing root package.json")

    # Check data-provider package.json
    print("\n📦 Checking packages/data-provider/package.json scripts:")
    try:
        with open(root_dir / "packages/data-provider/package.json") as f:
            dp_pkg = json.load(f)
            scripts = dp_pkg.get("scripts", {})
            print("\nData-provider scripts found:")
            for script, command in scripts.items():
                print(f"  - {script}: {command}")

            # Check specific required scripts
            required_dp = {"build", "clean"}
            missing_dp = required_dp - set(scripts.keys())
            if missing_dp:
                print(f"\n❌ Missing required data-provider scripts: {missing_dp}")
            else:
                print("\n✅ All required data-provider scripts found")
    except FileNotFoundError:
        print("❌ packages/data-provider/package.json not found")
    except json.JSONDecodeError:
        print("❌ Error parsing data-provider package.json")


if __name__ == "__main__":
    check_scripts()
