# Barcode Scanner - Tetherless WebRTC Application

A complete React + Vite single-page application for scanning barcodes from a phone and displaying them on a PC in real-time using WebRTC peer-to-peer communication.

## Features

- **Role-based UI**: Select between PC (Receiver) or Phone (Scanner) on startup
- **Peer-to-peer connection**: Uses PeerJS for WebRTC communication without a backend
- **QR code pairing**: Generate and display QR codes for easy pairing
- **Real-time barcode scanning**: Scan barcodes on phone and see them instantly on PC
- **Scan feedback**: Audio beep and green flash on successful scan
- **Responsive design**: Built with Tailwind CSS for mobile and desktop
- **No backend required**: Fully frontend-based solution

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **PeerJS** - WebRTC abstraction for P2P communication
- **html5-qrcode** - Barcode and QR code scanning
- **qrcode.react** - QR code generation

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   The app will open at `http://localhost:3000`

3. **Build for production:**
   ```bash
   npm run build
   ```

## Usage

### Setup Steps

1. **On PC:**
   - Open the app in a web browser
   - Click "I am the PC (Receiver)"
   - You'll see a QR code on the screen

2. **On Phone:**
   - Open the same app URL on your smartphone
   - Click "I am the Phone (Scanner)"
   - Either:
     - Manually type the PC's Peer ID shown on the PC screen, OR
     - Click "Scan QR Code" and scan the QR code displayed on the PC
   - Click "Connect"

3. **Scanning:**
   - Once connected, the phone will activate the camera
   - Point the phone camera at barcodes to scan
   - Scans appear instantly on the PC screen
   - Each scan produces a beep and green flash on the phone

## Important Notes

### HTTPS / Localhost Requirement

**`html5-qrcode` requires HTTPS or localhost to access device camera**

- During development with `npm run dev`, the app runs on `localhost:3000` ✓
- For production:
  - Deploy to an HTTPS URL, OR
  - Use localhost only for testing
  - The browser will deny camera access on HTTP URLs
  - Self-signed certificates work but may show security warnings

### How to Test on Local Network

To test on your local network (PC and phone on the same WiFi):

1. Find your PC's local IP address (run `ipconfig` on Windows, `ifconfig` on Mac/Linux)
2. Start dev server: `npm run dev`
3. On phone, navigate to: `http://<YOUR_PC_IP>:3000`

> Note: Camera access may require localhost or HTTPS. Test localhost first, or use HTTPS proxy.

## Project Structure

```
src/
├── App.jsx                 # Main component with role selection
├── main.jsx               # React entry point
├── index.css              # Tailwind styles
└── components/
    ├── PCReceiver.jsx     # PC receiver component
    └── PhoneScanner.jsx   # Phone scanner component
```

## File Flow

- **App.jsx**: Renders role selection or chosen component
- **PCReceiver.jsx**: Handles Peer server, displays QR code, receives barcodes
- **PhoneScanner.jsx**: Connects to PC Peer, scans codes, sends data

## Cleanup & Edge Cases

The app properly handles:
- **Connection cleanup**: Closes connections when components unmount
- **Camera stream cleanup**: Stops html5-qrcode scanner when disconnecting
- **Error handling**: Network errors and camera access denials
- **Reconnection**: Ability to disconnect and pair with a new PC

## Troubleshooting

**Camera not working:**
- Ensure you're on `localhost` or `HTTPS`
- Check browser permissions (Settings > Privacy & Security > Camera)
- Try a different browser
- Refresh the page

**Connection failed:**
- Ensure both devices can reach the WebRTC signaling server (PeerJS Cloud)
- Check they're on the same network or both have internet
- Verify the Peer ID was entered correctly

**Barcodes not scanning:**
- Ensure good lighting and barcode visibility
- Keep the barcode in the center of the camera view
- Try different barcode formats (code128, QR codes, etc.)

## Future Enhancements

- Add barcode filtering/auto-clear after timeout
- Export scanned barcodes to CSV
- Multiple phone connections to one PC
- Custom STUN/TURN servers for better connectivity
- Barcode history persistence with localStorage

## License

MIT
