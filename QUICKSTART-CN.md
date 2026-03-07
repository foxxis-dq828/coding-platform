# 快速开始指南

## 🚀 三步开始使用

### 步骤 1：安装 Label Studio（一次性）

```bash
pip install label-studio
```

### 步骤 2：准备数据文件

准备一个 CSV 文件，包含 **AB** 列（摘要文本）。

**示例：**
```csv
AB
"This study investigates the relationship between..."
"Our research examines how different factors..."
```

### 步骤 3：启动应用

**Mac / Linux:**
```bash
./start-app.sh
```

**Windows:**
```
双击 start-app.bat
```

---

## 📝 首次配置（1分钟）

浏览器自动打开后，填写：

1. **用户名**：你的姓名（如：张三）
2. **API Token**：
   - 打开 http://localhost:8080
   - 右上角头像 → Account Settings → Access Token
   - 复制并粘贴
3. **CSV 文件**：选择你的数据文件
4. 点击 **"保存并开始使用"**

✅ 完成！应用会自动创建项目并导入数据。

---

## 🎯 开始标注

1. **划线标注变量**：选中文本 → 选择类型（Variable/Sample/等）
2. **创建关系**：点击关系工具 → 连接两个变量 → 选择类型
3. **查看图表**：右侧自动显示关系网络图
4. **提交**：完成后点击 Submit，自动加载下一个任务

---

## 🔄 之后使用

每次只需：
```bash
./start-app.sh  # 一键启动
```

配置已保存，无需再输入任何信息！

---

## ❓ 遇到问题？

查看完整文档：[README-SETUP.md](./README-SETUP.md)
