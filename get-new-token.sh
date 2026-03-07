#!/bin/bash

echo "获取新的 Label Studio Token"
echo "============================"
echo ""
echo "请输入 Label Studio 用户名（邮箱）:"
read -r USERNAME

echo "请输入密码:"
read -rs PASSWORD

echo ""
echo "正在获取 token..."

RESPONSE=$(curl -sS -X POST "http://localhost:8080/api/auth/login/" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}")

echo "$RESPONSE"

# 提取 access 和 refresh token
ACCESS=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('access', ''))" 2>/dev/null)
REFRESH=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('refresh', ''))" 2>/dev/null)

if [ -n "$ACCESS" ] && [ -n "$REFRESH" ]; then
    echo ""
    echo "✅ 成功获取 token！"
    echo ""
    echo "请将以下内容添加到 .env.local 文件："
    echo "================================"
    echo "VITE_LABEL_STUDIO_TOKEN="
    echo "VITE_LABEL_STUDIO_REFRESH_TOKEN=$REFRESH"
    echo ""
    
    # 自动更新 .env.local
    echo "是否自动更新 .env.local? (y/n)"
    read -r CONFIRM
    if [ "$CONFIRM" = "y" ]; then
        sed -i '' "s|VITE_LABEL_STUDIO_REFRESH_TOKEN=.*|VITE_LABEL_STUDIO_REFRESH_TOKEN=$REFRESH|" .env.local
        echo "✅ .env.local 已更新！"
    fi
else
    echo ""
    echo "❌ 获取 token 失败"
    echo "完整响应: $RESPONSE"
fi
