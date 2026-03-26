#!/bin/bash
set -e
sudo systemctl stop signage 2>/dev/null || true
sudo systemctl disable signage 2>/dev/null || true
sudo rm -f /etc/systemd/system/signage.service
sudo systemctl daemon-reload
echo "Signage service removed."
echo "To fully delete: rm -rf ~/signage"
