#!/bin/bash

echo "=================================="
echo "Label Studio API Debug Tool"
echo "=================================="
echo ""

# Load .env.local
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | grep -v '^$' | xargs)
    echo "✅ Loaded .env.local"
else
    echo "❌ .env.local not found!"
    exit 1
fi

echo ""
echo "Configuration:"
echo "  URL: $VITE_LABEL_STUDIO_URL"
echo "  Token length: ${#VITE_LABEL_STUDIO_TOKEN} characters"
echo "  Token starts with: ${VITE_LABEL_STUDIO_TOKEN:0:20}..."
echo "  Token ends with: ...${VITE_LABEL_STUDIO_TOKEN: -10}"
echo "  Project ID: $VITE_PROJECT_ID"
echo ""

# Check if token is JWT (wrong type)
if [[ "$VITE_LABEL_STUDIO_TOKEN" == eyJ* ]]; then
    echo "⚠️  WARNING: Your token looks like a JWT token (starts with 'eyJ')"
    echo "   This is WRONG! You need an API token, not a JWT token."
    echo "   Please get the correct token from Account Settings."
    echo ""
fi

# Test 1: Health check
echo "Test 1: Label Studio Health Check"
echo "-----------------------------------"
HEALTH=$(curl -s -w "\n%{http_code}" "$VITE_LABEL_STUDIO_URL/api/health" 2>&1)
HTTP_CODE=$(echo "$HEALTH" | tail -n1)
BODY=$(echo "$HEALTH" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Label Studio is running"
    echo "   Response: $BODY"
else
    echo "❌ Label Studio is not responding properly"
    echo "   HTTP Code: $HTTP_CODE"
    echo "   Please make sure 'label-studio start' is running"
    exit 1
fi
echo ""

# Test 2: Test token with different formats
echo "Test 2: Testing API Token"
echo "-----------------------------------"

# Format 1: Token XXX
echo "Trying format: 'Token XXX'"
RESPONSE=$(curl -s -w "\n%{http_code}" \
    -H "Authorization: Token $VITE_LABEL_STUDIO_TOKEN" \
    "$VITE_LABEL_STUDIO_URL/api/projects" 2>&1)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Token format 'Token XXX' works!"
    TOKEN_FORMAT="Token"
elif [ "$HTTP_CODE" = "401" ]; then
    echo "❌ Unauthorized with 'Token XXX' format"

    # Try Format 2: Bearer XXX
    echo "Trying format: 'Bearer XXX'"
    RESPONSE=$(curl -s -w "\n%{http_code}" \
        -H "Authorization: Bearer $VITE_LABEL_STUDIO_TOKEN" \
        "$VITE_LABEL_STUDIO_URL/api/projects" 2>&1)
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

    if [ "$HTTP_CODE" = "200" ]; then
        echo "✅ Token format 'Bearer XXX' works!"
        TOKEN_FORMAT="Bearer"
    else
        echo "❌ Unauthorized with 'Bearer XXX' format too"
        echo ""
        echo "🔍 Debugging information:"
        echo "   HTTP Code: $HTTP_CODE"
        BODY=$(echo "$RESPONSE" | head -n-1)
        echo "   Response: $BODY"
        echo ""
        echo "🔧 Possible issues:"
        echo "   1. Token is incorrect or expired"
        echo "   2. Token doesn't have proper permissions"
        echo "   3. User account is disabled"
        echo ""
        echo "📝 How to get a fresh token:"
        echo "   1. Open: $VITE_LABEL_STUDIO_URL"
        echo "   2. Login with your credentials"
        echo "   3. Click profile → Account & Settings"
        echo "   4. Find 'Access Token' or 'API Token'"
        echo "   5. Click 'Reset Token' to generate a new one"
        echo "   6. Copy the NEW token and update .env.local"
        exit 1
    fi
else
    echo "❌ Unexpected error (HTTP $HTTP_CODE)"
    exit 1
fi
echo ""

# Test 3: List projects
echo "Test 3: Listing Projects"
echo "-----------------------------------"
RESPONSE=$(curl -s -H "Authorization: $TOKEN_FORMAT $VITE_LABEL_STUDIO_TOKEN" \
    "$VITE_LABEL_STUDIO_URL/api/projects")

echo "$RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if isinstance(data, list):
        print(f'✅ Found {len(data)} project(s)')
        for p in data:
            print(f\"   - ID: {p.get('id')}, Title: {p.get('title', 'Untitled')}\")
    else:
        print('⚠️  Unexpected response format')
        print(json.dumps(data, indent=2))
except json.JSONDecodeError as e:
    print(f'❌ Invalid JSON response: {e}')
    print('Raw response:', sys.stdin.read())
"
echo ""

# Test 4: Check specific project
echo "Test 4: Checking Project $VITE_PROJECT_ID"
echo "-----------------------------------"
RESPONSE=$(curl -s -w "\n%{http_code}" \
    -H "Authorization: $TOKEN_FORMAT $VITE_LABEL_STUDIO_TOKEN" \
    "$VITE_LABEL_STUDIO_URL/api/projects/$VITE_PROJECT_ID" 2>&1)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Project $VITE_PROJECT_ID is accessible"
    echo "$BODY" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print(f\"   Title: {data.get('title', 'N/A')}\")
    print(f\"   Tasks: {data.get('task_number', 0)}\")
except:
    pass
"
elif [ "$HTTP_CODE" = "404" ]; then
    echo "❌ Project $VITE_PROJECT_ID not found"
    echo "   Please check the project ID in Label Studio UI"
else
    echo "❌ Error accessing project (HTTP $HTTP_CODE)"
fi
echo ""

# Test 5: Check tasks
echo "Test 5: Checking Tasks in Project $VITE_PROJECT_ID"
echo "-----------------------------------"
RESPONSE=$(curl -s -H "Authorization: $TOKEN_FORMAT $VITE_LABEL_STUDIO_TOKEN" \
    "$VITE_LABEL_STUDIO_URL/api/projects/$VITE_PROJECT_ID/tasks")

echo "$RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if isinstance(data, list):
        print(f'✅ Found {len(data)} task(s)')
        if len(data) == 0:
            print('   ⚠️  No tasks in this project')
            print('   You need to import tasks in Label Studio UI')
        else:
            for i, t in enumerate(data[:3], 1):
                print(f\"   Task {i}: ID={t.get('id')}\")
    else:
        print('Response:', json.dumps(data, indent=2))
except Exception as e:
    print(f'Error: {e}')
"
echo ""

echo "=================================="
echo "Summary"
echo "=================================="
echo "✅ Token format that works: '$TOKEN_FORMAT XXX'"
echo "✅ Configuration looks good!"
echo ""
echo "If your React app still shows 'Unauthorized':"
echo "1. Make sure you saved .env.local"
echo "2. Restart the React app: Ctrl+C and 'npm run dev'"
echo "3. Clear browser cache and reload"
echo ""
echo "Current token in .env.local:"
echo "$VITE_LABEL_STUDIO_TOKEN"
