@echo off
cd /d "C:\Users\piada\Desktop\prime-marble-lp"
echo.
echo === Prime Marble LP - Deploy ===
echo.
git add -A
git status
echo.
set /p msg="Mensagem do commit (ou Enter para 'Atualizar assets'): "
if "%msg%"=="" set msg=Atualizar assets
git commit -m "%msg%"
git push origin main
echo.
echo Deploy enviado! O Render vai atualizar automaticamente.
echo.
pause
