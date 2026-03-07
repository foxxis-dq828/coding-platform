#!/bin/bash

echo "=========================================="
echo "  Label Studio Graph Annotator"
echo "=========================================="
echo ""

# 检查 Label Studio 是否已安装
if ! command -v label-studio &> /dev/null; then
    echo "⚠️  Label Studio 未安装"
    echo ""
    echo "请先安装 Label Studio:"
    echo "  pip install label-studio"
    echo ""
    echo "安装完成后重新运行此脚本。"
    exit 1
fi

# 检查 Label Studio 是否已运行
echo "🔍 检测 Label Studio..."
if curl -s http://localhost:8080/version > /dev/null 2>&1; then
    echo "✅ Label Studio 已在运行 (http://localhost:8080)"
else
    echo "⚠️  Label Studio 未运行"
    echo "🚀 正在启动 Label Studio..."

    # 在后台启动 Label Studio
    nohup label-studio start > /tmp/label-studio.log 2>&1 &

    # 等待 Label Studio 启动
    echo "   等待服务启动..."
    for i in {1..30}; do
        sleep 1
        if curl -s http://localhost:8080/version > /dev/null 2>&1; then
            echo "✅ Label Studio 启动成功!"
            break
        fi
        if [ $i -eq 30 ]; then
            echo "❌ Label Studio 启动超时"
            echo "   请手动运行: label-studio start"
            exit 1
        fi
    done
fi

echo ""
echo "🚀 启动 Graph Annotator..."

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo "📦 首次运行，正在安装依赖..."
    npm install
fi

# 启动开发服务器
echo "✅ 打开浏览器..."
npm run dev

# 清理说明
echo ""
echo "=========================================="
echo "应用已启动！"
echo ""
echo "如需停止 Label Studio，请运行:"
echo "  pkill -f label-studio"
echo "=========================================="
