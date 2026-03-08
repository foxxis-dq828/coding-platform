#!/bin/bash

echo "=================================="
echo "JWT Activation Token 测试工具"
echo "=================================="
echo ""

# 检查参数
if [ -z "$1" ]; then
    # 尝试从 .env.local 读取
    if [ -f .env.local ]; then
        export $(cat .env.local | grep -v '^#' | grep -v '^$' | xargs)
        JWT_TOKEN="$VITE_LABEL_STUDIO_REFRESH_TOKEN"
        LS_URL="$VITE_LABEL_STUDIO_URL"
    else
        echo "用法: $0 <JWT_ACTIVATION_TOKEN>"
        echo "或者: 在 .env.local 中配置 VITE_LABEL_STUDIO_REFRESH_TOKEN"
        exit 1
    fi
else
    JWT_TOKEN="$1"
    LS_URL="${2:-http://localhost:8080}"
fi

if [ -z "$JWT_TOKEN" ]; then
    echo "❌ 未找到 JWT token"
    exit 1
fi

echo "Label Studio URL: $LS_URL"
echo "JWT Token (前 30 字符): ${JWT_TOKEN:0:30}..."
echo ""

# 验证 token 格式
if [[ ! "$JWT_TOKEN" == eyJ* ]]; then
    echo "❌ 错误: Token 格式不正确！"
    echo "   JWT token 必须以 'eyJ' 开头"
    echo "   你的 token 以 '${JWT_TOKEN:0:10}' 开头"
    echo ""
    echo "请确认你复制的是正确的 JWT activation token（refresh token）"
    exit 1
fi

echo "✅ Token 格式正确（JWT format）"
echo ""

# 调用 /api/token/refresh/ API
echo "正在调用 /api/token/refresh/ API..."
echo "-----------------------------------"

RESPONSE=$(curl -sS -w "\n%{http_code}" -X POST "$LS_URL/api/token/refresh/" \
  -H "Content-Type: application/json" \
  -d "{\"refresh\":\"$JWT_TOKEN\"}" 2>&1)

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "HTTP Status: $HTTP_CODE"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ 激活成功！"
    echo ""

    # 解析并显示 access token
    ACCESS_TOKEN=$(echo "$BODY" | python3 -c "
import sys, json
try:
    data = json.loads(sys.stdin.read())
    if 'access' in data:
        print(data['access'])
    else:
        print('')
except:
    print('')
" 2>/dev/null)

    if [ -n "$ACCESS_TOKEN" ]; then
        echo "📝 获得的 Access Token:"
        echo "-----------------------------------"
        echo "$ACCESS_TOKEN"
        echo "-----------------------------------"
        echo ""
        echo "Access Token 长度: ${#ACCESS_TOKEN} 字符"
        echo "前 30 字符: ${ACCESS_TOKEN:0:30}..."
        echo "后 30 字符: ...${ACCESS_TOKEN: -30}"
        echo ""

        # 测试 access token 是否有效
        echo "测试 Access Token 是否有效..."
        TEST_RESPONSE=$(curl -sS -w "\n%{http_code}" \
            -H "Authorization: Bearer $ACCESS_TOKEN" \
            "$LS_URL/api/projects" 2>&1)
        TEST_CODE=$(echo "$TEST_RESPONSE" | tail -n 1)

        if [ "$TEST_CODE" = "200" ]; then
            echo "✅ Access Token 有效！可以正常访问 API"

            # 显示项目列表
            PROJECTS=$(echo "$TEST_RESPONSE" | head -n -1)
            PROJECT_COUNT=$(echo "$PROJECTS" | python3 -c "
import sys, json
try:
    data = json.loads(sys.stdin.read())
    print(len(data))
except:
    print('0')
" 2>/dev/null)
            echo "   找到 $PROJECT_COUNT 个项目"
        else
            echo "❌ Access Token 无效 (HTTP $TEST_CODE)"
        fi
        echo ""

        echo "=================================="
        echo "总结"
        echo "=================================="
        echo "✅ JWT activation token 有效"
        echo "✅ 成功获取 access token"
        echo "✅ 可以正常连接 Label Studio"
        echo ""
        echo "你的应用现在应该可以正常工作了！"
        echo ""
        echo "下一步："
        echo "1. 确保 .env.local 中的 VITE_LABEL_STUDIO_REFRESH_TOKEN 是这个 token"
        echo "2. 运行 'npm run dev' 启动应用"
        echo "3. 在配置界面输入这个 JWT token"

    else
        echo "⚠️  响应中未找到 access token"
        echo "原始响应:"
        echo "$BODY"
    fi

else
    echo "❌ 激活失败 (HTTP $HTTP_CODE)"
    echo ""
    echo "响应内容:"
    echo "$BODY"
    echo ""
    echo "可能的原因:"
    echo "1. JWT token 已过期"
    echo "2. JWT token 无效或格式错误"
    echo "3. Label Studio 版本不支持此功能"
    echo "4. Label Studio 未正确配置 JWT 认证"
    echo ""
    echo "解决方法:"
    echo "1. 重新登录 Label Studio 获取新的 JWT token"
    echo "2. 确认 Label Studio 正在运行: $LS_URL"
    echo "3. 检查 Label Studio 版本是否支持 JWT 认证"
    exit 1
fi
