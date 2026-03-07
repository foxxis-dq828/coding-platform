# Label Studio Graph Annotator

一个自动化的科研文献标注工具，用于标注变量和关系，并实时显示关系网络图。

**🆕 新特性：一键启动 + 零配置！**

## ✨ Features

- **🚀 一键启动**：自动探测和启动 Label Studio
- **⚙️ 零配置体验**：只需配置一次，永久保存
- **📂 自动导入**：上传 CSV 自动创建项目和导入数据
- **📊 实时可视化**：标注时实时更新关系网络图
- **🔗 多类型关系**：支持 moderation、direction、correlation、hierarchy（各 3 个级别）
- **🏷️ 多种标签**：Variable、Sample、Boundary_Condition、Control
- **👤 用户管理**：每个用户独立项目，数据隔离

## 🚀 快速开始（Quick Start）

### 方式 1：一键启动（推荐）

**Mac / Linux:**
```bash
./start-app.sh
```

**Windows:**
```
双击 start-app.bat
```

脚本会自动：
- ✅ 检测并启动 Label Studio
- ✅ 安装依赖（首次运行）
- ✅ 启动应用并打开浏览器

### 方式 2：手动启动

```bash
# 终端 1：启动 Label Studio
pip install label-studio  # 首次安装
label-studio start

# 终端 2：启动应用
npm install  # 首次安装
npm run dev
```

## 📝 首次配置（只需一次）

浏览器自动打开后：
1. **用户名**：输入你的姓名（如：张三）
2. **API Token**：从 Label Studio 获取
   - 打开 http://localhost:8080
   - 右上角头像 → Account Settings → Access Token → 复制
3. **CSV 文件**：选择你的数据文件（必须包含 **AB** 列）
4. 点击 **"保存并开始使用"**

✅ **应用会自动**：
- 创建项目（名称：`{你的用户名}'s Annotation Project`）
- 配置标注规则
- 导入 CSV 数据
- 跳转到标注界面

🎉 **之后每次只需运行** `./start-app.sh` **即可直接标注！**

---

## 📋 前置要求（Prerequisites）

1. **Python 3.7+** 和 **Label Studio**:
   ```bash
   pip install label-studio
   ```

2. **Node.js** (v18 or higher) 和 npm

3. **CSV 数据文件**，必须包含 `AB` 列（摘要文本）
   ```csv
   AB,Title,Year
   "This study investigates...","Sample Title",2023
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
