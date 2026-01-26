#!/bin/bash

# Move SNAP files
for file in *_SNAP.md *SNAP*.md MAJOR_SNAP*.md MONSTER_SNAP*.md; do
  [ -f "$file" ] && mv "$file" snaps/ 2>/dev/null
done

# Move LIVE_CAPTURE files
for file in LIVE_CAPTURE*.md; do
  [ -f "$file" ] && mv "$file" live-captures/ 2>/dev/null
done

# Move SYSTEM files
for file in *SYSTEM*.md *COMPLETE*.md *INTEGRATION*.md; do
  [ -f "$file" ] && mv "$file" systems/ 2>/dev/null
done

# Move PROTOCOL files
for file in *PROTOCOL*.md; do
  [ -f "$file" ] && mv "$file" protocols/ 2>/dev/null
done

# Move SESSION files
for file in SESSION*.md *JAN_*.md *JAN*.md; do
  [ -f "$file" ] && mv "$file" sessions/ 2>/dev/null
done

# Move PROPOSAL files
for file in *PROPOSAL*.md WALMART*.md RTC*.md; do
  [ -f "$file" ] && mv "$file" proposals/ 2>/dev/null
done

# Move DISCOVERY files
for file in *DISCOVERY*.md *BREAKTHROUGH*.md; do
  [ -f "$file" ] && mv "$file" discoveries/ 2>/dev/null
done

# Move GUIDE files
for file in *GUIDE*.md *QUICK_REFERENCE*.md *HOW_TO*.md; do
  [ -f "$file" ] && mv "$file" guides/ 2>/dev/null
done

# Move STATUS files
for file in *STATUS*.md *OPERATIONAL*.md; do
  [ -f "$file" ] && mv "$file" status/ 2>/dev/null
done

# Move ARCHITECTURE files
for file in *ARCHITECTURE*.md; do
  [ -f "$file" ] && mv "$file" architectures/ 2>/dev/null
done

# Move WELLNESS files (Nate, healing, etc.)
for file in *NATE*.md *WELLNESS*.md *HEALING*.md; do
  [ -f "$file" ] && mv "$file" wellness/ 2>/dev/null
done

# Move COMMERCIAL files
for file in *SALES*.md *MARKETING*.md *COMMERCIAL*.md *PRICING*.md; do
  [ -f "$file" ] && mv "$file" commercial/ 2>/dev/null
done

echo "Organization complete"
