# Label Studio Graph Annotator

一个自动化的科研文献标注工具，用于标注变量和关系，并实时显示关系网络图。

**🆕 新特性：一键启动 + JWT Token 自动激活！**

---

## 📖 快速导航

### 🚀 首次使用？按顺序阅读：
1. **[第一步：打开终端](#第一步打开终端terminal)** - 学习如何打开命令行
2. **[第二步：进入项目文件夹](#第二步进入项目文件夹)** - 导航到正确位置
3. **[第三步：安装必需软件](#第三步检查并安装必需软件)** - Python、Node.js、Label Studio
4. **[第四步：一键启动](#第四步一键启动应用推荐)** - 运行启动脚本
5. **[第五步：首次配置](#第五步首次配置只需配置一次)** - 获取 Token、导入数据
6. **[第六步：开始标注](#第六步开始标注使用说明)** - 学习如何使用

### 🔄 已经配置过？
直接跳到：**[日常使用流程](#日常使用流程第二次及以后)** - 只需 3 步快速启动

### ⚠️ 遇到问题？
查看：**[常见问题与解决方案](#常见问题与解决方案故障排查)** - 12 个常见问题的解决方法

---

## ⚡ TL;DR（快速开始 - 有经验用户）

```bash
# 1. 进入项目目录
cd "/Users/foxxis/Documents/scientific retelling/code/human coding/label-studio-graph-app"

# 2. 安装依赖（首次）
pip3 install label-studio
npm install

# 3. 一键启动
./start-app.sh

# 4. 在浏览器配置界面：
#    - 从 http://localhost:8080 获取 JWT token（以 eyJ 开头）
#    - 输入用户名 + 选择 CSV 文件（需包含 AB 列）
#    - 保存配置，开始标注！
```

**就这么简单！** 后续只需运行 `./start-app.sh` 即可。

---

## ✨ 主要功能

- **🚀 一键启动**：自动探测和启动 Label Studio
- **🔐 JWT 自动激活**：输入 token 自动获取访问权限（无需手动调用 API）
- **⚙️ 零配置体验**：只需配置一次，永久保存在本地
- **📂 自动导入**：上传 CSV 自动创建项目和导入数据
- **📊 实时可视化**：标注时实时更新关系网络图（延迟 < 500ms）
- **🔗 多类型关系**：支持 moderation、direction、correlation、hierarchy（各 3 个级别）
- **🏷️ 多种标签**：Variable、Sample、Boundary_Condition、Control
- **👤 用户管理**：每个用户独立项目，数据隔离

---

## 📚 完整使用教程（零基础）

### 第一步：打开终端（Terminal）

#### Mac 用户：
1. 按下键盘快捷键：`Command (⌘) + 空格键`
2. 输入 `Terminal` 或 `终端`
3. 按 `回车键` 打开

**或者**：在 Finder 中找到 `应用程序` → `实用工具` → `终端`

#### Windows 用户：
1. 按下键盘快捷键：`Windows 键 + R`
2. 输入 `cmd` 或 `powershell`
3. 按 `回车键` 打开

**或者**：在开始菜单搜索 `命令提示符` 或 `PowerShell`

---

### 第二步：进入项目文件夹

在终端中输入以下命令，然后按回车：

```bash
cd "/Users/foxxis/Documents/scientific retelling/code/human coding/label-studio-graph-app"
```

**💡 提示**：
- 注意整个路径要用**引号**包起来（因为路径中有空格）
- 可以直接**复制粘贴**上面的命令
- Mac 可以用 `Command + V` 粘贴，Windows 用 `Ctrl + V` 或右键粘贴

**验证是否成功**：输入 `pwd`（Mac/Linux）或 `cd`（Windows）查看当前目录，应该显示项目路径。

---

### 第三步：检查并安装必需软件

#### 3.1 检查 Python 是否已安装

在终端输入：
```bash
python3 --version
```

**如果显示版本号**（如 `Python 3.9.6`）：✅ Python 已安装，跳到 3.2

**如果显示 "command not found" 或错误**：

**Mac 用户安装 Python：**
```bash
# 使用 Homebrew 安装（推荐）
# 如果没有 Homebrew，先安装：
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 然后安装 Python：
brew install python3
```

**Windows 用户安装 Python：**
1. 访问 https://www.python.org/downloads/
2. 下载最新版本的 Python 安装包
3. 运行安装程序，**务必勾选 "Add Python to PATH"**
4. 重新打开终端，再次检查

#### 3.2 检查 Node.js 是否已安装

在终端输入：
```bash
node --version
```

**如果显示版本号**（如 `v18.17.0`）：✅ Node.js 已安装，跳到 3.3

**如果显示 "command not found" 或错误**：

**Mac 用户安装 Node.js：**
```bash
# 使用 Homebrew 安装
brew install node
```

**Windows 用户安装 Node.js：**
1. 访问 https://nodejs.org/
2. 下载 LTS（长期支持）版本
3. 运行安装程序，使用默认设置
4. 重新打开终端，再次检查

**或者所有系统都可以使用**：直接从 https://nodejs.org/ 下载安装包

#### 3.3 安装 Label Studio

在终端输入：
```bash
pip3 install label-studio
```

**如果遇到权限错误**（Mac/Linux），尝试：
```bash
pip3 install --user label-studio
```

**验证安装成功**：
```bash
label-studio --version
```

应该显示版本号（如 `1.22.0`）

#### 3.4 安装项目依赖（Node.js 包）

在终端输入（确保你在项目文件夹内）：
```bash
npm install
```

这个命令会自动下载所有需要的 JavaScript 库（可能需要几分钟）。

**如果遇到错误**：
- 确保你在正确的文件夹内（使用 `pwd` 或 `cd` 检查）
- 确保 Node.js 已正确安装
- 尝试删除 `node_modules` 文件夹后重新运行

---

### 第四步：一键启动应用（推荐）

#### Mac / Linux 用户：

在终端输入：
```bash
./start-app.sh
```

**如果显示 "Permission denied"（权限不足）**，先运行：
```bash
chmod +x start-app.sh
./start-app.sh
```

#### Windows 用户：

在终端输入：
```bash
start-app.bat
```

**或者**：直接双击项目文件夹中的 `start-app.bat` 文件

---

### 启动脚本会自动执行以下操作：

1. ✅ **检测 Label Studio**：
   - 如果已运行，直接使用
   - 如果未运行，自动启动（端口 8080）

2. ✅ **检测 npm 依赖**：
   - 如果 `node_modules` 不存在，自动运行 `npm install`

3. ✅ **启动应用**：
   - 启动开发服务器
   - 自动打开浏览器到 http://localhost:3000

4. ✅ **打开 Label Studio**：
   - 同时打开 http://localhost:8080 让你获取 token

**💡 看到什么说明成功了？**
- 终端显示：`✓ Local: http://localhost:3000/`
- 浏览器自动打开两个标签页
- 一个显示配置界面，一个显示 Label Studio

---

### 故障排查（如果启动失败）

#### 问题 1：提示 "label-studio: command not found"

**解决方法**：
```bash
# 安装 Label Studio
pip3 install label-studio

# 如果还是不行，尝试：
python3 -m pip install label-studio
```

#### 问题 2：提示 "npm: command not found"

**解决方法**：Node.js 未正确安装，请回到 **第三步 3.2** 重新安装 Node.js

#### 问题 3：端口 8080 或 3000 已被占用

**解决方法**：
```bash
# 查找占用端口的进程（Mac/Linux）
lsof -ti:8080 | xargs kill -9
lsof -ti:3000 | xargs kill -9

# Windows 用户
netstat -ano | findstr :8080
taskkill /PID <进程ID> /F
```

#### 问题 4：浏览器没有自动打开

**解决方法**：手动打开浏览器，访问：
- 应用界面：http://localhost:3000
- Label Studio：http://localhost:8080

---

### 🎯 方式 2：手动分步启动（如果一键启动失败）

如果自动脚本不工作，可以手动分步启动：

#### 步骤 A：启动 Label Studio

**打开第一个终端窗口**，输入：
```bash
cd "/Users/foxxis/Documents/scientific retelling/code/human coding/label-studio-graph-app"
label-studio start
```

**保持这个终端窗口运行**（不要关闭）

看到这样的输出说明成功：
```
Label Studio is running at http://localhost:8080
```

#### 步骤 B：启动应用

**打开第二个新的终端窗口**（不要关闭第一个），输入：
```bash
cd "/Users/foxxis/Documents/scientific retelling/code/human coding/label-studio-graph-app"
npm run dev
```

**保持这个终端窗口也运行**

看到这样的输出说明成功：
```
  ➜  Local:   http://localhost:3000/
```

#### 步骤 C：打开浏览器

手动打开浏览器，访问：http://localhost:3000

---

## 📝 第五步：首次配置（只需配置一次）

应用启动后，浏览器会自动打开配置界面。按照以下步骤完成配置：

### 5.1 获取 JWT Activation Token

这是**最重要的一步**！

#### 详细步骤：

1. **打开 Label Studio**（如果没有自动打开）：
   - 在浏览器新标签页输入：http://localhost:8080
   - 按回车

2. **注册/登录账户**：

   **第一次使用**：
   - 点击 **"Sign Up"（注册）**
   - 输入邮箱和密码
   - 点击创建账户

   **已有账户**：
   - 输入邮箱和密码
   - 点击 **"Sign In"（登录）**

3. **进入账户设置**：
   - 点击页面**右上角**的头像或用户名
   - 在下拉菜单中点击 **"Account & Settings"（账户设置）**

4. **找到 Access Token 区域**：
   - 在设置页面中，找到 **"Access Token"** 或 **"API Token"** 标签
   - 可能在侧边栏或顶部导航中

5. **复制 Token**：
   - 你会看到一个长长的字符串，以 **`eyJ`** 开头
   - 点击 **"Copy"（复制）** 按钮，或者手动选中整个 token 并复制
   - **⚠️ 重要**：确保复制完整，token 通常很长（几百个字符）

   **Token 示例（不要用这个，要用你自己的）**：
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6ODA3OTk5MzEyMywiaWF0IjoxNzcyNzkzMTIzLCJqdGkiOiI2MzE5YjRiOTIyOWI0Y2QyYjdhMTdhYTk1YTVhMjY0OCIsInVzZXJfaWQiOiIxIn0.w6DIwJ_XghNTs3fh0r_4JmpkPss76HC-2OFOfYp0dRA
   ```

6. **如果没有 Token 或需要新的**：
   - 点击 **"Reset Token"（重置 Token）** 按钮
   - 会生成一个新的 Token
   - 复制新生成的 Token

### 5.2 准备 CSV 数据文件

你需要一个包含标注数据的 CSV 文件。

**CSV 文件格式要求**：
- ✅ **必须**有一列名为 `AB`（包含要标注的文本）
- ✅ 第一行必须是**列名**（表头）
- ✅ 可以有其他列（Title、Year 等），但 `AB` 列是必需的

**示例 CSV 文件内容**：
```csv
AB,Title,Year
"This study investigates the relationship between sleep and cognitive performance.","Sleep Study",2023
"We found a significant correlation between exercise frequency and mental health.","Exercise Research",2024
```

**如何创建 CSV 文件**：
- 使用 Excel：另存为 → 选择 "CSV UTF-8 (逗号分隔)"
- 使用 Google Sheets：文件 → 下载 → 逗号分隔值 (.csv)
- 使用文本编辑器：直接按上面格式编写，保存为 `.csv` 文件

### 5.3 在应用中填写配置

回到应用的配置界面（http://localhost:3000），填写以下信息：

#### 字段 1：Label Studio 地址
```
http://localhost:8080
```
（通常已自动填写，无需修改）

**如果自动探测失败**，点击 **"自动探测"** 按钮

#### 字段 2：用户名
```
输入你的姓名
```
例如：`张三`、`李四`

**用途**：用于标识你创建的项目，方便多人协作时区分

#### 字段 3：JWT Activation Token (Refresh Token)
```
粘贴刚才从 Label Studio 复制的 Token
```
- 右键点击输入框 → **粘贴**
- 或使用快捷键：Mac `Command + V`，Windows `Ctrl + V`
- **确保 Token 以 `eyJ` 开头**

#### 字段 4：标注数据文件 (CSV)
- 点击 **"选择文件"** 或 **"浏览"**
- 找到你的 CSV 文件
- 选中并打开

### 5.4 保存配置并启动

1. 检查所有信息是否填写正确
2. 点击页面底部的 **"保存并开始使用"** 按钮
3. 等待几秒钟（应用正在后台操作）

**应用会自动完成以下操作**：
- ✅ 使用 JWT Token 获取 Access Token（自动激活）
- ✅ 在 Label Studio 中创建新项目
- ✅ 项目命名为：`{你的用户名}'s Annotation Project`
- ✅ 配置标注规则（变量类型、关系类型等）
- ✅ 导入你的 CSV 数据到项目
- ✅ 保存配置到本地（下次启动自动加载）
- ✅ 跳转到标注界面

**成功标志**：
- 看到弹窗：`设置完成！项目 ID: X，导入任务数: Y`
- 界面切换到标注页面
- 左侧显示第一条标注任务
- 右侧显示空白的关系图

🎉 **恭喜！配置完成！之后每次只需运行 `./start-app.sh` 即可直接开始标注！**

---

## 📋 系统要求总结

运行本应用需要以下软件（前面步骤已详细说明如何安装）：

### 必需软件：

1. **Python 3.7 或更高版本**
   - 检查命令：`python3 --version`
   - 安装方法：见上方第三步

2. **Label Studio**
   - 安装命令：`pip3 install label-studio`
   - 检查命令：`label-studio --version`

3. **Node.js (v18 或更高) 和 npm**
   - 检查命令：`node --version` 和 `npm --version`
   - 下载地址：https://nodejs.org/

4. **CSV 数据文件**
   - 必须包含 `AB` 列（摘要文本）
   - UTF-8 编码

### 可选工具：

- **Git**（如果要克隆或更新代码）
- **文本编辑器**（VS Code、Sublime Text 等，用于查看/修改配置）

---

## 🎨 第六步：开始标注（使用说明）

配置完成后，你会看到主标注界面，分为左右两个面板。

### 界面布局：

```
┌─────────────────────────────────────┬──────────────────┐
│                                     │                  │
│     Label Studio 标注界面            │   关系图可视化    │
│     (左侧，70%)                      │   (右侧，30%)    │
│                                     │                  │
│  - 显示摘要文本                      │  - 实时显示节点   │
│  - 标注变量和关系                    │  - 显示关系连线   │
│  - 编辑变量名                        │  - 关系列表      │
│                                     │                  │
└─────────────────────────────────────┴──────────────────┘
```

### 6.1 标注变量（创建节点）

#### 操作步骤：

1. **阅读文本**：左侧面板显示一段摘要文本（来自你的 CSV 文件的 AB 列）

2. **选择标注工具**：
   - 确保左侧工具栏中 **"Labels"（标签）** 工具被选中
   - 你会看到 4 种变量类型：
     - 🟠 **Variable**（变量）- 研究中的主要变量
     - 🔵 **Sample**（样本）- 研究对象/样本
     - 🟢 **Boundary_Condition**（边界条件）- 限定条件
     - 🔴 **Control**（控制变量）- 控制因素

3. **高亮标注**：
   - 用鼠标**选中**文本中的一个词或短语
   - 松开鼠标后会弹出工具提示
   - 点击选择变量类型（通常选 **Variable**）
   - 被选中的文本会被高亮显示，带颜色标记

4. **重复操作**：
   - 继续标注其他变量
   - 一段文本可以标注多个变量

**💡 示例**：

假设文本是：
> "This study examines the **relationship** between **sleep duration** and **cognitive performance** in **college students**."

你可以标注：
- "sleep duration" → Variable（变量）
- "cognitive performance" → Variable（变量）
- "college students" → Sample（样本）

### 6.2 编辑变量名（自定义节点标签）

标注变量后，你可以给每个变量起一个简短的名字。

#### 操作步骤：

1. **找到变量列表**：
   - 在 Label Studio 界面的**右侧边栏**或**下方面板**
   - 会列出所有已标注的变量

2. **编辑名字**：
   - 找到 **"var_name"（变量名）** 输入框
   - 输入一个简短、易懂的名字
   - 例如：
     - "sleep duration" → 输入 `睡眠时长` 或 `Sleep`
     - "cognitive performance" → 输入 `认知表现` 或 `Cognition`

3. **实时更新**：
   - 输入名字后，右侧关系图中的节点标签会**立即更新**
   - 如果不输入名字，节点会显示原始文本

**💡 提示**：变量名建议使用**简短的关键词**，这样在关系图中更清晰。

### 6.3 创建关系（连接节点）

标注至少 2 个变量后，就可以创建它们之间的关系。

#### 操作步骤：

1. **选择关系工具**：
   - 点击左侧工具栏中的 **"Relations"（关系）** 工具
   - 或者鼠标悬停在一个变量上，会出现连接图标

2. **连接两个变量**：
   - 点击**第一个变量**（起点）
   - 拖动鼠标到**第二个变量**（终点）
   - 释放鼠标

3. **选择关系类型**：
   - 松开鼠标后会弹出关系类型列表
   - 选择一个关系类型：

   **关系类型说明**：

   | 类型 | 说明 | 示例 |
   |------|------|------|
   | **moderation__validated** 🟡 | 已验证的调节作用 | A 调节 B 对 C 的影响（已证实） |
   | **moderation__hypothesized** 🟡 | 假设的调节作用 | A 可能调节 B 对 C 的影响（假设） |
   | **moderation__null** 🟡 | 无调节作用 | A 不调节 B 对 C 的影响 |
   | **direction__validated** 🔵 | 已验证的方向关系 | A 导致 B（已证实） |
   | **direction__hypothesized** 🔵 | 假设的方向关系 | A 可能导致 B（假设） |
   | **direction__null** 🟢 | 无方向关系 | A 和 B 无因果关系 |
   | **correlation__validated** 🟢 | 已验证的相关关系 | A 和 B 相关（已证实） |
   | **correlation__hypothesized** 🟢 | 假设的相关关系 | A 和 B 可能相关（假设） |
   | **correlation__null** 🟢 | 无相关关系 | A 和 B 不相关 |
   | **hierarchy** 🟣 | 层级关系 | A 是 B 的上层概念 |

4. **查看关系**：
   - 创建关系后，右侧关系图会立即显示一条**连线**
   - 连线的颜色对应关系类型
   - 下方的**关系列表**会显示所有关系的详细信息

### 6.4 实时查看关系图

右侧面板会实时显示你标注的变量和关系。

**图中元素**：
- **🔵 节点（圆圈）**：代表变量
  - 节点标签显示变量名（如果有）或原始文本
- **→ 连线（箭头）**：代表关系
  - 颜色表示关系类型
  - 箭头表示方向（从起点到终点）

**图下方的关系表格**：
- **From**：起点变量
- **To**：终点变量
- **Type**：关系类型

**交互操作**：
- 🖱️ **拖动节点**：改变节点位置
- 🔍 **滚轮缩放**：放大/缩小图形
- 👆 **点击节点**：高亮该节点

### 6.5 提交标注

完成一条任务的标注后：

1. **检查标注**：
   - 确认所有变量都已标注
   - 确认关系都已创建
   - 检查变量名是否清晰

2. **提交**：
   - 点击 Label Studio 界面中的 **"Submit"（提交）** 按钮
   - 通常在左下角或顶部工具栏

3. **自动加载下一条**：
   - 提交后，应用会自动加载下一条任务
   - 关系图会清空，准备标注新任务

4. **导航任务**：
   - 使用顶部的 **"Previous"（上一条）** 和 **"Next"（下一条）** 按钮
   - 或输入任务 ID，点击 **"Go"** 跳转
   - 使用 **"Refresh"（刷新）** 按钮重新加载当前任务

### 6.6 保存进度

- ✅ 标注会**自动保存**到 Label Studio
- ✅ 关闭浏览器后，下次打开会**自动恢复**到上次的任务
- ✅ 配置信息已保存，下次启动无需重新配置

---

## 🔄 日常使用流程（第二次及以后）

完成首次配置后，以后每次使用只需要 3 步：

### 1. 打开终端
```bash
# Mac/Linux 快捷键：Command + 空格 → 输入 Terminal
# Windows 快捷键：Win + R → 输入 cmd
```

### 2. 进入项目文件夹
```bash
cd "/Users/foxxis/Documents/scientific retelling/code/human coding/label-studio-graph-app"
```

### 3. 运行启动脚本
```bash
./start-app.sh
```

✅ **就这么简单！** 浏览器会自动打开，直接显示标注界面，继续上次的进度。

---

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

## ⚠️ 常见问题与解决方案（故障排查）

### 问题 1：Token 无效或被拒绝

**错误提示**：
```
❌ Token is blacklisted
❌ 401 Unauthorized
❌ API request failed
```

**原因**：JWT token 已过期或失效

**解决方法**：
1. 打开 Label Studio：http://localhost:8080
2. 登录账户
3. 进入 Account Settings
4. 点击 **"Reset Token"** 生成新 token
5. 复制新 token
6. 在应用中点击 **"Reconfigure"（重新配置）** 按钮
7. 粘贴新 token 并保存

**测试 token 是否有效**：
```bash
cd "/Users/foxxis/Documents/scientific retelling/code/human coding/label-studio-graph-app"
./test-jwt-activation.sh
```

### 问题 2：Label Studio 启动失败

**错误提示**：
```
label-studio: command not found
```

**解决方法**：
```bash
# 方法 1：使用 pip3 安装
pip3 install label-studio

# 方法 2：使用 python3 -m pip 安装
python3 -m pip install label-studio

# 方法 3：使用用户权限安装
pip3 install --user label-studio

# 验证安装
label-studio --version
```

**如果还是不行**：
- 检查 Python 是否正确安装：`python3 --version`
- 检查 pip 是否正确安装：`pip3 --version`
- 重启终端后再试

### 问题 3：端口被占用

**错误提示**：
```
Error: Port 8080 is already in use
Error: Port 3000 is already in use
```

**解决方法（Mac/Linux）**：
```bash
# 查找并关闭占用端口 8080 的进程
lsof -ti:8080 | xargs kill -9

# 查找并关闭占用端口 3000 的进程
lsof -ti:3000 | xargs kill -9

# 然后重新启动
./start-app.sh
```

**解决方法（Windows）**：
```bash
# 查找占用端口的进程
netstat -ano | findstr :8080
netstat -ano | findstr :3000

# 记下最后一列的 PID（进程ID），然后关闭
taskkill /PID <进程ID> /F

# 例如：taskkill /PID 12345 /F
```

### 问题 4：npm install 失败

**错误提示**：
```
npm ERR! code EACCES
npm ERR! permission denied
```

**解决方法**：
```bash
# 清理 npm 缓存
npm cache clean --force

# 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

**如果是权限问题（Mac/Linux）**：
```bash
# 修改 npm 全局目录权限
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

### 问题 5：浏览器没有自动打开

**解决方法**：
手动在浏览器中打开以下地址：
- 应用界面：http://localhost:3000
- Label Studio：http://localhost:8080

### 问题 6：关系图不更新

**症状**：标注了变量和关系，但右侧图形不显示

**解决方法**：
1. 点击顶部的 **"🔄 Refresh"（刷新）** 按钮
2. 等待 1-2 秒（图形有轮询机制，延迟最多 500ms）
3. 检查是否至少标注了 2 个变量和 1 个关系
4. 按 `F12` 打开浏览器开发者工具，查看 Console 面板是否有错误

### 问题 7：CSV 导入失败

**错误提示**：
```
❌ CSV 文件中未找到 AB 列
❌ 设置失败: Invalid CSV format
```

**解决方法**：
1. **检查 CSV 格式**：
   - 打开 CSV 文件，确认第一行包含 `AB` 列名
   - 列名必须**完全匹配**（大小写敏感）

2. **修复 CSV 文件**：
   ```csv
   AB,Title,Year
   "摘要文本内容","文章标题",2023
   "另一段摘要","另一篇文章",2024
   ```

3. **检查编码**：
   - CSV 文件应使用 **UTF-8** 编码
   - Excel 保存时选择："CSV UTF-8（逗号分隔）"

### 问题 8：无法找到任务

**错误提示**：
```
No tasks available
Loading task... (一直加载)
```

**解决方法**：
1. **检查项目中是否有任务**：
   - 打开 http://localhost:8080
   - 进入你的项目
   - 查看是否有任务列表

2. **重新导入数据**：
   - 点击应用中的 **"Reconfigure"**
   - 重新选择 CSV 文件
   - 保存配置

3. **检查项目 ID**：
   - 在 Label Studio 中查看项目 URL
   - URL 格式：`http://localhost:8080/projects/1/data`
   - 数字 `1` 就是项目 ID

### 问题 9：配置丢失

**症状**：每次启动都要重新配置

**原因**：浏览器清除了 localStorage

**解决方法**：
1. 配置后不要清除浏览器缓存和 Cookie
2. 或者手动创建 `.env.local` 文件（高级）：
   ```bash
   cd "/Users/foxxis/Documents/scientific retelling/code/human coding/label-studio-graph-app"
   nano .env.local
   ```

   填写内容（使用你的实际值）：
   ```env
   VITE_LABEL_STUDIO_URL=http://localhost:8080
   VITE_LABEL_STUDIO_TOKEN=
   VITE_LABEL_STUDIO_REFRESH_TOKEN=你的JWT_token
   VITE_PROJECT_ID=1
   ```

   保存：按 `Ctrl + X`，然后 `Y`，再按回车

### 问题 10：Python/Node.js 版本太旧

**错误提示**：
```
Python version 3.6 is not supported
Node version 14 is too old
```

**解决方法**：
```bash
# 更新 Python（Mac 使用 Homebrew）
brew upgrade python3

# 更新 Node.js（Mac 使用 Homebrew）
brew upgrade node

# 或者从官网下载最新版本安装
# Python: https://www.python.org/downloads/
# Node.js: https://nodejs.org/
```

### 问题 11：权限不足（Mac/Linux）

**错误提示**：
```
Permission denied: ./start-app.sh
```

**解决方法**：
```bash
# 给脚本添加执行权限
chmod +x start-app.sh
chmod +x test-jwt-activation.sh

# 然后运行
./start-app.sh
```

### 问题 12：中文乱码

**症状**：CSV 中的中文显示为乱码

**解决方法**：
1. **Excel 用户**：
   - 另存为 → 选择 **"CSV UTF-8（逗号分隔）"**
   - 不要选择普通的 "CSV（逗号分隔）"

2. **已有 CSV 文件**：
   - 用文本编辑器（VS Code、Sublime Text）打开
   - 点击右下角编码 → 选择 **"UTF-8"**
   - 保存文件

---

## 📞 获取帮助

### 查看详细日志

打开浏览器开发者工具查看详细错误信息：
- **Mac**：`Command + Option + I`
- **Windows**：`F12` 或 `Ctrl + Shift + I`

切换到 **"Console"（控制台）** 标签，查看错误信息。

### 测试工具

项目提供了一些测试脚本：

```bash
# 测试 JWT token 是否有效
./test-jwt-activation.sh

# 调试 API 连接
./debug-api.sh
```

### 联系支持

如果以上方法都无法解决问题：

1. **查看完整文档**：
   - 阅读 `JWT-TOKEN-SETUP.md` 了解 token 详情
   - 阅读 `QUICKSTART.md` 了解快速开始

2. **检查相关项目**：
   - Label Studio 文档：https://labelstud.io/guide/
   - Label Studio GitHub：https://github.com/heartexlabs/label-studio

3. **报告问题**：
   - 准备好错误截图
   - 复制控制台错误信息
   - 说明操作系统和软件版本

---

## 🏗️ 高级操作（可选）

### 构建生产版本

如果需要部署到服务器：
```bash
npm run build
```

构建文件会生成在 `dist/` 目录中。

预览生产版本：
```bash
npm run preview
```

### 手动配置环境变量

如果不想每次都在界面配置，可以创建 `.env.local` 文件：

```bash
cd "/Users/foxxis/Documents/scientific retelling/code/human coding/label-studio-graph-app"
cp .env.local.example .env.local
nano .env.local
```

编辑内容：
```env
VITE_LABEL_STUDIO_URL=http://localhost:8080
VITE_LABEL_STUDIO_TOKEN=
VITE_LABEL_STUDIO_REFRESH_TOKEN=你的JWT_token
VITE_PROJECT_ID=你的项目ID
```

保存后重启应用。

---

## 📊 功能测试清单

完成配置后，可以按照以下步骤测试功能是否正常：

### ✅ 测试 1：应用连接成功
- 启动应用后能看到标注界面
- 左侧显示摘要文本
- 没有错误提示

### ✅ 测试 2：标注变量
- 选中文本，标注为 Variable
- 右侧图形显示新节点
- 节点标签正确显示

### ✅ 测试 3：创建关系
- 连接两个变量
- 右侧图形显示连线
- 关系列表显示详情

### ✅ 测试 4：编辑变量名
- 在左侧输入变量名
- 右侧图形节点标签立即更新
- 更新延迟不超过 1 秒

### ✅ 测试 5：提交标注
- 点击 Submit 按钮
- 显示成功提示
- 自动加载下一条任务

---

## 🎓 项目结构说明（开发者参考）

```
label-studio-graph-app/
├── src/                          # 源代码
│   ├── components/               # React 组件
│   │   ├── LabelStudioWrapper.tsx    # Label Studio 嵌入组件
│   │   └── GraphPanel.tsx            # 关系图可视化组件
│   ├── utils/                    # 工具函数
│   │   ├── api.ts                    # Label Studio API 客户端
│   │   └── parser.ts                 # 标注结果解析器
│   ├── types.ts                  # TypeScript 类型定义
│   ├── App.tsx                   # 主应用组件
│   └── main.tsx                  # 应用入口
├── index.html                    # HTML 模板
├── package.json                  # Node.js 依赖配置
├── vite.config.ts                # Vite 构建配置
├── start-app.sh                  # 一键启动脚本
├── test-jwt-activation.sh        # JWT token 测试脚本
├── .env.local.example            # 环境变量示例
├── JWT-TOKEN-SETUP.md            # JWT token 详细说明
└── README.md                     # 本文档
```

### 技术栈

- **前端框架**：React + TypeScript
- **构建工具**：Vite
- **标注工具**：Label Studio Frontend（LSF）
- **图形可视化**：vis-network
- **HTTP 客户端**：Fetch API

### 数据流程

```
用户标注 → LSF 回调/轮询 → ResultParser 解析
         ↓
    GraphPanel 渲染 → 关系图更新
```

---

## ⚙️ 已知限制

- 📌 **单任务显示**：每次只显示一条任务，使用 Next/Previous 切换
- 📌 **轮询机制**：使用 500ms 轮询检测标注变化（因为 LSF 事件可能不可靠）
- 📌 **边点击限制**：点击关系列表中的边无法在 LSF 中高亮（LSF API 限制）
- 📌 **配置存储**：配置保存在浏览器 localStorage，清除浏览器数据会丢失

---

## 📄 许可证

MIT License

---

## 🤝 相关资源

- **Label Studio 官方文档**：https://labelstud.io/guide/
- **Label Studio GitHub**：https://github.com/heartexlabs/label-studio
- **vis-network 文档**：https://visjs.github.io/vis-network/docs/network/
- **Vite 文档**：https://vitejs.dev/
- **React 文档**：https://react.dev/

---

## ✨ 版本历史

- **v1.2** - 添加 JWT token 自动激活功能
- **v1.1** - 添加一键启动脚本，自动配置
- **v1.0** - 初始版本，基本标注和可视化功能

---

**🎉 感谢使用 Label Studio Graph Annotator！祝标注顺利！**

如有问题，请参考上方的"常见问题与解决方案"部分。
