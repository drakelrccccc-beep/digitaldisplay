# Signage Display v2

Fullscreen Google Slides kiosk for Raspberry Pi. One bash script, one systemd service. No Node.js, no Python, no pip.

## Quick start

```bash
git clone <repo> ~/signage
cd ~/signage
bash install.sh
```

Edit `~/signage/config.sh` with your published Slides URL, then:

```bash
sudo systemctl restart signage
```

## How to publish your Google Slides

1. Open your presentation in Google Slides
2. File → Share → Publish to web
3. Set your preferred auto-advance timing
4. Click Publish → copy the URL
5. Paste it into `~/signage/config.sh`

## How it works

Chromium opens the published Slides URL in fullscreen kiosk mode. Google handles slide rendering, transitions, and auto-advance. systemd restarts Chromium if it crashes or after a power cut. That's the whole app.

## Changing the URL

```bash
nano ~/signage/config.sh
sudo systemctl restart signage
```

## Useful commands

| Command | Description |
|---|---|
| `sudo systemctl status signage` | Check if it's running |
| `journalctl -u signage -f` | Watch live logs |
| `sudo systemctl restart signage` | Restart |
| `sudo systemctl stop signage` | Stop |

## Troubleshooting

**Screen is black after boot** — Wait 30 seconds for Chromium to load. If it stays black: `sudo systemctl status signage`

**Browser shows restore session prompt** — Restart: `sudo systemctl restart signage` (the startup script cleans the crash flag automatically on next start)

**Screen goes to sleep** — Run `xset s off -dpms`

**Cursor is visible** — Check that unclutter is installed: `sudo apt install unclutter`

## Why so simple

v1 used Node.js + Puppeteer (200+ packages) to do what Chromium does natively. This version is 4 files totaling ~60 lines of bash.
