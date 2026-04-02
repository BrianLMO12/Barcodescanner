# Installation & Setup

## System Requirements

- **Node.js**: v14.0 or higher
- **npm**: v6.0 or higher  
- **OS**: Windows, macOS, or Linux
- **Browser**: Modern browser with WebRTC support (Chrome, Firefox, Edge, Safari)

## Installation Steps

### Step 1: Navigate to Project Directory
```bash
cd c:\xampp\htdocs\Barcodescanner
```

### Step 2: Install Dependencies
```bash
npm install --legacy-peer-deps
```

> **Note**: The `--legacy-peer-deps` flag is required due to `qrcode.react` package compatibility with React 18. If you forget it, you'll see a peer dependency warning—just run the command again with the flag.

### Step 3: Verify Installation
Check that the `node_modules/` folder was created and contains packages.

### Step 4: Start Development Server
```bash
npm run dev
```

The app will automatically open at `http://localhost:3000`

---

## Deployment Steps

### Build for Production
```bash
npm run build
```

This creates an optimized `dist/` folder with your static files.

### Deploy to Hosting Services

**Option A: Vercel (Recommended for Vite projects)**
```bash
npm install -g vercel
vercel
```

**Option B: Netlify**
- Connect your GitHub/GitLab repo
- Set build command: `npm run build --legacy-peer-deps`
- Set publish directory: `dist`

**Option C: Traditional Hosting (Apache, Nginx, etc.)**
- Upload contents of `dist/` folder to your web server
- Ensure `index.html` is served for all routes (for SPA)

### Important for Deployment
⚠️ **html5-qrcode requires HTTPS or localhost**

- Ensure your hosting domain uses HTTPS
- Camera permissions will only work on secure connections
- Self-signed certificates work but may show browser warnings

---

## Troubleshooting Installation Issues

### Issue: `npm: command not found`
**Solution**: Install Node.js from https://nodejs.org/

### Issue: `ERESOLVE unable to resolve dependency tree`
**Solution**: Use the legacy-peer-deps flag:
```bash
npm install --legacy-peer-deps
```

### Issue: Port 3000 already in use
**Solution**: Kill the process using port 3000 or use different port:
```bash
# Change port in vite.config.js (server.port)
npm run dev -- --port 3001
```

### Issue: Camera not working
**Solutions**:
1. Check if on `localhost` or HTTPS (camera requires this)
2. Grant camera permissions in browser settings
3. Check if another app is using the camera
4. Try a different browser
5. Refresh the page and grant permissions again

### Issue: Connection fails between devices
**Solutions**:
1. Verify both devices are on the same network
2. Check firewall isn't blocking connection
3. Verify peer IDs are entered correctly
4. Try on localhost first (same device, different tabs)
5. Check browser console for error messages (F12)

### Issue: Barcode scanning not working
**Solutions**:
1. Test with QR codes first (easier to detect)
2. Ensure adequate lighting
3. Keep barcode in the scanning region
4. Try different barcode formats
5. Check camera preview is visible
6. Grant persistent camera permissions

---

## Development Commands

```bash
npm run dev        # Start development server with hot reload
npm run build      # Build optimized production bundle
npm run preview    # Preview production build locally
```

---

## File Structure Reference

```
project/
├── src/
│   ├── App.jsx                 # Main component
│   ├── main.jsx                # Entry point
│   ├── index.css               # Global styles
│   └── components/
│       ├── PCReceiver.jsx      # PC receiver component
│       └── PhoneScanner.jsx    # Scanner component
├── index.html                  # HTML template
├── package.json                # Dependencies config
├── vite.config.js              # Vite config
├── tailwind.config.js          # Tailwind CSS config
├── postcss.config.js           # PostCSS config
└── dist/                       # Production build (after npm run build)
```

---

## Environment Configuration

Create `.env.local` for environment-specific settings (if needed in future):

```env
# Development only
VITE_DEBUG=true
```

---

## Getting Help

- Check browser console for errors: **F12** → **Console** tab
- Look at network errors: **F12** → **Network** tab
- Check if camera is accessible: **F12** → **Console** and test:
  ```javascript
  navigator.mediaDevices.getUserMedia({ video: true })
  ```

---

## Next Steps

1. Run `npm run dev` to start the development server
2. Open two browser windows or tabs
3. One as PC Receiver, one as Phone Scanner
4. Test the QR code pairing and barcode scanning

For detailed usage instructions, see **QUICK_START.md**
