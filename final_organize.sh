#!/bin/bash

# Files to ALWAYS keep in root
KEEP_FILES="README.md SEED_PROTOCOL_V17_SSP_GEAR.md SEED_PROTOCOL_UNPACKED.md NSPFRNP_REANIMATION_COMPLETE.md IRREDUCIBLE_SHELLS_COMPLETE_REANIMATION_ALL_49_WISHES.md LIVE_WORLDWIDE_DEPLOYMENT_100_PAGE_SELF_PROOF_STORY.md WISH_LOG_RAW_PROMPTS_META_PATTERN_ANALYSIS.md"

# Move CHAIRMAN files
for file in CHAIRMAN*.md; do
  [ -f "$file" ] && [[ ! "$KEEP_FILES" =~ "$file" ]] && mv "$file" features/ 2>/dev/null
done

# Move CATALOG files
for file in CATALOG*.md; do
  [ -f "$file" ] && [[ ! "$KEEP_FILES" =~ "$file" ]] && mv "$file" systems/ 2>/dev/null
done

# Move remaining files to misc (except KEEP_FILES)
for file in *.md; do
  if [ -f "$file" ] && [[ ! "$KEEP_FILES" =~ "$file" ]]; then
    # Check if it's already categorized
    if [[ ! "$file" =~ "README" ]]; then
      mv "$file" misc/ 2>/dev/null
    fi
  fi
done

echo "Final organization complete"
ls -1 *.md 2>/dev/null | wc -l
