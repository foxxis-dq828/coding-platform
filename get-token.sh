#!/bin/bash

echo "=================================="
echo "Label Studio Token Generator"
echo "=================================="
echo ""

# Prompt for credentials
read -p "Enter your Label Studio email: " EMAIL
read -s -p "Enter your password: " PASSWORD
echo ""
echo ""

# Login and get token
echo "Logging in..."
RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

# Try to extract token
TOKEN=$(echo "$RESPONSE" | python3 -c "
import sys, json
try:
    data = json.loads(sys.stdin.read())
    if 'token' in data:
        print(data['token'])
    elif 'key' in data:
        print(data['key'])
    elif 'access_token' in data:
        print(data['access_token'])
    else:
        print('ERROR: Token not found in response')
        print('Response:', json.dumps(data, indent=2), file=sys.stderr)
except Exception as e:
    print(f'ERROR: {e}', file=sys.stderr)
" 2>&1)

if [[ "$TOKEN" == ERROR* ]] || [ -z "$TOKEN" ]; then
    echo "❌ Failed to get token"
    echo "$TOKEN"
    echo ""
    echo "Please try getting the token from the Label Studio UI:"
    echo "1. Go to http://localhost:8080"
    echo "2. Login"
    echo "3. Profile → Account & Settings → Personal Access Token"
    exit 1
fi

# Check if it's a JWT token
if [[ "$TOKEN" == eyJ* ]]; then
    echo "⚠️  Got a JWT token, but we need a Personal Access Token"
    echo "This won't work for API access."
    echo ""
    echo "Please get the Personal Access Token from:"
    echo "  http://localhost:8080 → Account Settings → Personal Access Token"
    exit 1
fi

echo "✅ Successfully retrieved token!"
echo ""
echo "Your Personal Access Token:"
echo "-----------------------------------"
echo "$TOKEN"
echo "-----------------------------------"
echo ""
echo "To use this token:"
echo "1. Copy the token above"
echo "2. Edit .env.local:"
echo "   nano .env.local"
echo "3. Update the line:"
echo "   VITE_LABEL_STUDIO_TOKEN=$TOKEN"
echo "4. Save and restart your app"
echo ""

# Offer to update .env.local automatically
read -p "Would you like to update .env.local automatically? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ -f .env.local ]; then
        # Update existing file
        if grep -q "VITE_LABEL_STUDIO_TOKEN" .env.local; then
            sed -i.bak "s/VITE_LABEL_STUDIO_TOKEN=.*/VITE_LABEL_STUDIO_TOKEN=$TOKEN/" .env.local
            echo "✅ Updated .env.local"
        else
            echo "VITE_LABEL_STUDIO_TOKEN=$TOKEN" >> .env.local
            echo "✅ Added token to .env.local"
        fi
    else
        # Create new file
        cat > .env.local << EOF
VITE_LABEL_STUDIO_URL=http://localhost:8080
VITE_LABEL_STUDIO_TOKEN=$TOKEN
VITE_PROJECT_ID=1
EOF
        echo "✅ Created .env.local"
    fi

    echo ""
    echo "Now restart your app:"
    echo "  npm run dev"
fi
