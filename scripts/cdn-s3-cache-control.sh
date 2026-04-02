#!/usr/bin/env bash
# Apply long-lived Cache-Control on objects behind VITE_BUCKET_CDN_URL (S3 origin).
# Run only after reviewing bucket layout; use DRY_RUN=1 first (default).
#
# Usage:
#   DRY_RUN=0 S3_BUCKET=your-bucket S3_PREFIX=image/ ./scripts/cdn-s3-cache-control.sh
#   DRY_RUN=0 S3_BUCKET=your-bucket S3_PREFIX=video/ ./scripts/cdn-s3-cache-control.sh
#
# Requires: AWS CLI v2, credentials with s3:ListBucket and s3:PutObject (or copy in place).
# If you use CloudFront, prefer a Response Headers Policy or origin Cache-Control; this script
# only updates metadata on S3 objects.

set -euo pipefail

DRY_RUN="${DRY_RUN:-1}"
S3_BUCKET="${S3_BUCKET:-}"
S3_PREFIX="${S3_PREFIX:-}"

if [[ -z "$S3_BUCKET" || -z "$S3_PREFIX" ]]; then
  echo "Set S3_BUCKET and S3_PREFIX (e.g. image/ or video/). Example:" >&2
  echo "  DRY_RUN=0 S3_BUCKET=my-reef-cdn S3_PREFIX=image/ $0" >&2
  exit 1
fi

# Normalize prefix (no leading s3://)
S3_PREFIX="${S3_PREFIX#s3://}"
if [[ "$S3_PREFIX" == */ ]]; then
  :
else
  S3_PREFIX="${S3_PREFIX}/"
fi

SRC="s3://${S3_BUCKET}/${S3_PREFIX}"
CACHE="public, max-age=31536000, immutable"

echo "Bucket path: $SRC"
echo "Cache-Control: $CACHE"
echo "DRY_RUN=$DRY_RUN (set DRY_RUN=0 to run aws s3 cp)"

if [[ "$DRY_RUN" != "0" ]]; then
  echo "Dry run — no changes. Example aws command:" >&2
  echo "  aws s3 cp \"$SRC\" \"$SRC\" --recursive --metadata-directive REPLACE --cache-control \"$CACHE\"" >&2
  exit 0
fi

aws s3 cp "$SRC" "$SRC" --recursive \
  --metadata-directive REPLACE \
  --cache-control "$CACHE"

echo "Done."
