#!/bin/bash

echo "=================================="
echo "Get Label Studio Access Token"
echo "=================================="
echo ""

# Get credentials
read -p "Label Studio email: " EMAIL
read -sp "Password: " PASSWORD
echo ""
echo ""

LS_URL="${VITE_LABEL_STUDIO_URL:-http://localhost:8080}"

echo "Logging in to $LS_URL..."
RESPONSE=$(curl -s -X POST "$LS_URL/api/auth/login/" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

echo "$RESPONSE" | python3 -c "
import sys, json

try:
    data = json.loads(sys.stdin.read())

    # Try different possible token field names
    token = None
    if 'access' in data:
        token = data['access']
        token_type = 'access'
    elif 'token' in data:
        token = data['token']
        token_type = 'token'
    elif 'key' in data:
        token = data['key']
        token_type = 'key'
    elif 'access_token' in data:
        token = data['access_token']
        token_type = 'access_token'

    if token:
        print('✅ Successfully logged in!')
        print('')
        print(f'Token type: {token_type}')
        print('Access Token:')
        print('═' * 80)
        print(token)
        print('═' * 80)
        print('')

        # Test the token
        import urllib.request
        req = urllib.request.Request(
            '$LS_URL/api/projects',
            headers={'Authorization': f'Bearer {token}'}
        )
        try:
            with urllib.request.urlopen(req) as response:
                if response.status == 200:
                    print('✅ Token verified - works with API!')
                    print('')
                    print('Update your .env.local with:')
                    print(f'VITE_LABEL_STUDIO_TOKEN={token}')
                    print('')

                    # Save to file
                    with open('.token.txt', 'w') as f:
                        f.write(token)
                    print('Token saved to .token.txt')

                    # Ask to update .env.local
                    update = input('\\nUpdate .env.local automatically? (y/n): ')
                    if update.lower() == 'y':
                        with open('.env.local', 'r') as f:
                            lines = f.readlines()
                        with open('.env.local', 'w') as f:
                            for line in lines:
                                if line.startswith('VITE_LABEL_STUDIO_TOKEN='):
                                    f.write(f'VITE_LABEL_STUDIO_TOKEN={token}\\n')
                                else:
                                    f.write(line)
                        print('✅ .env.local updated!')
                        print('Now restart your app: npm run dev')
        except Exception as e:
            print(f'⚠️  Could not verify token: {e}')
            print('But you can still try using it.')
    else:
        print('❌ Could not find token in response')
        print('Available fields:', list(data.keys()))
        print('Response:', json.dumps(data, indent=2))
except Exception as e:
    print(f'❌ Error: {e}')
    print('Raw response:', sys.stdin.read())
" 2>&1
