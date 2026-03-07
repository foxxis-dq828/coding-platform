#!/bin/bash

echo "=================================="
echo "Quick Token Verification"
echo "=================================="
echo ""

# Check if token is provided as argument, otherwise prompt
if [ -z "$1" ]; then
    read -p "Paste your Personal Access Token: " TOKEN
else
    TOKEN="$1"
fi

echo ""

# Check token format
if [[ "$TOKEN" == eyJ* ]]; then
    echo "❌ ERROR: This looks like a JWT token (starts with 'eyJ')"
    echo "   You need a Personal Access Token from the UI, not a JWT."
    echo "   See get-ui-token-instructions.md for help."
    exit 1
fi

echo "✅ Token format looks correct (not a JWT)"
echo ""

# Test with Token prefix
echo "Testing token with Label Studio API..."
RESPONSE=$(curl -s -w "\n%{http_code}" \
    -H "Authorization: Token $TOKEN" \
    "http://localhost:8080/api/projects" 2>&1)

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ SUCCESS! Token works perfectly!"
    echo ""
    echo "Projects found:"
    echo "$BODY" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if isinstance(data, list):
        for p in data:
            print(f\"  - ID: {p.get('id')}, Title: {p.get('title', 'Untitled')}\")
    else:
        print('  (No projects found)')
except:
    pass
"
    echo ""
    echo "✅ Update your .env.local with:"
    echo "VITE_LABEL_STUDIO_TOKEN=$TOKEN"
    echo ""

    # Offer to update .env.local
    read -p "Update .env.local now? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if [ -f .env.local ]; then
            # Check if line exists
            if grep -q "VITE_LABEL_STUDIO_TOKEN" .env.local; then
                # Update existing line
                sed -i.bak "s/VITE_LABEL_STUDIO_TOKEN=.*/VITE_LABEL_STUDIO_TOKEN=$TOKEN/" .env.local
                echo "✅ Updated .env.local"
            else
                # Add new line
                echo "VITE_LABEL_STUDIO_TOKEN=$TOKEN" >> .env.local
                echo "✅ Added token to .env.local"
            fi
        else
            echo "❌ .env.local not found"
        fi
    fi

elif [ "$HTTP_CODE" = "401" ]; then
    echo "❌ Token is invalid or doesn't have permissions"
    echo "   Response: $BODY"
    echo ""
    echo "Please:"
    echo "1. Go to http://localhost:8080"
    echo "2. Login and go to Account Settings"
    echo "3. Generate a new Personal Access Token"
    echo "4. Run this script again with the new token"
else
    echo "❌ Unexpected error (HTTP $HTTP_CODE)"
    echo "   Response: $BODY"
    echo ""
    echo "Make sure Label Studio is running: label-studio start"
fi
