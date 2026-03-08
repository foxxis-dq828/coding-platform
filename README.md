# Label Studio Graph Annotator

一个科研文献标注工具，用于标注变量和关系，并实时显示关系网络图。

---

## 📋 第一次使用

### 1. 安装 Python

**检查是否已安装：**
```bash
python3 --version
```

**如果未安装：**

Mac 用户（推荐使用 Homebrew）：
```bash
# 如果没有 Homebrew，先安装：
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

brew install python@3.10
```

或者从官网下载：https://www.python.org/downloads/
（下载 Python 3.10，安装时勾选 "Add Python to PATH"）

---

### 2. 安装 Node.js

**检查是否已安装：**
```bash
node --version
```

**如果未安装：**

Mac 用户（推荐使用 Homebrew）：
```bash
brew install node
```

或者从官网下载：https://nodejs.org/
（下载 LTS 版本，使用默认设置安装）

---

### 3. 配置 Python 虚拟环境

**为什么需要虚拟环境？**
虚拟环境可以为这个项目创建独立的 Python 环境，避免与系统其他项目冲突。

**步骤一：进入项目文件夹**
```bash
cd "你的项目文件夹路径"
# 例如：cd "/Users/foxxis/Documents/scientific retelling/code/human coding/label-studio-graph-app"
```

**步骤二：创建虚拟环境**
```bash
python3 -m venv venv
```
执行后会在项目文件夹中创建一个名为 `venv` 的文件夹。

**步骤三：激活虚拟环境**

Mac/Linux：
```bash
source venv/bin/activate
```

Windows：
```bash
venv\Scripts\activate
```

**成功标志：**
激活成功后，终端提示符前会出现 `(venv)`，例如：
```
(venv) your-username@computer:~/project$
```

**步骤四：验证虚拟环境**
```bash
which python3
# 应该显示：/你的项目路径/venv/bin/python3
```

---

### 4. 安装 Label Studio（在虚拟环境中）

**确保虚拟环境已激活**（终端前有 `(venv)` 标识），然后执行：

```bash
pip3 install label-studio
```

验证安装：
```bash
label-studio --version
```

**注意：**
- ✅ 每次使用项目前都需要先激活虚拟环境
- ✅ 关闭终端后，下次需要重新激活
- ✅ 退出虚拟环境使用命令：`deactivate`

---

### 5. 安装项目依赖

**打开终端，进入项目文件夹：**
```bash
cd "你的项目文件夹路径"
```

**安装依赖：**
```bash
npm install
```

---

### 6. 启动项目

**重要提醒：**
- ⚠️ 启动前必须先激活虚拟环境（参考第3步）
- 终端前应该显示 `(venv)` 标识

**一键启动（推荐）：**
```bash
./start-app.sh
```

如果提示权限不足，使用手动启动：
**或者手动启动（打开两个终端）：**

终端 1（需要在虚拟环境中）：
```bash
source venv/bin/activate  # 先激活虚拟环境
label-studio start
```

终端 2：
```bash
npm run dev
```

**成功后浏览器会自动打开：**
- 应用界面：http://localhost:3000
- Label Studio：http://localhost:8080

---

### 7. 配置 Token 和 CSV

#### 6.1 获取 JWT Token

1. 打开 http://localhost:8080
2. 注册/登录账户
3. 点击右上角头像 → **Account Settings**
4. 找到 **Access Token** 区域
5. 复制 Token（必须以 `eyJ` 开头）

#### 6.2 填写配置

在应用配置界面（http://localhost:3000）填写：

| 字段 | 说明 | 示例 |
|------|------|------|
| **Label Studio 地址** | 自动填写 | `http://localhost:8080` |
| **用户名** | 你的姓名 | `张三` |
| **JWT Token** | 刚才复制的 Token | `eyJhbGci...`（以 eyJ 开头） |
| **CSV 文件** | 选择数据文件 | 必须包含 **AB** 列 |

#### 6.3 保存配置

点击 **"保存并开始使用"**，应用会自动：
- ✅ 激活 Token
- ✅ 创建项目
- ✅ 导入数据
- ✅ 跳转到标注界面

🎉 **配置完成！**

---

## 🔄 日常使用（第二次及以后）

配置完成后，以后每次使用只需 4 步：

### 1. 打开终端
```bash
# Mac: Command + 空格 → 输入 Terminal
# Windows: Win + R → 输入 cmd
```

### 2. 进入项目文件夹
```bash
cd "你的项目文件夹路径"
```

### 3. 激活虚拟环境
```bash
# Mac/Linux:
source venv/bin/activate

# Windows:
venv\Scripts\activate
```
**确认成功：** 终端前出现 `(venv)` 标识

