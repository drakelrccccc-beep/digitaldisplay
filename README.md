# Digital Display - Google Slides Kiosk for Raspberry Pi

Display Google Slides presentations in fullscreen kiosk mode on Raspberry Pi. Perfect for digital signage, information displays, and automated presentations.

## Features

- 🖥️ **Fullscreen Kiosk Mode** - Auto-launches Chromium in kiosk mode
- 🔄 **Auto-Advance Slides** - Respects Google Slides timing settings
- 🚀 **Boot on Startup** - Systemd service starts display automatically
- 🔌 **Simple Configuration** - Just provide a Google Slides URL
- 🍓 **Raspberry Pi Optimized** - Tested on Pi 2 (32-bit), works on Pi 3/4/5
- 🛡️ **Auto-Recovery** - Restarts on crashes

## Requirements

- Raspberry Pi (2/3/4/5) with Raspberry Pi OS (Desktop version)
- Network connection
- Google Slides presentation with "Publish to web" enabled

## Quick Start

### 1. Prepare Your Google Slides

1. Open your presentation in Google Slides
2. Go to **File** → **Share** → **Publish to web**
3. Click **Publish** and copy the URL
4. (Optional) Set auto-advance timing: **File** → **Publish to web** → **Auto-advance slides**

### 2. Clone & Setup on Raspberry Pi

```bash
# Clone repository
git clone https://github.com/drakelrccccc-beep/digitaldisplay.git
cd digitaldisplay/digitaldisplay

# Run setup script (installs dependencies)
bash scripts/setup.sh

# Edit configuration and add your Google Slides URL
nano .env
```

### 3. Configure Environment

Edit `.env` file:
```bash
SLIDES_URL=https://docs.google.com/presentation/d/YOUR_PRESENTATION_ID/edit
```

### 4. Test the Application

```bash
npm start
```

The display should launch in fullscreen showing your slides.

### 5. Enable Auto-Start on Boot

```bash
# Install systemd service
sudo cp systemd/digitaldisplay.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable digitaldisplay.service
sudo systemctl start digitaldisplay.service

# Check status
sudo systemctl status digitaldisplay.service
```

### 6. Reboot and Verify

```bash
sudo reboot
```

Your slides should appear automatically after boot!

## Alternative: Deploy from Dev Machine via SSH

If you're developing on another machine, you can deploy to your Pi:

```bash
# From your dev machine
cd digitaldisplay/digitaldisplay

# Deploy (default: pi@raspberrypi.local)
bash scripts/deploy.sh

# Or specify custom host
PI_HOST=192.168.1.100 bash scripts/deploy.sh
```

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# Required
SLIDES_URL=https://docs.google.com/presentation/d/YOUR_ID/edit

# Optional (defaults shown)
CHROMIUM_PATH=/usr/bin/chromium-browser
```

### Changing Slides URL

```bash
# SSH to your Pi
ssh pi@raspberrypi.local

# Edit .env
cd digitaldisplay
nano .env

# Restart service
sudo systemctl restart digitaldisplay.service
```

## Troubleshooting

### Slides don't appear on boot

```bash
# Check service status
sudo systemctl status digitaldisplay.service

# View logs
sudo journalctl -u digitaldisplay.service -f

# Ensure DISPLAY variable is set
echo $DISPLAY  # Should show :0
```

### Display shows "Chrome is being controlled" banner

This is normal for Chromium automation. To hide it, the app uses `--disable-infobars` flag.

### Performance issues on Pi 2

The app is optimized for Pi 2 with:
- Disabled GPU acceleration
- Reduced memory usage
- Minimal background processes

If still slow, try:
```bash
# Reduce slide transition effects in Google Slides
# Use simpler slide designs
# Close other applications
```

### Screen blanking/screensaver activates

The setup script disables this, but you can manually disable:

```bash
# Disable screen blanking
xset s off -dpms

# Make permanent (add to autostart)
nano ~/.config/lxsession/LXDE-pi/autostart
# Add: @xset s off -dpms
```

### "Cannot find module" errors

```bash
# Reinstall dependencies
cd digitaldisplay
npm install
npm run build
```

## Project Structure

```
digitaldisplay/
├── src/
│   ├── index.ts              # Main entry point
│   ├── config/
│   │   └── index.ts          # Configuration loader
│   ├── display/
│   │   └── chromium.ts       # Chromium kiosk display
│   ├── services/
│   │   └── slides.ts         # Google Slides URL converter
│   └── types/
│       └── index.ts          # TypeScript interfaces
├── scripts/
│   ├── setup.sh              # Installation script
│   └── deploy.sh             # SSH deployment script
├── systemd/
│   └── digitaldisplay.service # Boot service config
├── .env.example              # Configuration template
├── package.json
└── tsconfig.json
```

## Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run in dev mode
npm run dev

# Clean build artifacts
npm run clean
```

## Service Management Commands

```bash
# Start service
sudo systemctl start digitaldisplay.service

# Stop service
sudo systemctl stop digitaldisplay.service

# Restart service
sudo systemctl restart digitaldisplay.service

# Check status
sudo systemctl status digitaldisplay.service

# View logs
sudo journalctl -u digitaldisplay.service -f

# Disable auto-start
sudo systemctl disable digitaldisplay.service
```

## Advanced Configuration

### Custom Chromium Path

If Chromium is installed in a different location:

```bash
# In .env
CHROMIUM_PATH=/usr/bin/chromium
```

### Multiple Displays (Future)

Currently supports one slide deck. For rotation between multiple decks, you can:
1. Create a combined presentation in Google Slides
2. Use a browser extension to rotate tabs
3. Modify the code to rotate URLs (PR welcome!)

## Contributing

Contributions welcome! Please open an issue or PR.

## License

MIT

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing issues for solutions

---

**Made for Raspberry Pi enthusiasts who want simple, reliable digital signage! 🍓📺**
