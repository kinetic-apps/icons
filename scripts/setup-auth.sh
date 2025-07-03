#!/bin/bash

# Setup script for @kinetic-apps npm packages
# This configures npm to use GitHub Packages for @kinetic-apps scope

echo "🔧 Setting up npm authentication for @kinetic-apps packages"
echo ""

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "Please install it first: https://cli.github.com"
    exit 1
fi

# Check if user is authenticated with gh
if ! gh auth status &> /dev/null; then
    echo "❌ You're not logged in to GitHub CLI."
    echo "Please run: gh auth login"
    exit 1
fi

# Get the current user
GITHUB_USER=$(gh api user -q .login)
echo "👤 GitHub user: $GITHUB_USER"

# Check if user is in kinetic-apps org
if ! gh api user/orgs -q '.[].login' | grep -q "kinetic-apps"; then
    echo "❌ You're not a member of the kinetic-apps organization."
    echo "Please contact an admin to add you to the organization."
    exit 1
fi

echo "✅ You're a member of kinetic-apps organization"
echo ""

# Create a new token with the right scopes
echo "📝 Creating a GitHub token for npm packages..."
echo "This token will have read:packages scope for installing packages."
echo ""

# Generate token using gh
TOKEN=$(gh auth token)

# Configure npm globally
echo "🔧 Configuring npm..."
npm config set @kinetic-apps:registry https://npm.pkg.github.com

# Add auth token to user's npmrc
echo "//npm.pkg.github.com/:_authToken=$TOKEN" >> ~/.npmrc

echo ""
echo "✅ Setup complete!"
echo ""
echo "You can now install @kinetic-apps packages in any project:"
echo "  npm install @kinetic-apps/icons"
echo ""
echo "Note: Your token has been saved to ~/.npmrc"
echo "Keep this file secure and don't commit it to git!"