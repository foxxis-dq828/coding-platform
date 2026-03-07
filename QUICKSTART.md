# Quick Start Guide

## Step 1: Install Dependencies

```bash
cd "/Users/foxxis/Documents/scientific retelling/code/human coding/label-studio-graph-app"
npm install
```

## Step 2: Configure Environment

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Get your Label Studio API token:
   - Open http://localhost:8080 in your browser
   - Click your profile icon → Account & Settings
   - Go to "Access Token" tab
   - Copy the token

3. Edit `.env.local`:
```env
VITE_LABEL_STUDIO_URL=http://localhost:8080
VITE_LABEL_STUDIO_TOKEN=<paste_your_token_here>
VITE_PROJECT_ID=1
```

## Step 3: Make Sure Label Studio is Running

```bash
# In a separate terminal
label-studio start
```

## Step 4: Run the Application

```bash
npm run dev
```

The app will open at http://localhost:3000

## First Time Usage

1. The configuration screen will appear
2. Enter your Label Studio URL, API token, and project ID
3. Click "Connect"
4. Start annotating!

## Quick Test

1. Highlight two words in the text as "Variable"
2. Click the relation tool and connect them
3. Choose a relation type (e.g., "direction")
4. Watch the graph update in real-time!
5. Edit variable names in the right panel
6. See the graph labels update automatically

## Troubleshooting

**Port 3000 already in use?**
```bash
# Use a different port
npm run dev -- --port 3001
```

**Label Studio not connecting?**
- Verify Label Studio is running: http://localhost:8080
- Check your API token is correct
- Make sure the project ID exists

**Graph not showing?**
- Create at least one variable span
- Create a relation between two variables
- Wait up to 500ms for the graph to update

## Next Steps

- Read the full README.md for detailed documentation
- Check the acceptance tests section
- Explore the code structure in src/
