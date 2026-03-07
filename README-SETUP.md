# Label Studio Graph Annotator - 使用指南

一个自动化的标注工具，用于标注科研文献中的变量和关系，并实时显示关系网络图。

## ✨ 特性

- **零配置体验**：自动探测本地 Label Studio，无需手动配置
- **一次性设置**：用户名和 API token 只需输入一次，自动保存
- **自动项目创建**：上传 CSV 文件后自动创建项目并导入数据
- **实时可视化**：标注时实时更新关系网络图
- **多类型关系**：支持 moderation、direction、correlation、hierarchy 等关系类型
- **多种标签**：Variable、Sample、Boundary_Condition、Control

---

## 📋 使用前准备

### 1. 安装 Label Studio

```bash
pip install label-studio
```

### 2. 准备数据文件

准备一个 **CSV 文件**，必须包含 **AB** 列（摘要文本）。

**示例格式：**
```csv
AB,Title,Year
"This study investigates...","Sample Title 1",2023
"Our research examines...","Sample Title 2",2024
```

> **重要**：CSV 第一行必须是表头，且必须包含 `AB` 列。

---

## 🚀 快速开始

### **方式 1：一键启动（推荐）**

#### Mac / Linux:
```bash
# 1. 下载项目
cd "/Users/foxxis/Documents/scientific retelling/code/human coding/label-studio-graph-app"

# 2. 双击或运行启动脚本
./start-app.sh
```

#### Windows:
```bash
# 双击 start-app.bat
```

**脚本会自动：**
- ✅ 检测并启动 Label Studio
- ✅ 安装依赖（首次运行）
- ✅ 启动应用并打开浏览器

---

### **方式 2：手动启动**

```bash
# 终端 1：启动 Label Studio
label-studio start

# 终端 2：启动应用
cd "/Users/foxxis/Documents/scientific retelling/code/human coding/label-studio-graph-app"
npm install  # 首次运行
npm run dev
```

---

## 📝 首次配置（只需一次）

1. **打开浏览器**，应用会自动打开配置页面

2. **填写配置信息**：
   ```
   👤 用户名：张三
   🔑 API Token：[点击"自动探测"或粘贴 token]
   📁 CSV 文件：选择你的数据文件
   ```

3. **获取 API Token**：
   - 打开 http://localhost:8080
   - 点击右上角头像 → Account Settings
   - 点击 "Access Token" 标签
   - 复制 token 并粘贴

4. **点击"保存并开始使用"**

应用会自动：
- ✅ 创建项目（名称：`{你的用户名}'s Annotation Project`）
- ✅ 配置标注规则
- ✅ 导入 CSV 数据
- ✅ 跳转到标注界面

---

## 🎯 开始标注

### 左侧面板：标注界面

1. **标注变量**：
   - 选中文本中的变量
   - 选择类型：Variable / Sample / Boundary_Condition / Control

2. **创建关系**：
   - 点击关系工具
   - 连接两个变量
   - 选择关系类型：
     - `moderation__validated` / `hypothesized` / `null`
     - `direction__validated` / `hypothesized` / `null`
     - `correlation__validated` / `hypothesized` / `null`
     - `hierarchy`

3. **编辑变量名**：
   - 在标注面板中点击变量
   - 输入自定义名称

### 右侧面板：关系网络图

- **实时更新**：标注变化立即反映在图中
- **节点**：表示变量
- **边**：表示关系，颜色对应关系类型
- **表格**：查看所有关系的详细列表

---

## 🔄 之后每次使用

1. 运行 `./start-app.sh` (或 `start-app.bat`)
2. 浏览器自动打开
3. **直接开始标注**（无需再输入任何信息）

---

## 🛠️ 高级功能

### 导入新数据
- 点击顶部 "重新配置" 按钮
- 上传新的 CSV 文件
- 会创建新项目

### 切换任务
- 使用顶部的 "← Previous" / "Next →" 按钮
- 或输入 Task ID 直接跳转

### 刷新图表
- 点击顶部 "🔄 Refresh" 按钮
- 手动同步 Label Studio 的最新标注

---

## 📁 项目结构

```
label-studio-graph-app/
├── start-app.sh            # Mac/Linux 启动脚本
├── start-app.bat           # Windows 启动脚本
├── src/
│   ├── App.tsx             # 主应用（含自动配置）
│   ├── utils/
│   │   ├── api.ts          # API 客户端（含自动探测）
│   │   └── parser.ts       # 标注结果解析
│   ├── components/
│   │   ├── LabelStudioWrapper.tsx
│   │   └── GraphPanel.tsx
│   └── types.ts            # TypeScript 类型定义
├── package.json
└── README-SETUP.md         # 本文件
```

---

## ❓ 常见问题

### 1. Label Studio 无法启动？
```bash
# 检查是否已安装
label-studio --version

# 手动启动并查看错误
label-studio start
```

### 2. 端口 8080 被占用？
应用会自动探测 8080/8081/8090 端口。如果都被占用：
```bash
# 指定其他端口启动 Label Studio
label-studio start --port 8090
```

### 3. CSV 导入失败？
检查 CSV 格式：
- ✅ 第一行必须是表头
- ✅ 必须包含 `AB` 列
- ✅ 文件编码为 UTF-8

### 4. 图表不更新？
- 点击顶部 "🔄 Refresh" 按钮
- 或等待 500ms 自动更新

### 5. 想要重新配置？
- 点击顶部 "Reconfigure" 按钮
- 或清除浏览器 localStorage

---

## 🎓 标注规范

### 关系类型说明

| 类型 | validated | hypothesized | null |
|------|-----------|--------------|------|
| **moderation** | 已验证的调节效应 | 假设的调节效应 | 无调节效应 |
| **direction** | 已验证的方向性 | 假设的方向性 | 无方向性 |
| **correlation** | 已验证的相关性 | 假设的相关性 | 无相关性 |
| **hierarchy** | 层级关系 | - | - |

### 变量类型说明

- **Variable**: 主要研究变量（IV/DV）
- **Sample**: 样本特征
- **Boundary_Condition**: 边界条件
- **Control**: 控制变量

---

## 📦 打包发布

如需打包为独立应用：

```bash
# 构建生产版本
npm run build

# dist/ 目录即为打包结果
```

发布到 GitHub：
```bash
# 将整个项目上传到 GitHub
# 用户下载后只需：
# 1. 运行 start-app.sh
# 2. 首次配置
# 3. 开始使用
```

---

## 📊 数据说明

- **标注数据存储位置**：用户本地的 Label Studio 数据库
- **配置信息存储**：浏览器 localStorage
- **数据隔离**：每个用户名对应独立的项目

---

## 🤝 技术支持

如有问题，请检查：
1. Label Studio 是否正常运行（http://localhost:8080）
2. 浏览器控制台是否有错误信息
3. CSV 文件格式是否正确

---

## 📄 许可证

MIT License
