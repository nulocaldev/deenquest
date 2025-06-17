# DeenQuest Legacy Code Cleanup Plan

## Overview

This document outlines the plan for safely removing or archiving legacy code that has been replaced by the refactored chat API and components.

## Files to Archive

The following files should be archived rather than deleted to preserve history:

1. **Chat API Routes**
   - `/src/app/api/chat/route-fixed.ts` → Move to `/workspaces/deenquest/backup-files/src/app/api/chat/route-fixed.ts`
   - `/src/app/api/chat/route-broken.ts` → Move to `/workspaces/deenquest/backup-files/src/app/api/chat/route-broken.ts`
   - `/src/app/api/chat/dynamic/route.ts` → Move to `/workspaces/deenquest/backup-files/src/app/api/chat/dynamic/route.ts`

2. **Chat Pages**
   - `/src/app/chat/page-simple.tsx` → Move to `/workspaces/deenquest/backup-files/src/app/chat/page-simple.tsx`
   - `/src/app/chat/page-broken.tsx` → Move to `/workspaces/deenquest/backup-files/src/app/chat/page-broken.tsx`
   - `/src/app/chat/page-fixed.tsx` → Move to `/workspaces/deenquest/backup-files/src/app/chat/page-fixed.tsx`
   - `/src/app/chat/page-dynamic.tsx` → Move to `/workspaces/deenquest/backup-files/src/app/chat/page-dynamic.tsx`
   - `/src/app/chat/page-old.tsx` → Move to `/workspaces/deenquest/backup-files/src/app/chat/page-old.tsx`
   - `/src/app/chat/page-complex.tsx` → Move to `/workspaces/deenquest/backup-files/src/app/chat/page-complex.tsx`

3. **Legacy Library Files**
   - `/src/lib/deepseek.ts` → Move to `/workspaces/deenquest/backup-files/src/lib/deepseek.ts`
   - `/src/lib/conversation-analyzer.ts` → Move to `/workspaces/deenquest/backup-files/src/lib/conversation-analyzer.ts`
   - `/src/lib/content-unlock-engine.ts` → Move to `/workspaces/deenquest/backup-files/src/lib/content-unlock-engine.ts`

## Files to Update

1. **Main Page Files**
   - `/src/app/chat/page.tsx` → Update to use the new `HikmahChat2` component

2. **Documentation**
   - Update README.md to reflect the new architecture

## Cleanup Process

### Step 1: Ensure Tests Pass

Before making any changes, run tests to verify that the new code is functioning correctly:

```bash
npm test
```

### Step 2: Create Backups

Move legacy files to the backup directory:

```bash
# Create backup directories if they don't exist
mkdir -p /workspaces/deenquest/backup-files/src/app/api/chat/dynamic
mkdir -p /workspaces/deenquest/backup-files/src/app/chat
mkdir -p /workspaces/deenquest/backup-files/src/lib

# Move API routes
cp /workspaces/deenquest/src/app/api/chat/route-fixed.ts /workspaces/deenquest/backup-files/src/app/api/chat/
cp /workspaces/deenquest/src/app/api/chat/route-broken.ts /workspaces/deenquest/backup-files/src/app/api/chat/
cp /workspaces/deenquest/src/app/api/chat/dynamic/route.ts /workspaces/deenquest/backup-files/src/app/api/chat/dynamic/

# Move chat pages
cp /workspaces/deenquest/src/app/chat/page-simple.tsx /workspaces/deenquest/backup-files/src/app/chat/
cp /workspaces/deenquest/src/app/chat/page-broken.tsx /workspaces/deenquest/backup-files/src/app/chat/
cp /workspaces/deenquest/src/app/chat/page-fixed.tsx /workspaces/deenquest/backup-files/src/app/chat/
cp /workspaces/deenquest/src/app/chat/page-dynamic.tsx /workspaces/deenquest/backup-files/src/app/chat/
cp /workspaces/deenquest/src/app/chat/page-old.tsx /workspaces/deenquest/backup-files/src/app/chat/
cp /workspaces/deenquest/src/app/chat/page-complex.tsx /workspaces/deenquest/backup-files/src/app/chat/

# Move library files
cp /workspaces/deenquest/src/lib/deepseek.ts /workspaces/deenquest/backup-files/src/lib/
cp /workspaces/deenquest/src/lib/conversation-analyzer.ts /workspaces/deenquest/backup-files/src/lib/
cp /workspaces/deenquest/src/lib/content-unlock-engine.ts /workspaces/deenquest/backup-files/src/lib/
```

### Step 3: Update Main Chat Page

Update the main chat page to use the new component:

1. Edit `/src/app/chat/page.tsx` to use `HikmahChat2`

### Step 4: Test After Changes

After making changes, test to ensure everything still works:

```bash
npm run dev
```

### Step 5: Clean Up (Only After Verification)

Once everything is verified to be working correctly, you can safely remove the original files:

```bash
# Remove API routes
rm /workspaces/deenquest/src/app/api/chat/route-fixed.ts
rm /workspaces/deenquest/src/app/api/chat/route-broken.ts
rm -r /workspaces/deenquest/src/app/api/chat/dynamic

# Remove chat pages
rm /workspaces/deenquest/src/app/chat/page-simple.tsx
rm /workspaces/deenquest/src/app/chat/page-broken.tsx
rm /workspaces/deenquest/src/app/chat/page-fixed.tsx
rm /workspaces/deenquest/src/app/chat/page-dynamic.tsx
rm /workspaces/deenquest/src/app/chat/page-old.tsx
rm /workspaces/deenquest/src/app/chat/page-complex.tsx

# Keep library files for now until all dependencies are migrated
# rm /workspaces/deenquest/src/lib/deepseek.ts
# rm /workspaces/deenquest/src/lib/conversation-analyzer.ts
# rm /workspaces/deenquest/src/lib/content-unlock-engine.ts
```

## Final Verification

After cleanup, run the application and verify that all chat functionality works correctly. Pay special attention to:

1. Basic chat interaction
2. Suggestions functionality
3. Content unlocking
4. Error handling
5. Backward compatibility

## Rollback Plan

If issues are encountered, restore the backed-up files from the `/workspaces/deenquest/backup-files/` directory.
