#!/bin/bash

echo "=================================="
echo "Exchange Refresh Token for Access Token"
echo "=================================="
echo ""

# Load .env.local
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | grep -v '^$' | xargs)
else
    echo "❌ .env.local not found!"
    exit 1
fi

echo "Current token (first 50 chars): ${VITE_LABEL_STUDIO_TOKEN:0:50}..."
echo ""

# Try to exchange refresh token for access token
echo "Attempting to exchange refresh token for access token..."
RESPONSE=$(curl -s -X POST "$VITE_LABEL_STUDIO_URL/api/auth/token/refresh/" \
  -H "Content-Type: application/json" \
  -d "{\"refresh\":\"$VITE_LABEL_STUDIO_TOKEN\"}")

echo "Response:"
echo "$RESPONSE" | python3 -c "
import sys, json
try:
    data = json.loads(sys.stdin.read())
    if 'access' in data:
        print('✅ Successfully got access token!')
        print('')
        print('Access Token:')
        print('═' * 60)
        print(data['access'])
        print('═' * 60)
        print('')
        print('This is your API token. Update .env.local with:')
        print(f\"VITE_LABEL_STUDIO_TOKEN={data['access']}\")

        # Save to file for easy copying
        with open('.token.txt', 'w') as f:
            f.write(data['access'])
        print('')
        print('Token saved to .token.txt')
    else:
        print('❌ No access token in response')
        print('Response:', json.dumps(data, indent=2))
except Exception as e:
    print(f'❌ Error: {e}')
    print('Raw response:', sys.stdin.read())
"
