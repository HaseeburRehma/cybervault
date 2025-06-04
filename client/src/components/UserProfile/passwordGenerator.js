import React, { useState } from 'react';

const PassGenerator = () => {
  const [length, setLength] = useState(16);
  const [numPasswords, setNumPasswords] = useState(15);
  const [results, setResults] = useState([]);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [specialChars, setSpecialChars] = useState(true);
const [copiedIndex, setCopiedIndex] = useState(null);  
  const makeid = () => {
    const shuffle = (v) => [...v].sort(() => Math.random() - 0.5).join('');
    let passwords = [];

    for (let k = 0; k < numPasswords; k++) {
      let characters = '';
      if (uppercase) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (lowercase) characters += 'abcdefghijklmnopqrstuvwxyz';
      if (numbers) characters += '0123456789';
      if (specialChars) characters += '!@#$%^&*()_+~|<>?|';

      let result = '';
      for (let i = 0; i < length; i++) {
        characters = shuffle(characters);
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      passwords.push(result);
    }
    setResults(passwords);
    setCopiedIndex(null);

  };
/** Copies a single password and briefly shows “Copied!” */
  const copyToClipboard = async (passwords, idx) => {
    try {
      await navigator.clipboard.writeText(passwords);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 1500); // hide after 1.5 s
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex">
          {/* Complexity Section */}
          <div className="md:w-1/3 p-6 bg-emerald--0 border-r border-gray-200">
            <h5 className="text-xl font-bold mb-6 text-center text-emerald-800">Complexity</h5>
            <ul className="space-y-4">
              <li className="flex items-center justify-between">
                <label className="text-gray-700">Uppercase Letters</label>
                <input type="checkbox" checked={uppercase} onChange={() => setUppercase(!uppercase)} className="form-checkbox" />
              </li>
              <li className="flex items-center justify-between">
                <label className="text-gray-700">Lowercase Letters</label>
                <input type="checkbox" checked={lowercase} onChange={() => setLowercase(!lowercase)} className="form-checkbox" />
              </li>
              <li className="flex items-center justify-between">
                <label className="text-gray-700">Numbers</label>
                <input type="checkbox" checked={numbers} onChange={() => setNumbers(!numbers)} className="form-checkbox" />
              </li>
              <li className="flex items-center justify-between">
                <label className="text-gray-700">Special Characters</label>
                <input type="checkbox" checked={specialChars} onChange={() => setSpecialChars(!specialChars)} className="form-checkbox" />
              </li>
              <li className="flex items-center justify-between">
                <label className="text-gray-700">Length</label>
                <input type="number" value={length} onChange={(e) => setLength(parseInt(e.target.value, 10))} className="form-input w-20" />
              </li>
              <li className="flex items-center justify-between">
                <label className="text-gray-700">Number of Passwords</label>
                <input type="number" value={numPasswords} onChange={(e) => setNumPasswords(parseInt(e.target.value, 10))} className="form-input w-20" />
              </li>
            </ul>
            <div className="text-center mt-6">
              <button onClick={makeid} className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition duration-300">Generate</button>
            </div>
          </div>

          {/* Results Section */}
          <div className="md:w-2/3 p-6">
            <h5 className="text-xl font-bold mb-6 text-center text-green-800">Results</h5>
            <div className="space-y-4">
              {results.length > 0 ? results.map((password, idx) => (
                <div key={idx} className="p-4 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-between">
                  <span className="text-sm text-gray-700 truncate">{password}</span>
                  <button
              onClick={() => copyToClipboard(password, idx)}
              className="text-emerald-500 hover:text-emerald-600 transition duration-300 focus:outline-none"
            >
              {copiedIndex === idx ? "Copied!" : "Copy"}
            </button>
                </div>
              )) : (
                <div className="p-4 bg-gray-100 text-center text-gray-500">No passwords generated yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassGenerator;
