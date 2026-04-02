import { useState } from 'react';
import PCReceiver from './components/PCReceiver';
import PhoneScanner from './components/PhoneScanner';

export default function App() {
  const [role, setRole] = useState(null);

  if (role === 'pc') {
    return <PCReceiver />;
  }

  if (role === 'phone') {
    return <PhoneScanner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Barcode Scanner
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Select your role to get started
        </p>

        <div className="space-y-4">
          <button
            onClick={() => setRole('pc')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105"
          >
            I am the PC (Receiver)
          </button>

          <button
            onClick={() => setRole('phone')}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105"
          >
            I am the Phone (Scanner)
          </button>
        </div>
      </div>
    </div>
  );
}
