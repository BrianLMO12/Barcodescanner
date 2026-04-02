import { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function PhoneScanner() {
  const [peerId, setPeerId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState('');
  const [scanHistory, setScanHistory] = useState([]);
  const [showPairScanner, setShowPairScanner] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const peerRef = useRef(null);
  const connRef = useRef(null);
  const scannerRef = useRef(null);
  const qrScannerRef = useRef(null);
  const audioRef = useRef(null);

  const isSecureContext =
    window.location.protocol === 'https:' ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';

  // Initialize Peer
  useEffect(() => {
    const peer = new Peer();

    peer.on('open', (id) => {
      setPeerId(id);
    });

    peerRef.current = peer;

    return () => {
      if (connRef.current) connRef.current.close();
      stopScanner();
      peer.destroy();
    };
  }, []);

  useEffect(() => {
    if (isConnected) {
      if (!isSecureContext) {
        setCameraError(
          'Camera access requires HTTPS or localhost. Use a secure URL or deploy the app to a secure host.'
        );
        return;
      }
      setCameraError('');
      startScanner();
    } else {
      stopScanner();
      setCameraError('');
    }
  }, [isConnected]);

  useEffect(() => {
    if (!showPairScanner || qrScannerRef.current) return;

    const scanner = new Html5QrcodeScanner(
      'qr_pair_scanner',
      {
        fps: 5,
        qrbox: { width: 250, height: 250 },
      },
      false
    );

    scanner.render(
      (decodedText) => {
        setTargetId(decodedText);
        scanner.stop();
        qrScannerRef.current = null;
        setShowPairScanner(false);
      },
      () => { }
    );

    qrScannerRef.current = scanner;

    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop().catch(() => { });
        qrScannerRef.current = null;
      }
    };
  }, [showPairScanner]);

  // Connect to PC
  const handleConnect = () => {
    if (!targetId.trim() || !peerRef.current) {
      alert('Please enter a valid Peer ID');
      return;
    }

    const conn = peerRef.current.connect(targetId);

    conn.on('open', () => {
      connRef.current = conn;
      setIsConnected(true);
      setTargetId('');
    });

    conn.on('error', (err) => {
      alert('Connection error: ' + err.type);
      setIsConnected(false);
    });

    conn.on('close', () => {
      setIsConnected(false);
      stopScanner();
    });
  };

  // Start barcode scanner
  const startScanner = () => {
    if (scannerRef.current) return;

    const scanner = new Html5QrcodeScanner(
      'qr_scanner',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        disableFlip: false,
      },
      false
    );

    scanner.render(
      (decodedText) => {
        setLastScannedCode(decodedText);
        setScanHistory((prev) => [
          {
            id: Date.now(),
            value: decodedText,
            timestamp: new Date().toLocaleTimeString(),
          },
          ...prev,
        ]);

        if (connRef.current) {
          connRef.current.send(decodedText);
        }

        playBeep();
        flashScreen();
      },
      (errorMessage) => {
        // Ignore scanning errors
      }
    );

    scannerRef.current = scanner;
    setScannerActive(true);
  };

  // Stop barcode scanner
  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current
        .stop()
        .then(() => {
          scannerRef.current = null;
          setScannerActive(false);
        })
        .catch(() => {
          scannerRef.current = null;
          setScannerActive(false);
        });
    }
  };

  // Play beep sound on successful scan
  const playBeep = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.1
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  // Flash screen on successful scan
  const flashScreen = () => {
    const flash = document.createElement('div');
    flash.className =
      'fixed top-0 left-0 w-full h-full bg-green-400 opacity-50 pointer-events-none';
    flash.style.zIndex = '9999';
    document.body.appendChild(flash);

    setTimeout(() => {
      flash.remove();
    }, 150);
  };

  // QR code scanner for pairing
  const startQRScanner = () => {
    if (!isSecureContext) {
      setCameraError(
        'QR pairing requires HTTPS or localhost. Use a secure URL or deploy to a secure host.'
      );
      return;
    }
    if (qrScannerRef.current) return;
    setCameraError('');
    setShowPairScanner(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Phone Scanner
          </h1>
          <p className="text-gray-600 text-sm">Point camera at barcodes</p>
        </div>

        {!isConnected ? (
          // Connection Setup
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                PC Peer ID
              </label>
              <input
                type="text"
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                placeholder="Enter PC Peer ID"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleConnect()}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleConnect}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Connect
              </button>
              <button
                onClick={startQRScanner}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Scan QR Code
              </button>
            </div>

            {showPairScanner && (
              <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                <div id="qr_pair_scanner"></div>
              </div>
            )}

            {cameraError && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-2 text-sm text-yellow-700">
                {cameraError}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="bg-green-50 border-2 border-green-400 rounded-lg p-3 mb-4 text-center">
              <p className="text-green-700 font-semibold text-sm">
                ✓ Connected to PC
              </p>
            </div>

            {/* Scanner */}
            <div className="border-4 border-blue-500 rounded-lg overflow-hidden mb-4">
              <div id="qr_scanner" style={{ width: '100%' }}></div>
              {!scannerActive && (
                <div className="p-4 text-center text-sm text-gray-500 bg-blue-50">
                  Starting camera...
                </div>
              )}
            </div>

            {/* Last Scan Display */}
            {lastScannedCode && (
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4 mb-4">
                <p className="text-xs text-gray-600 mb-1">Last Scan:</p>
                <p className="text-lg font-mono font-bold text-gray-800 break-all">
                  {lastScannedCode}
                </p>
              </div>
            )}

            {/* Scan History */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Scan History</h3>
              {scanHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-4 text-sm">
                  Scans will appear here
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {scanHistory.map((scan) => (
                    <div
                      key={scan.id}
                      className="bg-gray-50 p-2 rounded text-xs"
                    >
                      <p className="font-mono text-gray-800 break-all">
                        {scan.value}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        {scan.timestamp}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Disconnect Button */}
            <button
              onClick={() => {
                connRef.current?.close();
                setIsConnected(false);
                stopScanner();
              }}
              className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Disconnect
            </button>
          </>
        )}
      </div>
    </div>
  );
}
