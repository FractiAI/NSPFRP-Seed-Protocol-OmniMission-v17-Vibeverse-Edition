#!/bin/bash

# Keep these files in root (important core files)
KEEP_IN_ROOT="README.md SEED_PROTOCOL_V17_SSP_GEAR.md SEED_PROTOCOL_UNPACKED.md"

echo "Starting repository organization..."

# Move SNAP files (but check they exist and aren't in KEEP list)
for file in *_SNAP.md *SNAP*.md MAJOR_SNAP*.md MONSTER_SNAP*.md; do
  if [ -f "$file" ] && [[ ! "$KEEP_IN_ROOT" =~ "$file" ]]; then
    mv "$file" snaps/ 2>/dev/null && echo "Moved: $file → snaps/"
  fi
done

# Move LIVE_CAPTURE files
for file in LIVE_CAPTURE*.md; do
  if [ -f "$file" ]; then
    mv "$file" live-captures/ 2>/dev/null && echo "Moved: $file → live-captures/"
  fi
done

# Move SESSION files (but be careful with date patterns)
for file in SESSION*.md *JAN_20*.md *JAN_21*.md *JAN_22*.md *JAN_23*.md *JAN_24*.md *JAN_25*.md; do
  if [ -f "$file" ] && [[ ! "$KEEP_IN_ROOT" =~ "$file" ]]; then
    mv "$file" sessions/ 2>/dev/null && echo "Moved: $file → sessions/"
  fi
done

# Move PROPOSAL files
for file in *PROPOSAL*.md WALMART*.md RTC*.md; do
  if [ -f "$file" ] && [[ ! "$KEEP_IN_ROOT" =~ "$file" ]]; then
    mv "$file" proposals/ 2>/dev/null && echo "Moved: $file → proposals/"
  fi
done

# Move WELLNESS files
for file in *NATE*.md *WELLNESS*.md *HEALING*.md *SHAMAN*.md; do
  if [ -f "$file" ] && [[ ! "$KEEP_IN_ROOT" =~ "$file" ]]; then
    mv "$file" wellness/ 2>/dev/null && echo "Moved: $file → wellness/"
  fi
done

echo "Organization complete. Checking remaining files..."
ls -1 *.md 2>/dev/null | wc -l

# Move more categories
for file in *SYSTEM*.md *COMPLETE*.md *INTEGRATION*.md; do
  if [ -f "$file" ] && [[ ! "$KEEP_IN_ROOT" =~ "$file" ]]; then
    mv "$file" systems/ 2>/dev/null && echo "Moved: $file → systems/"
  fi
done

# Move PROTOCOL files (but keep core seed protocol files)
for file in *PROTOCOL*.md; do
  if [ -f "$file" ] && [[ ! "$file" =~ "SEED_PROTOCOL" ]] && [[ ! "$KEEP_IN_ROOT" =~ "$file" ]]; then
    mv "$file" protocols/ 2>/dev/null && echo "Moved: $file → protocols/"
  fi
done

# Move DISCOVERY files
for file in *DISCOVERY*.md *BREAKTHROUGH*.md *MAJOR_DISCOVERY*.md; do
  if [ -f "$file" ] && [[ ! "$KEEP_IN_ROOT" =~ "$file" ]]; then
    mv "$file" discoveries/ 2>/dev/null && echo "Moved: $file → discoveries/"
  fi
done

# Move GUIDE files
for file in *GUIDE*.md *QUICK_REFERENCE*.md *HOW_TO*.md *REFERENCE*.md; do
  if [ -f "$file" ] && [[ ! "$KEEP_IN_ROOT" =~ "$file" ]]; then
    mv "$file" guides/ 2>/dev/null && echo "Moved: $file → guides/"
  fi
done

# Move ARCHITECTURE files
for file in *ARCHITECTURE*.md; do
  if [ -f "$file" ] && [[ ! "$KEEP_IN_ROOT" =~ "$file" ]]; then
    mv "$file" architectures/ 2>/dev/null && echo "Moved: $file → architectures/"
  fi
done

