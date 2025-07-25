@echo off
echo 🚀 Preparing project for deployment...

REM Check if git is initialized
if not exist ".git" (
    echo 📁 Initializing Git repository...
    git init
    git branch -M main
) else (
    echo ✅ Git repository already initialized
)

REM Add all files
echo 📦 Adding files to Git...
git add .

REM Check if there are changes to commit
git diff --staged --quiet
if errorlevel 1 (
    echo 💾 Committing changes...
    git commit -m "Prepare for Render deployment - %date%_%time%"
) else (
    echo ℹ️  No changes to commit
)

echo.
echo ✅ Project is ready for deployment!
echo.
echo Next steps:
echo 1. Create a GitHub repository
echo 2. Add remote: git remote add origin ^<your-repo-url^>
echo 3. Push to GitHub: git push -u origin main
echo 4. Connect to Render.com
echo 5. Set up MongoDB Atlas
echo.
echo For detailed instructions, see README_DEPLOYMENT.md
