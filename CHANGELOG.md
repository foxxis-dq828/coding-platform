# 更新日志

## v1.2.0 - 2026-03-08

### 🔐 JWT Token 自动激活功能

#### 新增功能：
- ✅ **自动 Token 激活**：用户只需输入 JWT activation token（refresh token），应用自动调用 `/api/token/refresh/` API 获取 access token
- ✅ **Token 自动刷新**：Access token 过期时自动使用 refresh token 刷新，无需用户干预
- ✅ **Token 格式验证**：自动检测 JWT token 格式（必须以 `eyJ` 开头）
- ✅ **测试工具**：添加 `test-jwt-activation.sh` 脚本，可快速测试 token 是否有效

#### 代码改进：
- **src/App.tsx**:
  - 表单字段从 `token` 改为 `refreshToken`
  - 添加 JWT token 格式验证（第 250-258 行）
  - 自动获取并保存 access token（第 299-319 行）
  - 更新用户界面说明

- **src/utils/api.ts**:
  - 添加 `getConfig()` 方法获取包含 access token 的最新配置
  - 优化构造函数的 token 刷新逻辑（第 43-48 行）
  - 自动检测 token 类型并使用正确的认证前缀（Bearer/Token）

#### 文档更新：
- ✅ **README.md**: 完全重写，面向零基础用户
  - 添加详细的分步教程（6 个主要步骤）
  - 添加快速导航目录
  - 添加 TL;DR 快速开始部分
  - 12 个常见问题的详细解决方案
  - 添加 Mac/Windows 双平台说明

- ✅ **JWT-TOKEN-SETUP.md**: 新增 JWT token 完整使用指南
  - Token 获取详细步骤
  - 工作原理说明
  - 代码实现位置
  - API 调用流程图

- ✅ **.env.local.example**: 更新配置说明
  - 清晰的中文注释
  - JWT token 使用说明

#### 测试工具：
- ✅ **test-jwt-activation.sh**: JWT token 测试脚本
  - 自动验证 token 格式
  - 调用 `/api/token/refresh/` API
  - 测试获得的 access token 是否有效
  - 显示详细的调试信息

### 工作流程变更：

**之前（手动获取 Access Token）**:
```
用户 → Label Studio UI → 复制 Access Token → 粘贴到应用 → 使用
```

**现在（自动激活）**:
```
用户 → Label Studio UI → 复制 JWT Token → 粘贴到应用
                                            ↓
应用自动调用 /api/token/refresh/ → 获取 Access Token → 保存并使用
                                            ↓
Token 过期时自动刷新 → 无缝继续工作
```

### 用户体验改进：

| 改进项 | 之前 | 现在 |
|--------|------|------|
| Token 类型 | 需要 Access Token（容易混淆） | JWT Activation Token（Label Studio 默认提供） |
| Token 刷新 | 手动重新获取 | 自动刷新，无感知 |
| 配置复杂度 | 需要理解 API 认证 | 只需复制粘贴 token |
| 错误提示 | 简单的错误信息 | 详细的格式验证和提示 |
| 文档完整度 | 技术文档 | 零基础教程 |

---

## v1.1.0 - 2024-12

### 一键启动功能
- ✅ 添加 `start-app.sh` 启动脚本
- ✅ 自动检测和启动 Label Studio
- ✅ 自动安装 npm 依赖
- ✅ 自动打开浏览器

### 零配置体验
- ✅ 配置保存到 localStorage
- ✅ 自动创建项目
- ✅ 自动导入 CSV 数据

---

## v1.0.0 - 2024-11

### 初始版本
- ✅ Label Studio 嵌入集成
- ✅ 实时关系图可视化（vis-network）
- ✅ 多类型关系标注支持
- ✅ 变量命名和编辑
- ✅ 任务导航和提交

---

## 技术债务和已知问题

### 已修复：
- ✅ ~~JWT token 需要手动激活~~ → 现已自动激活
- ✅ ~~Token 过期需要重新配置~~ → 现已自动刷新
- ✅ ~~配置界面说明不清晰~~ → 现已详细说明

### 待改进：
- ⏳ 边点击无法在 LSF 中高亮（LSF API 限制）
- ⏳ 依赖 500ms 轮询检测变化（LSF 事件回调不可靠）

---

## 升级指南

### 从 v1.1.x 升级到 v1.2.0

如果你已经在使用旧版本：

1. **拉取最新代码**：
   ```bash
   cd "/Users/foxxis/Documents/scientific retelling/code/human coding/label-studio-graph-app"
   git pull
   ```

2. **更新依赖**（可选）：
   ```bash
   npm install
   ```

3. **获取新的 JWT Token**：
   - 旧的 Access Token 可能不再有效
   - 按照 `JWT-TOKEN-SETUP.md` 获取新 token

4. **重新配置**：
   - 打开应用，点击 "Reconfigure"
   - 输入新的 JWT token（以 `eyJ` 开头）
   - 保存配置

5. **测试**：
   ```bash
   ./test-jwt-activation.sh
   ```

---

## 贡献者

感谢所有为本项目做出贡献的人！

---

## 反馈与建议

如有问题或建议，请：
1. 查看 `README.md` 的故障排查部分
2. 查看 `JWT-TOKEN-SETUP.md` 了解 token 详情
3. 提交 Issue 或 Pull Request
