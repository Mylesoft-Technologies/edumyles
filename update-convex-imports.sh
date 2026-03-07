#!/bin/bash

# Update all files to use SSR-safe Convex hooks
find /home/jonathan/projects/edumyles/frontend/src -name "*.tsx" -exec grep -l "from.*convex/react" {} \; | cut -d: -f1 | sort | uniq

echo "Found files using Convex hooks:"
find /home/jonathan/projects/edumyles/frontend/src -name "*.tsx" -exec grep -l "from.*convex/react" {} \; | cut -d: -f1 | sort | uniq

# Update each file to use safe hooks
for file in $(find /home/jonathan/projects/edumyles/frontend/src -name "*.tsx" -exec grep -l "from.*convex/react" {} \; | cut -d: -f1 | sort | uniq); do
  echo "Updating $file..."
  # Replace Convex imports with safe imports
  sed -i 's|from "convex/react"|from "../hooks/useSSRSafeConvex"|g' "$file"
done

echo "✅ Updated all files to use SSR-safe Convex hooks"
