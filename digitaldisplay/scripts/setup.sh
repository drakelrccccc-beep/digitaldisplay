#!/bin/bash

###############################################################################
# Digital Display Setup Script for Raspberry Pi 2
# This script installs all dependencies needed to run Google Slides in kiosk mode
###############################################################################

set -e  # Exit on error

echo "=========================================="
echo "Digital Display Setup for Raspberry Pi 2"
echo "=========================================="

sudo cp systemd/digitaldisplay.service /etc/systemd/system/digitaldisplay.service
sudo systemctl daemon-reload
sudo systemctl enable digitaldisplay.service
sudo systemctl start digitaldisplay.service
echo "4. Check service status:"
sudo systemctl status digitaldisplay.service
echo ""
