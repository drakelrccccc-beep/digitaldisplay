#!/bin/bash

###############################################################################
# Deploy script to push code to Raspberry Pi via SSH
###############################################################################

set -e

# Configuration (update these values)
PI_HOST="${PI_HOST:-raspberrypi.local}"
PI_USER="${PI_USER:-pi}"
PI_DIR="${PI_DIR:-/home/pi/digitaldisplay}"

echo "=========================================="
echo "Deploying to Raspberry Pi"
echo "=========================================="
echo "Host: $PI_USER@$PI_HOST"
echo "Directory: $PI_DIR"
echo ""

# Check if SSH connection works
echo "Testing SSH connection..."
if ! ssh -o ConnectTimeout=5 "$PI_USER@$PI_HOST" "echo 'Connection successful'"; then
    echo "❌ Error: Could not connect to $PI_USER@$PI_HOST"
    echo ""
    echo "Troubleshooting:"
    echo "1. Check that your Raspberry Pi is powered on and connected to the network"
    echo "2. Verify the hostname/IP address (default: raspberrypi.local)"
    echo "3. Ensure SSH is enabled on your Pi: sudo raspi-config -> Interface Options -> SSH"
    echo "4. You can override defaults with environment variables:"
    echo "   PI_HOST=192.168.1.100 PI_USER=pi ./scripts/deploy.sh"
    exit 1
fi

echo "✅ SSH connection successful"
echo ""

# Create directory on Pi if it doesn't exist
echo "Creating directory on Raspberry Pi..."
ssh "$PI_USER@$PI_HOST" "mkdir -p $PI_DIR"

# Build locally first
echo ""
echo "Building TypeScript locally..."
npm run build

# Sync files to Pi (excluding node_modules, .git, etc.)
echo ""
echo "Syncing files to Raspberry Pi..."
rsync -avz --delete \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '.env' \
    --exclude 'dist' \
    --exclude '.vscode' \
    --exclude '*.log' \
    ./ "$PI_USER@$PI_HOST:$PI_DIR/"

# Install dependencies and build on Pi
echo ""
echo "Installing dependencies on Raspberry Pi..."
ssh "$PI_USER@$PI_HOST" "cd $PI_DIR && npm install && npm run build"

# Copy .env if it exists locally and doesn't exist on Pi
if [ -f .env ]; then
    echo ""
    echo "Checking .env file..."
    if ssh "$PI_USER@$PI_HOST" "[ ! -f $PI_DIR/.env ]"; then
        echo "Copying .env file to Raspberry Pi..."
        scp .env "$PI_USER@$PI_HOST:$PI_DIR/.env"
    else
        echo ".env already exists on Pi (not overwriting)"
    fi
fi

# Ask if user wants to install/restart the service
echo ""
read -p "Install/restart systemd service? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Installing systemd service..."
    ssh "$PI_USER@$PI_HOST" "sudo cp $PI_DIR/systemd/digitaldisplay.service /etc/systemd/system/ && \
        sudo systemctl daemon-reload && \
        sudo systemctl enable digitaldisplay.service && \
        sudo systemctl restart digitaldisplay.service"
    
    echo ""
    echo "Checking service status..."
    ssh "$PI_USER@$PI_HOST" "sudo systemctl status digitaldisplay.service --no-pager"
fi

echo ""
echo "=========================================="
echo "✅ Deployment Complete!"
echo "=========================================="
echo ""
echo "Useful commands to run on your Pi:"
echo "  ssh $PI_USER@$PI_HOST"
echo "  sudo systemctl status digitaldisplay.service"
echo "  sudo systemctl restart digitaldisplay.service"
echo "  sudo journalctl -u digitaldisplay.service -f"
echo ""
