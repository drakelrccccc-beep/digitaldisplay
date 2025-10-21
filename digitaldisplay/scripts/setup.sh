#!/bin/bash

###############################################################################
# Digital Display Setup Script for Raspberry Pi 2
# This script installs all dependencies needed to run Google Slides in kiosk mode
###############################################################################

set -e  # Exit on error

echo "=========================================="
echo "Digital Display Setup for Raspberry Pi 2"
echo "=========================================="
echo ""

# Check if running on Raspberry Pi
if [ ! -f /proc/device-tree/model ]; then
    echo "Warning: This script is designed for Raspberry Pi"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Update system
echo "Updating system packages..."
sudo apt update
sudo apt upgrade -y

# Install Node.js (LTS version for Raspberry Pi)
echo ""
echo "Installing Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
else
    echo "Node.js already installed: $(node --version)"
fi

# Install Chromium browser
echo ""
echo "Installing Chromium browser..."
sudo apt install -y chromium-browser chromium-codecs-ffmpeg-extra

# Install X11 utilities (for display management)
echo ""
echo "Installing X11 utilities..."
sudo apt install -y xdotool unclutter x11-xserver-utils

# Install project dependencies
echo ""
echo "Installing npm dependencies..."
cd "$(dirname "$0")/.." || exit
npm install

# Build TypeScript
echo ""
echo "Building TypeScript..."
npm run build

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "Creating .env file..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Edit .env and add your Google Slides URL"
    echo "   Example: SLIDES_URL=https://docs.google.com/presentation/d/YOUR_ID/edit"
fi

# Disable screen blanking and power management
echo ""
echo "Disabling screen blanking and power management..."
sudo apt install -y xscreensaver
# Add to autostart to disable screensaver
mkdir -p ~/.config/autostart
cat > ~/.config/autostart/disable-screensaver.desktop <<EOF
[Desktop Entry]
Type=Application
Name=Disable Screensaver
Exec=xset s off -dpms
EOF

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Edit .env file and add your Google Slides URL:"
echo "   nano .env"
echo ""
echo "2. Test the application:"
echo "   npm start"
echo ""
echo "3. Install as system service (auto-start on boot):"
echo "   sudo cp systemd/digitaldisplay.service /etc/systemd/system/"
echo "   sudo systemctl daemon-reload"
echo "   sudo systemctl enable digitaldisplay.service"
echo "   sudo systemctl start digitaldisplay.service"
echo ""
echo "4. Check service status:"
echo "   sudo systemctl status digitaldisplay.service"
echo ""
