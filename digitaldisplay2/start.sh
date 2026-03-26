#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Load config
source "$SCRIPT_DIR/config.sh"

# Validate
if [ -z "$SLIDES_URL" ]; then
    echo "ERROR: SLIDES_URL is empty. Edit ~/signage/config.sh"
    exit 1
fi

# Disable screen blanking
xset s off -dpms 2>/dev/null || true

# Hide cursor
unclutter -idle 0 -root &

# Clean Chromium crash flags so it doesn't show "restore session" dialogs
CHROMIUM_DIR="$HOME/.config/chromium"
if [ -d "$CHROMIUM_DIR/Default" ]; then
    sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' "$CHROMIUM_DIR/Default/Preferences" 2>/dev/null || true
    sed -i 's/"exit_type":"Crashed"/"exit_type":"Normal"/' "$CHROMIUM_DIR/Default/Preferences" 2>/dev/null || true
fi

# Launch Chromium in kiosk mode
exec chromium-browser \
    --kiosk \
    --start-fullscreen \
    --no-sandbox \
    --disable-infobars \
    --disable-session-crashed-bubble \
    --disable-features=TranslateUI \
    --no-first-run \
    --no-default-browser-check \
    --disable-extensions \
    --disable-plugins \
    --disable-sync \
    --disable-gpu \
    --disable-software-rasterizer \
    --disable-dev-shm-usage \
    --disable-background-networking \
    --disable-background-timer-throttling \
    --disable-backgrounding-occluded-windows \
    --disable-breakpad \
    --disable-component-extensions-with-background-pages \
    --disable-hang-monitor \
    --disable-popup-blocking \
    --disable-renderer-backgrounding \
    --autoplay-policy=no-user-gesture-required \
    --check-for-update-interval=31536000 \
    --mute-audio \
    "$SLIDES_URL"