# Move COMMERCIAL files
for file in *SALES*.md *MARKETING*.md *COMMERCIAL*.md *PRICING*.md *REVENUE*.md; do
  if [ -f "$file" ] && [[ ! "$KEEP_IN_ROOT" =~ "$file" ]]; then
    mv "$file" commercial/ 2>/dev/null && echo "Moved: $file → commercial/"
  fi
done

echo "Phase 2 complete. Checking remaining files..."
ls -1 *.md 2>/dev/null | wc -l

# Move ADVENTURE/TRAVEL files
for file in *ADVENTURE*.md *TRAVEL*.md *ALASKA*.md *5_STAR*.md *BUGATTI*.md; do
  if [ -f "$file" ] && [[ ! "$KEEP_IN_ROOT" =~ "$file" ]]; then
    mv "$file" adventures/ 2>/dev/null && echo "Moved: $file → adventures/"
  fi
done

# Move TECHNICAL files
for file in *API*.md *DEPLOYMENT*.md *TECHNICAL*.md *DOCUMENTATION*.md *TEST*.md; do
  if [ -f "$file" ] && [[ ! "$KEEP_IN_ROOT" =~ "$file" ]]; then
    mv "$file" technical/ 2>/dev/null && echo "Moved: $file → technical/"
  fi
done

# Move STORY files
for file in *STORY*.md *BOOK*.md *NARRATIVE*.md *EPISODE*.md *CHARLIE*.md *COLONEL*.md; do
  if [ -f "$file" ] && [[ ! "$KEEP_IN_ROOT" =~ "$file" ]]; then
    mv "$file" stories/ 2>/dev/null && echo "Moved: $file → stories/"
  fi
done

# Move STATUS/UPDATE files
for file in *STATUS*.md *UPDATE*.md *OPERATIONAL*.md *DEPLOYMENT*.md; do
  if [ -f "$file" ] && [[ ! "$KEEP_IN_ROOT" =~ "$file" ]]; then
    mv "$file" status/ 2>/dev/null && echo "Moved: $file → status/"
  fi
done

echo "Phase 3 complete. Checking remaining files..."
ls -1 *.md 2>/dev/null | wc -l

# Move CONCEPT files (BBHE, VIBE, concepts)
for file in *BBHE*.md *VIBE*.md *CONCEPT*.md *PHILOSOPHY*.md; do
  if [ -f "$file" ] && [[ ! "$KEEP_IN_ROOT" =~ "$file" ]]; then
    mv "$file" concepts/ 2>/dev/null && echo "Moved: $file → concepts/"
  fi
done

# Move FEATURE files
for file in *FEATURE*.md *BUTTON*.md *INTERFACE*.md; do
  if [ -f "$file" ] && [[ ! "$KEEP_IN_ROOT" =~ "$file" ]]; then
    mv "$file" features/ 2>/dev/null && echo "Moved: $file → features/"
  fi
done

# Move EXPERIENCE files
for file in *EXPERIENCE*.md *CAMPUS*.md *MAN_CAVE*.md *WINE_CAVE*.md; do
  if [ -f "$file" ] && [[ ! "$KEEP_IN_ROOT" =~ "$file" ]]; then
    mv "$file" experiences/ 2>/dev/null && echo "Moved: $file → experiences/"
  fi
done

# Move remaining SPIN/CLOUD/BLOCKCHAIN files
for file in *SPIN*.md *CLOUD*.md *BLOCKCHAIN*.md *NODE*.md; do
  if [ -f "$file" ] && [[ ! "$KEEP_IN_ROOT" =~ "$file" ]]; then
    mv "$file" technical/ 2>/dev/null && echo "Moved: $file → technical/"
  fi
done

echo "Phase 4 complete. Checking remaining files..."
ls -1 *.md 2>/dev/null | wc -l

# Final pass - move remaining categorized files
# Move remaining files that don't fit other categories to a misc directory
mkdir -p misc

# Keep only essential files in root
# Files to keep: README.md, SEED_PROTOCOL files, key protocol files
# Everything else goes to appropriate category or misc

echo "Final organization complete."
echo "Files remaining in root:"
ls -1 *.md 2>/dev/null | wc -l
echo ""
echo "Directory structure:"
ls -d */ | head -20
