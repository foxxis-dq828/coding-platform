#!/bin/bash

# Test token refresh
echo "Testing Label Studio token refresh..."
echo "========================================"

# Read refresh token from .env.local
REFRESH_TOKEN=$(grep VITE_LABEL_STUDIO_REFRESH_TOKEN .env.local | cut -d'=' -f2)

if [ -z "$REFRESH_TOKEN" ]; then
    echo "❌ Error: VITE_LABEL_STUDIO_REFRESH_TOKEN not found in .env.local"
    exit 1
fi

echo "Refresh token (first 50 chars): ${REFRESH_TOKEN:0:50}..."
echo ""
echo "Calling: POST http://localhost:8080/api/token/refresh/"
echo ""

RESPONSE=$(curl -sS -X POST "http://localhost:8080/api/token/refresh/" \
  -H "Content-Type: application/json" \
  -d "{\"refresh\":\"$REFRESH_TOKEN\"}" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

echo "HTTP Status: $HTTP_CODE"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Success! Access token received:"
    echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
    echo ""
    echo "Your token is valid! The app should work now."
else
    echo "❌ Failed! Error response:"
    echo "$BODY"
    echo ""
    echo "Possible issues:"
    echo "1. Label Studio is not running on http://localhost:8080"
    echo "2. The refresh token has expired"
    echo "3. The refresh token is invalid"
fi
