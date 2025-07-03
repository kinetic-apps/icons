#!/bin/bash

# Kinetic Apps npm packages setup script
# This script sets up authentication for @kinetic-apps npm packages

set -e

echo "🚀 Kinetic Apps Package Setup"
echo "============================"
echo ""

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo "📦 GitHub CLI not found. Installing..."
    
    # Detect OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install gh
        else
            echo "❌ Homebrew not found. Please install GitHub CLI manually:"
            echo "   https://cli.github.com"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command -v apt-get &> /dev/null; then
            # Debian/Ubuntu
            curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
            echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
            sudo apt update
            sudo apt install gh
        elif command -v dnf &> /dev/null; then
            # Fedora
            sudo dnf install 'dnf-command(config-manager)'
            sudo dnf config-manager --add-repo https://cli.github.com/packages/rpm/gh-cli.repo
            sudo dnf install gh
        else
            echo "❌ Unsupported Linux distribution. Please install GitHub CLI manually:"
            echo "   https://cli.github.com"
            exit 1
        fi
    else
        echo "❌ Unsupported OS. Please install GitHub CLI manually:"
        echo "   https://cli.github.com"
        exit 1
    fi
fi

# Check if user is logged in to gh
if ! gh auth status &> /dev/null; then
    echo "🔐 Logging in to GitHub CLI..."
    echo "   This will open your browser for authentication"
    gh auth login -w -h github.com -p https -s read:packages
else
    echo "✅ Already logged in to GitHub CLI"
    
    # Check if we have read:packages scope
    if ! gh auth status -t 2>&1 | grep -q "read:packages"; then
        echo "🔄 Updating GitHub CLI permissions..."
        gh auth refresh -h github.com -s read:packages
    fi
fi

# Get the token
TOKEN=$(gh auth token)

# Check if user is in kinetic-apps org
echo "🔍 Checking organization membership..."
if ! gh api user/orgs -q '.[].login' | grep -q "kinetic-apps"; then
    echo "❌ You're not a member of the kinetic-apps organization."
    echo "   Please contact an admin to add you to the organization."
    exit 1
fi

echo "✅ Confirmed membership in kinetic-apps organization"

# Configure npm
echo "🔧 Configuring npm for @kinetic-apps packages..."

# Check if .npmrc exists and has kinetic-apps config
if grep -q "@kinetic-apps:registry" ~/.npmrc 2>/dev/null; then
    echo "📝 Updating existing configuration..."
    # Remove old kinetic-apps config
    sed -i.bak '/@kinetic-apps:registry/d' ~/.npmrc
    sed -i.bak '/\/\/npm.pkg.github.com\/:_authToken/d' ~/.npmrc
else
    echo "📝 Creating new configuration..."
fi

# Add new config
echo "@kinetic-apps:registry=https://npm.pkg.github.com" >> ~/.npmrc
echo "//npm.pkg.github.com/:_authToken=$TOKEN" >> ~/.npmrc

echo ""
echo "✅ Setup complete!"
echo ""
echo "You can now use @kinetic-apps packages in any project:"
echo "  npm install @kinetic-apps/icons"
echo "  npm install @kinetic-apps/[package-name]"
echo ""
echo "No additional setup needed per project! 🎉"