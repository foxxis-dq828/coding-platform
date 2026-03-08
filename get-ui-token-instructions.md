# How to Get Your Label Studio Personal Access Token

The token that starts with `eyJ` is a JWT refresh token, **NOT** a Personal Access Token.

Personal Access Tokens are meant for API access and must be generated from the Label Studio UI.

## Steps to Get the Correct Token:

1. **Open Label Studio in your browser:**
   ```
   http://localhost:8080
   ```

2. **Login with your credentials:**
   - Email: xxx@xxxx
   - Password: xxxxxxx

3. **Navigate to Account Settings:**
   - Click on your profile/avatar in the top-right corner
   - Click "Account & Settings"

4. **Find the Access Token section:**
   - Look for "Access Token" or "Personal Access Token" or "API Token"
   - It might be under a "Security" or "API" tab

5. **Generate/Copy the Token:**
   - If no token exists, click "Create Token" or "Generate Token"
   - If a token exists, click "Reset Token" to generate a new one
   - Copy the token - it will look like a long hex string or alphanumeric string
   - **This token will NOT start with "eyJ"**

6. **Update .env.local:**
   ```bash
   nano .env.local
   ```

   Replace the line:
   ```
   VITE_LABEL_STUDIO_TOKEN=<paste-your-new-token-here>
   ```

7. **Restart your app:**
   ```bash
   npm run dev
   ```

## What the Token Should Look Like:

- ❌ WRONG: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (JWT token)
- ✅ CORRECT: Something like `d41d8cd98f00b204e9800998ecf8427e` or `1234567890abcdef1234567890abcdef`

## Can't Find the Token Section?

Different Label Studio versions have different UI layouts. Try:
- Settings → Account → API Token
- Profile → Access Token
- Account Settings → Security → Access Token

If you still can't find it, let me know and we'll try a different approach.
