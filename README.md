# Label Studio Graph Annotator

A web application that embeds Label Studio Frontend for annotation and displays a live-updating relationship network graph based on annotation results.

## Features

- **Embedded Label Studio**: Full-featured annotation interface for labeling variables and creating relationships
- **Live Network Visualization**: Real-time graph updates using vis-network showing variables (nodes) and their relationships (edges)
- **Relationship Types**: Support for 4 relation types (moderation, direction, correlation, hierarchy)
- **Variable Naming**: Edit variable names that automatically update in the graph
- **Edge Table**: View all relationships in a structured table format
- **API Integration**: Seamless connection to Label Studio backend for task management

## Prerequisites

1. **Label Studio OSS** running locally:
   ```bash
   pip install label-studio
   label-studio start
   ```
   This will start Label Studio at `http://localhost:8080`

2. **Node.js** (v18 or higher) and npm installed

3. **Label Studio Project** with:
   - Tasks containing an `AB` field (abstract text)
   - The labeling configuration provided in this project

## Installation

1. Navigate to the project directory:
   ```bash
   cd label-studio-graph-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file (copy from `.env.example`):
   ```bash
   cp .env.example .env.local
   ```

4. Edit `.env.local` with your configuration:
   ```env
   VITE_LABEL_STUDIO_URL=http://localhost:8080
   VITE_LABEL_STUDIO_TOKEN=your_api_token_here
   VITE_PROJECT_ID=1
   ```

### Getting Your API Token

1. Open Label Studio in your browser: `http://localhost:8080`
2. Go to Account & Settings (click your profile icon)
3. Click on "Access Token" tab
4. Copy your token and paste it into `.env.local`

### Finding Your Project ID

1. In Label Studio, go to your project
2. Look at the URL: `http://localhost:8080/projects/1/data`
3. The number after `/projects/` is your project ID

## Running the Application

Start the development server:
```bash
npm run dev
```

The app will open at `http://localhost:3000`

## Usage

1. **Initial Configuration**:
   - On first launch, you'll see a configuration screen
   - Enter your Label Studio URL, API token, and project ID
   - Click "Connect"

2. **Annotating**:
   - The left panel (70%) shows the Label Studio annotation interface
   - Highlight text to create "Variable" spans
   - Select two variables and create a "Relation" between them
   - Choose relation type: moderation, direction, correlation, or hierarchy
   - Edit variable names in the right sidebar of Label Studio

3. **Graph Visualization** (right panel, 30%):
   - See nodes (variables) and edges (relationships) update in real-time
   - Click a node to see its details
   - View all relationships in the table below the graph
   - Node labels show custom names if defined, otherwise the raw text span

4. **Submitting**:
   - Click "Submit" in Label Studio when done
   - The annotation is saved to Label Studio
   - The app loads the next task automatically

## Project Structure

```
label-studio-graph-app/
├── src/
│   ├── components/
│   │   ├── LabelStudioWrapper.tsx  # LSF embedding component
│   │   ├── GraphPanel.tsx          # Network visualization
│   │   └── GraphPanel.css
│   ├── utils/
│   │   ├── api.ts                  # Label Studio API client
│   │   └── parser.ts               # Annotation result parser
│   ├── types.ts                    # TypeScript type definitions
│   ├── App.tsx                     # Main application
│   ├── App.css
│   ├── main.tsx                    # Entry point
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .env.example
└── README.md
```

## Technical Details

### Label Studio Integration

- Uses `@heartexlabs/label-studio` package for embedding
- Implements both event-based callbacks and polling fallback
- Polling interval: 500ms to detect annotation changes
- Supports all standard LSF interfaces

### Graph Visualization

- Built with **vis-network** for stable, performant rendering
- Physics-enabled layout with Barnes-Hut simulation
- Color-coded edges by relationship type
- Automatic layout adjustment on data changes

### Data Flow

1. LSF updates trigger the `onUpdate` callback
2. Polling fallback checks for changes every 500ms
3. `ResultParser` extracts spans, names, and relations
4. `GraphPanel` renders nodes and edges from parsed data
5. Deep equality check prevents unnecessary re-renders

### Annotation Result Parsing

The parser handles three types of results:

1. **Labels** (type="labels"): Variable spans with text positions
2. **TextArea** (type="textarea"): Custom variable names
3. **Relations** (type="relation"): Connections between variables

Node labels prioritize: Custom name → Raw span text

## Troubleshooting

### "API request failed" error
- Verify Label Studio is running at the specified URL
- Check that your API token is correct
- Ensure the project ID exists

### Graph not updating
- The app uses polling fallback if callbacks fail
- Changes should appear within 500ms
- Check browser console for errors

### No tasks available
- Verify your project has tasks with an `AB` field
- Check that tasks aren't all completed
- Try creating a new task in Label Studio

### LSF not loading
- Clear browser cache and reload
- Check browser console for CSP or CORS errors
- Verify Label Studio version compatibility

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

To preview the production build:
```bash
npm run preview
```

## Limitations & Notes

- **Edge clicking**: Clicking an edge in the table does not focus the relation in LSF (LSF API limitation)
- **Polling fallback**: Used because LSF event callbacks may not work reliably across versions
- **Single task**: Shows one task at a time; use LSF submit button to advance
- **Local storage**: Configuration is not persisted; set via .env.local

## Acceptance Tests

✅ **Test 1**: Application connects to Label Studio
- Start LS, set token and project ID, run app
- Expected: Task loads and AB text displays in LSF

✅ **Test 2**: Create variables and relations
- Highlight two words as Variables
- Create a Relation between them
- Expected: Graph shows two nodes and one edge

✅ **Test 3**: Edit variable names
- In LSF right panel, edit a variable name
- Expected: Graph node label updates immediately

✅ **Test 4**: Submit annotation
- Click Submit in LSF
- Expected: Annotation saved in LS, next task loads

## License

MIT

## Support

For issues related to:
- **Label Studio**: https://github.com/heartexlabs/label-studio
- **vis-network**: https://github.com/visjs/vis-network
- **This app**: Create an issue in the project repository
