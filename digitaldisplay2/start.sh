#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Load config
source "$SCRIPT_DIR/config.sh"

# Validate
if [ -z "$SLIDES_URL" ]; then
    echo "ERROR: SLIDES_URL is empty. Edit ~/signage/config.sh"
    exit 1
fi

FALLBACK_URL="file://$SCRIPT_DIR/fallback.html"

# Wait for X display to be ready
until xset q &>/dev/null; do
    sleep 2
done

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

# Check internet connectivity
check_internet() {
    wget -q --spider --timeout=5 https://google.com 2>/dev/null
}

# Main loop — restarts Chromium whenever connectivity state changes or it crashes
while true; do
    if check_internet; then
        CURRENT_URL="$SLIDES_URL"
    else
        CURRENT_URL="$FALLBACK_URL"
    fi

    # Launch Chromium
    chromium \
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
        "$CURRENT_URL" &

    CHROMIUM_PID=$!

    # Watchdog — checks connectivity every 30 seconds
    # If state changes, kills Chromium so the loop relaunches with the right URL
    while kill -0 $CHROMIUM_PID 2>/dev/null; do
        sleep 30
        if check_internet; then
            NEW_URL="$SLIDES_URL"
        else
            NEW_URL="$FALLBACK_URL"
        fi
        if [ "$NEW_URL" != "$CURRENT_URL" ]; then
            echo "Connectivity changed — switching to $NEW_URL"
            kill $CHROMIUM_PID 2>/dev/null
            break
        fi
    done

    wait $CHROMIUM_PID 2>/dev/null
    sleep 2
done
