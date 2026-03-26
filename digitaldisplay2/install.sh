#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CURRENT_USER="$(whoami)"
HOME_DIR="$(eval echo ~$CURRENT_USER)"

echo "================================"
echo "  Signage Display — Installer"
echo "================================"
echo ""

# Install unclutter for hiding the cursor (only dependency not pre-installed)
echo "Installing unclutter..."
sudo apt install -y unclutter
echo ""

# Make scripts executable
chmod +x "$SCRIPT_DIR/start.sh"

# Install systemd service
echo "Installing systemd service..."
sed -e "s|SIGNAGE_DIR|$SCRIPT_DIR|g" \
    -e "s|SIGNAGE_USER|$CURRENT_USER|g" \
    -e "s|SIGNAGE_HOME|$HOME_DIR|g" \
    "$SCRIPT_DIR/systemd/signage.service" | sudo tee /etc/systemd/system/signage.service > /dev/null
sudo systemctl daemon-reload
sudo systemctl enable signage.service
echo ""

# Start it
echo "Starting signage..."
sudo systemctl start signage.service
echo ""

echo "================================"
echo "  Done!"
echo "================================"
echo ""
echo "Edit your URL:   nano ~/signage/config.sh"
echo "Then restart:    sudo systemctl restart signage"
echo ""
echo "Commands:"
echo "  Status:  sudo systemctl status signage"
echo "  Logs:    journalctl -u signage -f"
echo "  Stop:    sudo systemctl stop signage"
echo ""
