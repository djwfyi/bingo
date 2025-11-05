#!/bin/sh
# Download vendor libraries for offline use into vendor/.
# Run from repo root: sh scripts/fetch_vendors.sh

set -eu
VDIR="vendor"
mkdir -p "$VDIR"

echo "Downloading html2canvas 1.4.1..."
if command -v curl >/dev/null 2>&1; then
  curl -L -o "$VDIR/html2canvas.min.js" "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
else
  echo "Please install curl or download html2canvas.min.js to $VDIR manually."
fi

echo "Downloading jsPDF 2.5.1 (UMD)..."
if command -v curl >/dev/null 2>&1; then
  curl -L -o "$VDIR/jspdf.umd.min.js" "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
else
  echo "Please install curl or download jspdf.umd.min.js to $VDIR manually."
fi

echo "Done. Vendor files saved to $VDIR/."
