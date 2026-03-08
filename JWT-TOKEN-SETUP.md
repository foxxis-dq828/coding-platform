# JWT Activation Token 设置指南

## 什么是 JWT Activation Token？

JWT Activation Token（也叫 Refresh Token）是 Label Studio 提供的一种认证令牌。它以 `eyJ` 开头，可以用来获取短期的 Access Token。

## 为什么需要这个？

Label Studio 的认证流程：
1. 用户从 UI 获取 **JWT Activation Token (Refresh Token)** - 长期有效
2. 应用使用这个 token 调用 `/api/token/refresh/` API
3. API 返回 **Access Token** - 短期有效，用于实际 API 调用
4. Access Token 过期后，应用自动用 Refresh Token 刷新

我们的应用**已经实现了自动刷新功能**，你只需要提供 JWT Activation Token 即可！

---

## 📝 获取 JWT Activation Token 步骤

### 1. 启动 Label Studio
```bash
label-studio start
```

### 2. 登录并获取 Token

1. 打开浏览器访问: http://localhost:8080
2. 使用你的邮箱和密码登录
3. 点击右上角的 **头像/用户名**
4. 选择 **"Account & Settings"**
5. 找到 **"Access Token"** 或 **"API Token"** 区域
6. 复制显示的 token

**⚠️ 重要**: Token 必须以 `eyJ` 开头（这是 JWT token 的标识）

### 3. 测试 Token 是否有效（可选但推荐）

```bash
cd "/Users/foxxis/Documents/scientific retelling/code/human coding/label-studio-graph-app"
./test-jwt-activation.sh "你的JWT_token"
```

或者如果已经配置了 `.env.local`：
```bash
./test-jwt-activation.sh
```

看到 ✅ 标志表示 token 有效！

---

## 🚀 使用应用

### 方式一：首次配置（推荐）

1. 启动应用：
```bash
npm run dev
```

2. 在配置界面输入：
   - **Label Studio 地址**: `http://localhost:8080`
   - **用户名**: 你的名字（用于标识项目）
   - **JWT Activation Token**: 粘贴你复制的 token（以 `eyJ` 开头）
   - **CSV 文件**: 选择包含 AB 列的标注数据文件

3. 点击 **"保存并开始使用"**

应用会自动：
- ✅ 使用 JWT token 调用 `/api/token/refresh/` 获取 access token
- ✅ 创建新的标注项目
- ✅ 导入你的数据
- ✅ 保存配置到本地（下次无需重新配置）

### 方式二：手动配置 .env.local

如果你想先配置环境变量：

```bash
# 复制示例文件
cp .env.local.example .env.local

# 编辑文件
nano .env.local
```

修改 `.env.local`:
```env
VITE_LABEL_STUDIO_URL=http://localhost:8080
VITE_LABEL_STUDIO_TOKEN=                    # 留空，会自动获取
VITE_LABEL_STUDIO_REFRESH_TOKEN=eyJhbG...   # 粘贴你的 JWT token
VITE_PROJECT_ID=1                            # 项目 ID（首次使用会自动创建）
```

然后启动应用：
```bash
npm run dev
```

---

## 🔍 工作原理

### 代码实现位置

1. **`src/utils/api.ts`** - LabelStudioAPI 类
   - 第 43-48 行: 检测到只有 refresh token 时，自动调用刷新
   - 第 65-108 行: `refreshAccessToken()` 方法实现 token 刷新逻辑
   - 第 132-156 行: API 请求失败时自动重试刷新

2. **`src/App.tsx`**
   - 第 240-323 行: `handleConfigSubmit()` 处理用户输入的 JWT token
   - 第 250-258 行: 验证 token 格式（必须以 `eyJ` 开头）
   - 第 267-285 行: 创建 API 实例并自动触发 token 刷新

### API 调用流程

```
用户输入 JWT Token (eyJ...)
         ↓
App 创建 LabelStudioAPI 实例
         ↓
API 构造函数检测到 refreshToken 但没有 token
         ↓
自动调用 refreshAccessToken()
         ↓
POST http://localhost:8080/api/token/refresh/
Body: {"refresh": "eyJ..."}
         ↓
获得响应: {"access": "eyJ..."}
         ↓
保存 access token 到内存
         ↓
后续所有 API 调用使用 Bearer <access_token>
         ↓
如果 401 错误，自动刷新并重试
```

---

## 🐛 故障排查

### Token 格式错误
```
❌ Token 格式不正确！
   JWT Refresh Token 应该以 "eyJ" 开头
```

**解决方法**: 确认你复制的是 JWT token，不是其他类型的 token

### Token 过期或无效
```
❌ Failed to refresh access token: 401 Unauthorized
```

**解决方法**:
1. 重新登录 Label Studio
2. 重置/生成新的 API token
3. 使用新 token 更新配置

### Label Studio 未运行
```
❌ API request failed: Network error
```

**解决方法**:
```bash
# 启动 Label Studio
label-studio start
```

### 无法创建项目
```
❌ Setup failed: API request failed
```

**解决方法**:
1. 检查 token 权限是否足够
2. 确认用户有创建项目的权限
3. 查看浏览器控制台的详细错误信息

---

## ✅ 验证配置是否成功

成功配置后，你应该看到：

1. **配置界面**:
   ```
   ✅ Access token 已自动获取并保存
   项目 ID: X
   导入任务数: Y
   ```

2. **浏览器控制台**:
   ```
   [LabelStudioAPI] ✅ Access token refreshed successfully
   [App] Saving config with access token: { hasAccessToken: true, ... }
   ```

3. **应用主界面**:
   - 显示任务列表
   - 可以进行标注
   - 图形面板正常显示

---

## 📚 相关文件

- `src/utils/api.ts` - API 类实现（包含 token 刷新逻辑）
- `src/App.tsx` - 应用主界面（包含配置处理）
- `.env.local.example` - 环境变量示例
- `test-jwt-activation.sh` - Token 测试工具

---

## 💡 提示

- ✅ JWT token 会自动刷新，无需手动管理
- ✅ 配置保存在 localStorage，刷新页面不丢失
- ✅ 支持自动重试和错误恢复
- ✅ 点击 "Reconfigure" 可以重新配置

如有问题，请查看浏览器控制台的详细日志！