### 4. 启动应用
```bash
./start-app.sh
```

✅ 完成！浏览器自动打开，继续标注。

**💡 提示：** 使用完毕后，可以用 `deactivate` 命令退出虚拟环境。

---

## 📂 CSV 格式要求

CSV 文件**必须**满足以下条件：

### 必需列：
- **AB**：包含要标注的摘要文本（必需）

### 示例格式：
```csv
AB,Title,Year
"This study investigates the relationship between sleep and cognitive performance.","Sleep Study",2023
"We found a significant correlation between exercise frequency and mental health.","Exercise Research",2024
```

### 注意事项：
- ✅ 第一行必须是列名（表头）
- ✅ 使用 **UTF-8** 编码（避免中文乱码）
- ✅ Excel 保存时选择："CSV UTF-8（逗号分隔）"

---

## 🎨 如何标注

### 标注变量（创建节点）
1. 选中文本
2. 选择变量类型：
   - **Variable**（变量）：主要研究变量
   - **Sample**（样本）：研究对象
   - **Boundary_Condition**（边界条件）：限定条件
   - **Control**（控制变量）：控制因素

### 编辑变量名
- 在右侧输入框给变量起个简短名字
- 例如："sleep duration" → `睡眠时长`

### 创建关系（连接节点）
1. 选择 Relations 工具
2. 从第一个变量拖到第二个变量
3. 选择关系类型：
   - **moderation**：调节作用
   - **direction**：因果关系
   - **correlation**：相关关系
   - **hierarchy**：层级关系

### 提交标注
- 完成后点击 **"Submit"**
- 自动加载下一条任务

---

## ⚠️ 常见问题

### 1. Token 无效（401 错误）

**问题**：显示 "Token is blacklisted" 或 "Unauthorized"

**解决**：
```bash
# 测试 Token 是否有效
./test-jwt-activation.sh

# 如果失败，重新获取 Token：
# 1. 打开 http://localhost:8080
# 2. Account Settings → Access Token
# 3. 点击 Reset Token → 复制新 Token
# 4. 应用中点击 "Reconfigure" → 粘贴新 Token
```

---

### 2. 端口被占用

**问题**：显示 "Port 8080 is already in use"

**解决（Mac/Linux）**：
```bash
lsof -ti:8080 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

**解决（Windows）**：
```bash
netstat -ano | findstr :8080
taskkill /PID <进程ID> /F
```

---

### 3. Label Studio 未安装

**问题**：显示 "label-studio: command not found"

**解决**：
```bash
# 确保已激活虚拟环境
source venv/bin/activate

# 在虚拟环境中安装
pip3 install label-studio
# 或
python3 -m pip install label-studio
```

---

### 3.5 忘记激活虚拟环境

**问题**：提示 "label-studio: command not found"，但之前已经安装过

**原因**：可能是关闭终端后忘记重新激活虚拟环境

**解决**：
```bash
# 进入项目文件夹
cd "你的项目文件夹路径"

# 激活虚拟环境
source venv/bin/activate  # Mac/Linux
# 或
venv\Scripts\activate     # Windows

# 确认激活成功（终端前应显示 (venv)）
# 然后再启动应用
label-studio start
```

---

### 4. npm 安装失败

**解决**：
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

### 5. 权限不足（Mac/Linux）

**问题**：显示 "Permission denied"

**解决**：
```bash
chmod +x start-app.sh
chmod +x test-jwt-activation.sh
```

---

### 6. 中文乱码

**解决**：
- Excel 保存 CSV 时选择：**"CSV UTF-8（逗号分隔）"**
- 或用文本编辑器打开 CSV，另存为 UTF-8 编码

---

## 📚 更多帮助

### 详细文档
- **JWT Token 详细说明**：查看 `JWT-TOKEN-SETUP.md`
- **快速参考手册**：查看 `QUICK-REFERENCE.md`
- **更新日志**：查看 `CHANGELOG.md`

### 查看日志
打开浏览器开发者工具：
- Mac：`Command + Option + I`
- Windows：`F12`

### 测试工具
```bash
# 测试 JWT Token
./test-jwt-activation.sh

# 调试 API 连接
./debug-api.sh
```

---

## 🔧 技术栈

- **前端**：React + TypeScript + Vite
- **标注工具**：Label Studio
- **图形可视化**：vis-network
- **后端**：Label Studio API

---

## 📄 许可证

MIT License

---

## 🤝 相关链接

- Label Studio 官方文档：https://labelstud.io/guide/
- Label Studio GitHub：https://github.com/heartexlabs/label-studio
- vis-network 文档：https://visjs.github.io/vis-network/

---

**🎉 祝标注顺利！**
