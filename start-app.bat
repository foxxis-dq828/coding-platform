@echo off
chcp 65001 >nul
cls

echo ==========================================
echo   Label Studio Graph Annotator
echo ==========================================
echo.

REM 检查 Label Studio 是否已安装
where label-studio >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Label Studio 未安装
    echo.
    echo 请先安装 Label Studio:
    echo   pip install label-studio
    echo.
    echo 安装完成后重新运行此脚本。
    pause
    exit /b 1
)

REM 检查 Label Studio 是否已运行
echo 🔍 检测 Label Studio...
curl -s http://localhost:8080/version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Label Studio 已在运行 (http://localhost:8080)
) else (
    echo ⚠️  Label Studio 未运行
    echo 🚀 正在启动 Label Studio...

    REM 在新窗口启动 Label Studio
    start "Label Studio" cmd /c "label-studio start"

    REM 等待 Label Studio 启动
    echo    等待服务启动...
    timeout /t 10 /nobreak >nul

    curl -s http://localhost:8080/version >nul 2>&1
    if %errorlevel% neq 0 (
        echo ❌ Label Studio 启动失败
        echo    请手动运行: label-studio start
        pause
        exit /b 1
    )
    echo ✅ Label Studio 启动成功!
)

echo.
echo 🚀 启动 Graph Annotator...

REM 检查 node_modules 是否存在
if not exist "node_modules\" (
    echo 📦 首次运行，正在安装依赖...
    call npm install
)

REM 启动开发服务器
echo ✅ 打开浏览器...
call npm run dev

echo.
echo ==========================================
echo 应用已启动！
echo.
echo 如需停止 Label Studio，请关闭对应的命令行窗口
echo ==========================================
pause
