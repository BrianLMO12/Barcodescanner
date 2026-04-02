# Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+) and npm installed
- Two devices (PC and Smartphone) OR two browser tabs/windows

### Installation & Running

```bash
# 1. Navigate to the project directory
cd c:\xampp\htdocs\Barcodescanner

# 2. Install dependencies (if not already done)
npm install --legacy-peer-deps

# 3. Start the development server
npm run dev
```

The app will start at `http://localhost:3000` and open automatically.

---

## 📱 How to Test

### Scenario 1: Same PC, Two Browser Tabs/Windows
1. Open `http://localhost:3000` in Tab 1 → Select "I am the PC (Receiver)"
2. Open `http://localhost:3000` in Tab 2 → Select "I am the Phone (Scanner)"
3. In Tab 2, scan the QR code from Tab 1 (or manually copy the Peer ID)
4. Test scanning with any barcode or QR code

### Scenario 2: PC + Smartphone on Same Network
1. Find your PC's local IP: Run `ipconfig` in Command Prompt (look for IPv4 Address)
2. On PC: Start the server with `npm run dev`
3. On Phone: Open `http://<YOUR_PC_IP>:3000`
4. Phone selects "I am the Phone (Scanner)", scans PC's QR code
5. Try real barcode scanning

### Scenario 3: Testing Without Real Barcodes
- Use online QR code generators to create barcodes
- Print them out or display them on another screen
- Point the phone camera at them to test

---

## ⚙️ Available Commands

```bash
npm run dev       # Start development server on localhost:3000
npm run build     # Build for production (creates dist/ folder)
npm run preview   # Preview production build locally
```

---

## 🔧 Troubleshooting

**Camera access denied on phone:**
- Ensure you're accessing via `localhost` or `HTTPS`
- Check phone's camera permissions in settings
- If testing on local network, consider using HTTPS

**Can't connect between devices:**
- Verify both are on the same WiFi network
- Check PC's local IP address
- Make sure the Peer ID is entered correctly

**Barcodes won't scan:**
- Test with QR codes first (they're easier to detect)
- Ensure good lighting conditions
- Keep the barcode within the highlighted scanning area

---

## 📦 Project Files Overview

```
Barcodescanner/
├── src/
│   ├── App.jsx              # Role selection & main routing
│   ├── main.jsx             # React entry point
│   ├── index.css            # Tailwind styles
│   └── components/
│       ├── PCReceiver.jsx   # PC display & QR code generation
│       └── PhoneScanner.jsx # Camera & barcode scanning
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS with Tailwind
├── package.json             # Dependencies & scripts
└── README.md                # Full documentation
```

---

## 🎯 Key Features Implemented

✅ Role-based UI (PC Receiver vs Phone Scanner)  
✅ PeerJS WebRTC connection  
✅ QR code generation & scanning for pairing  
✅ Real-time barcode scanning  
✅ Audio beep + visual feedback on successful scan  
✅ Scan history display  
✅ Responsive Tailwind CSS design  
✅ Proper cleanup on disconnect  
✅ No backend required  

---

## 📝 Notes

- Install dependencies with `--legacy-peer-deps` flag due to qrcode.react compatibility
- Camera requires HTTPS or localhost
- PeerJS uses browser's WebRTC for P2P communication
- All data is peer-to-peer, nothing stored on servers
- Works on any modern browser with WebRTC support

Enjoy scanning! 📸✨
