#!/bin/bash

# Legacy Code Cleanup Script
# This script moves legacy chat API and component files to a backup folder
# following the successful migration to the new architecture.

echo "===================== LEGACY CODE CLEANUP ====================="
echo ""
echo "This script will archive legacy chat API and component files."
echo "Ensure you have completed the migration and all tests pass before running this script."
echo ""
echo "Press ENTER to continue or CTRL+C to abort..."
read

# Create backup directories if they don't exist
mkdir -p ./backup-files/src/app/api/chat
mkdir -p ./backup-files/src/components/chat
mkdir -p ./backup-files/src/app/chat

# Move legacy API files
echo "🗄️ Moving legacy API files to backup directory..."

# Check if route.js.backup doesn't already exist
if [ ! -f ./backup-files/src/app/api/chat/route.js.backup ]; then
  cp ./src/app/api/chat/route.js ./backup-files/src/app/api/chat/route.js.backup 2>/dev/null || :
fi

# Move legacy component files that have been replaced
echo "🗄️ Moving legacy component files to backup directory..."

# Check if HikmahChat.tsx doesn't already exist in backup
if [ -f ./src/components/chat/HikmahChat.tsx ] && [ ! -f ./backup-files/src/components/chat/HikmahChat.tsx ]; then
  cp ./src/components/chat/HikmahChat.tsx ./backup-files/src/components/chat/HikmahChat.tsx
fi

# Rename the page.tsx.backup if it's not already done
if [ -f ./src/app/chat/page.tsx.backup ] && [ ! -f ./backup-files/src/app/chat/page.tsx.original ]; then
  cp ./src/app/chat/page.tsx.backup ./backup-files/src/app/chat/page.tsx.original
fi

echo ""
echo "✅ Legacy files have been backed up."
echo ""
echo "You can now safely delete the following files if all tests pass:"
echo "- src/app/api/chat/route-old.ts (if exists)"
echo "- src/app/api/chat/route.js.backup (if exists)"
echo "- src/components/chat/HikmahChat.tsx (if not needed by other components)"
echo ""
echo "To delete these files, run the following commands:"
echo "rm ./src/app/api/chat/route-old.ts 2>/dev/null || :"
echo "rm ./src/app/api/chat/route.js.backup 2>/dev/null || :"
echo "rm ./src/app/chat/page.tsx.backup 2>/dev/null || :"
echo ""
echo "Consider keeping HikmahChat.tsx until you're certain no other components depend on it."
