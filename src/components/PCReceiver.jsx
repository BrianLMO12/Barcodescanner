import { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';
import { QRCodeSVG } from 'qrcode.react';

export default function PCReceiver() {
  const [peerId, setPeerId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [barcodes, setBarcodes] = useState([]);
  const peerRef = useRef(null);
  const connRef = useRef(null);

  useEffect(() => {
    // Initialize Peer
    const peer = new Peer();

    peer.on('open', (id) => {
      setPeerId(id);
    });

    peer.on('connection', (conn) => {
      connRef.current = conn;

      const handleOpen = () => {
        setIsConnected(true);
        try {
          conn.send({ type: 'handshake', text: 'hello' });
        } catch (err) {
          console.warn('Failed to send handshake to phone', err);
        }
      };

      conn.on('open', handleOpen);
      if (conn.open) handleOpen();

      conn.on('data', (data) => {
        // ignore handshake messages from phone
        if (data && data.type === 'handshake') {
          console.debug('Received handshake from phone', data);
          return;
        }

        const value = typeof data === 'object' && data.value ? data.value : data;
        setBarcodes((prev) => [
          {
            id: Date.now(),
            value: value,
            timestamp: new Date().toLocaleTimeString(),
          },
          ...prev,
        ]);
      });

      conn.on('close', () => {
        setIsConnected(false);
        setBarcodes([]);
      });

      conn.on('error', (err) => {
        console.warn('Peer connection error (PC):', err);
      });
    });

    peerRef.current = peer;

    return () => {
      if (connRef.current) connRef.current.close();
      peer.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            PC Receiver
          </h1>
          <p className="text-gray-600">
            Scan this QR code with your phone or enter the code manually
          </p>
        </div>

        {/* QR Code Section */}
        {!isConnected && peerId && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Pair Your Phone
            </h2>
            <div className="flex justify-center mb-4">
              <div className="bg-white p-4 border-2 border-gray-200 rounded-lg">
                <QRCodeSVG value={peerId} size={256} level="H" includeMargin={true} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Or enter this code:</p>
              <code className="block bg-gray-100 p-3 rounded text-sm font-mono text-gray-800 break-all">
                {peerId}
              </code>
            </div>
          </div>
        )}

        {/* Connection Status */}
        {isConnected && (
          <div className="bg-green-50 border-2 border-green-400 rounded-lg p-4 mb-6 text-center">
            <p className="text-green-700 font-semibold">✓ Connected to Phone</p>
          </div>
        )}

        {/* Barcodes List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Scanned Barcodes
          </h2>

          {barcodes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              {isConnected
                ? 'Waiting for scans...'
                : 'Connect phone to receive barcodes'}
            </p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {barcodes.map((barcode) => (
                <div
                  key={barcode.id}
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex-1">
                    <p className="text-gray-800 font-mono text-lg break-all">
                      {barcode.value}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      {barcode.timestamp}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setBarcodes((prev) =>
                        prev.filter((b) => b.id !== barcode.id)
                      )
                    }
                    className="ml-4 text-red-500 hover:text-red-700 font-semibold"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
