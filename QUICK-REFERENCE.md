# 快速参考手册

## 📋 常用命令速查

### 进入项目目录
```bash
cd "/Users/foxxis/Documents/scientific retelling/code/human coding/label-studio-graph-app"
```

### 一键启动（推荐）
```bash
./start-app.sh
```

### 手动启动

**终端 1 - 启动 Label Studio：**
```bash
label-studio start
```

**终端 2 - 启动应用：**
```bash
npm run dev
```

### 测试 JWT Token
```bash
./test-jwt-activation.sh
```

### 调试 API 连接
```bash
./debug-api.sh
```

---

## 🔧 安装命令

### 安装 Label Studio
```bash
pip3 install label-studio
```

### 安装项目依赖
```bash
npm install
```

### 验证安装
```bash
label-studio --version
node --version
npm --version
```

---

## 🌐 常用网址

| 服务 | URL |
|------|-----|
| **应用界面** | http://localhost:3000 |
| **Label Studio** | http://localhost:8080 |
| **获取 Token** | http://localhost:8080 → Account Settings → Access Token |

---

## 📂 重要文件

| 文件 | 用途 |
|------|------|
| `README.md` | 完整使用教程 |
| `JWT-TOKEN-SETUP.md` | JWT token 详细说明 |
| `QUICK-REFERENCE.md` | 本文档（快速参考） |
| `CHANGELOG.md` | 版本更新历史 |
| `.env.local` | 配置文件（手动配置时使用） |
| `start-app.sh` | 一键启动脚本 |
| `test-jwt-activation.sh` | Token 测试工具 |

---

## 🎯 首次配置检查清单

### 准备工作
- [ ] 已安装 Python 3.7+
- [ ] 已安装 Node.js v18+
- [ ] 已安装 Label Studio
- [ ] 已运行 `npm install`
- [ ] 已准备 CSV 文件（包含 AB 列）

### 获取 Token
- [ ] 启动 Label Studio
- [ ] 登录账户
- [ ] 进入 Account Settings
- [ ] 复制 JWT Token（以 `eyJ` 开头）

### 应用配置
- [ ] 运行 `./start-app.sh`
- [ ] 填写用户名
- [ ] 粘贴 JWT Token
- [ ] 上传 CSV 文件
- [ ] 点击"保存并开始使用"

### 验证
- [ ] 看到标注界面
- [ ] 左侧显示任务文本
- [ ] 可以标注变量
- [ ] 右侧图形正常显示

---

## ⚠️ 常见错误快速修复

### Token 无效
```bash
# 重新测试 token
./test-jwt-activation.sh

# 如果失败，从 Label Studio 重新获取
```

### 端口被占用
```bash
# Mac/Linux
lsof -ti:8080 | xargs kill -9
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :8080
taskkill /PID <进程ID> /F
```

### 权限不足
```bash
chmod +x start-app.sh
chmod +x test-jwt-activation.sh
```

### npm 安装失败
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 🎨 标注快捷操作

### 变量类型
| 类型 | 说明 | 颜色 |
|------|------|------|
| Variable | 主要变量 | 🟠 橙色 |
| Sample | 样本对象 | 🔵 蓝色 |
| Boundary_Condition | 边界条件 | 🟢 绿色 |
| Control | 控制变量 | 🔴 红色 |

### 关系类型
| 类型 | 说明 | 颜色 |
|------|------|------|
| moderation__validated | 已验证调节 | 🟡 黄色 |
| moderation__hypothesized | 假设调节 | 🟡 浅黄 |
| moderation__null | 无调节 | 🟡 淡黄 |
| direction__validated | 已验证因果 | 🔵 蓝色 |
| direction__hypothesized | 假设因果 | 🔵 浅蓝 |
| direction__null | 无因果 | 🔵 淡蓝 |
| correlation__validated | 已验证相关 | 🟢 绿色 |
| correlation__hypothesized | 假设相关 | 🟢 浅绿 |
| correlation__null | 无相关 | 🟢 淡绿 |
| hierarchy | 层级关系 | 🟣 紫色 |

---

## 📞 获取帮助

### 查看详细文档
```bash
# 完整教程
cat README.md | less

# JWT token 说明
cat JWT-TOKEN-SETUP.md | less

# 更新日志
cat CHANGELOG.md | less
```

### 浏览器开发者工具
- **Mac**: `Command + Option + I`
- **Windows**: `F12`

### 相关链接
- Label Studio 官方文档: https://labelstud.io/guide/
- Label Studio GitHub: https://github.com/heartexlabs/label-studio
- vis-network 文档: https://visjs.github.io/vis-network/

---

## 💡 专业提示

1. **保存 JWT Token**：复制到安全的地方（如密码管理器）
2. **使用快捷键**：标注时使用键盘快捷键提高效率
3. **定期备份**：在 Label Studio 中导出标注数据
4. **多用户协作**：每个用户使用不同的用户名创建独立项目
5. **CSV 格式**：始终保存为 UTF-8 编码，避免乱码
6. **变量命名**：使用简短、统一的命名规范
7. **定期提交**：标注一段时间后点击 Submit 保存进度

---

**🎉 提示**：建议打印或收藏本页面，方便随时查阅！
