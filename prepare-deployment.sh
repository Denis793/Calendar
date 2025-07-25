#!/bin/bash

echo "🚀 Preparing project for deployment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git branch -M main
else
    echo "✅ Git repository already initialized"
fi

# Add all files
echo "📦 Adding files to Git..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "ℹ️  No changes to commit"
else
    echo "💾 Committing changes..."
    git commit -m "Prepare for Render deployment - $(date +%Y-%m-%d_%H:%M:%S)"
fi

echo ""
echo "✅ Project is ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Create a GitHub repository"
echo "2. Add remote: git remote add origin <your-repo-url>"
echo "3. Push to GitHub: git push -u origin main"
echo "4. Connect to Render.com"
echo "5. Set up MongoDB Atlas"
echo ""
echo "For detailed instructions, see README_DEPLOYMENT.md"
