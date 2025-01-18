import React, { useState } from 'react';

function App() {
  // Function to format date as DD/MM/YYYY
  const getCurrentDateFormatted = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const [values, setValues] = useState({
    date: getCurrentDateFormatted(), // Automatically set the current date
    fb: 0,
    fbExtra: 0,
    gb: 0,
    gbExtra: 0,
    ch: 0,
    chExtra: 0,
    dl: 0,
    dlExtra: 0,
    picheKaLena: 0,
    picheKaDena: 0,
    jama: 0,
    diya: 0,
  });

  const [selectedOption, setSelectedOption] = useState('picheKaLena');
  const [jamaOrDiya, setJamaOrDiya] = useState('jama'); // Default to "Jama"
  const [title, setTitle] = useState('Satta King'); // State for editable title

  const handleChange = (field: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
    setValues(prev => ({ ...prev, [field]: value }));
  };

  // Calculate totals
  const kaamTotal = values.fb + values.gb + values.ch + values.dl;

  // Round 10% (`k`) to the nearest multiple of 5
  const k = Math.round((kaamTotal * 0.1) / 5) * 5;

  const extraTotal = (values.fbExtra + values.gbExtra + values.chExtra + values.dlExtra) * 90;
  const netKaam = kaamTotal - k - extraTotal; // Net amount after deductions

  // Calculate final total including Piche Ka Lena/Dena and Jama/Diya
  const getFinalLenaDena = () => {
    let finalAmount = netKaam;

    // Add/Subtract Piche Ka Lena/Dena
    finalAmount += values.picheKaLena;
    finalAmount -= values.picheKaDena;

    // Add/Subtract Jama/Diya
    finalAmount -= values.jama;
    finalAmount += values.diya;

    return finalAmount;
  };

  // Input styles
  const inputClass = 'w-full bg-transparent font-semibold text-lg focus:outline-none focus:ring-1 focus:ring-indigo-300 rounded px-1';
  const extraInputClass = 'w-16 ml-4 text-sm bg-gray-100 border border-gray-200 rounded px-2 py-1';

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
      <div id="preview-area" className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8">
        {/* Header */}
        <div className="flex items-center justify-evenly mb-4">
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)} // Handle title change
              className="text-xl font-bold text-gray-800 bg-transparent underline border-none focus:outline-none"
            />
          </div>
          <div className="text-left -ml-40 md:-ml-0">
            <p className="text-sm text-gray-600">Date</p>
            <input
              type="text"
              value={values.date}
              readOnly
              className="text-left bg-transparent font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-300 rounded px-1"
            />
          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-2 mb-2 p-2 bg-gray-50 rounded-xl">
          {['fb', 'gb', 'ch', 'dl'].map((field, index) => (
            <div key={index} className="flex items-center justify-between">
              <p className="text-lg font-bold text-gray-600">{field.toUpperCase()}</p>
              <div className="flex items-center ml-10 md:ml-0">
                <input
                  type="number"
                  value={values[field as keyof typeof values]}
                  onChange={handleChange(field as keyof typeof values)}
                  className={inputClass}
                />
                <input
                  type="number"
                  value={values[`${field}Extra` as keyof typeof values]}
                  onChange={handleChange(`${field}Extra` as keyof typeof values)}
                  className={extraInputClass}
                  placeholder="Parchi"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-1">
          {/* Kaam Summary */}
          <div className="border-b pb-2">
            <div className="flex justify-between items-center mb-1">
              <p className="font-medium text-gray-800">Kaam</p>
              <p className="font-semibold text-lg">{kaamTotal.toLocaleString()}</p>
            </div>
            <div className="space-y-1 pl-4">
              <div className="flex justify-between text-red-600">
                <p>K (10%)</p>
                <p className="font-semibold">{k.toLocaleString()}</p>
              </div>
              <div className="flex justify-between text-red-600">
                <p>Aaya</p>
                <p className="font-semibold">{extraTotal.toLocaleString()}</p>
              </div>
              <div className="flex justify-between font-bold text-blue-700 text-lg">
                <p>Aaj {netKaam < 0 ? 'Dena' : 'Lena'}</p>
                <p className="font-semibold">{Math.abs(netKaam).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Piche Ka Lena/Dena */}
          <div className="border-b pb-2">
            <div className="mb-2">
              <label className="font-medium text-gray-800">Select</label>
              <select
                value={selectedOption}
                onChange={e => setSelectedOption(e.target.value)}
                className="w-full text-sm bg-gray-100 border border-gray-200 rounded px-2 py-1"
              >
                <option value="picheKaLena">Piche Ka Lena</option>
                <option value="picheKaDena">Piche Ka Dena</option>
              </select>
            </div>

            {selectedOption === 'picheKaLena' && (
              <div className="flex justify-between items-center">
                <p className="font-medium text-gray-800">Piche Ka Lena</p>
                <input
                  type="number"
                  value={values.picheKaLena}
                  onChange={handleChange('picheKaLena')}
                  className="w-32 text-sm bg-gray-100 border border-gray-200 rounded px-2 py-1"
                />
              </div>
            )}

            {selectedOption === 'picheKaDena' && (
              <div className="flex justify-between items-center">
                <p className="font-medium text-gray-800">Piche Ka Dena</p>
                <input
                  type="number"
                  value={values.picheKaDena}
                  onChange={handleChange('picheKaDena')}
                  className="w-32 text-sm bg-gray-100 border border-gray-200 rounded px-2 py-1"
                />
              </div>
            )}
          </div>

          {/* Jama/Diya */}
          <div className="border-b pb-2">
            <div className="mb-2">
              <label className="font-medium text-gray-800">Select</label>
              <select
                value={jamaOrDiya}
                onChange={e => setJamaOrDiya(e.target.value)}
                className="w-full text-sm bg-gray-100 border border-gray-200 rounded px-2 py-1"
              >
                <option value="jama">Jma</option>
                <option value="diya">Diya</option>
              </select>
            </div>

            {jamaOrDiya === 'jama' && (
              <div className="flex justify-between items-center">
                <p className="font-medium text-gray-800">Jma</p>
                <input
                  type="number"
                  value={values.jama}
                  onChange={handleChange('jama')}
                  className="w-32 text-sm bg-gray-100 border border-gray-200 rounded px-2 py-1"
                />
              </div>
            )}

            {jamaOrDiya === 'diya' && (
              <div className="flex justify-between items-center">
                <p className="font-medium text-gray-800">Diya</p>
                <input
                  type="number"
                  value={values.diya}
                  onChange={handleChange('diya')}
                  className="w-32 text-sm bg-gray-100 border border-gray-200 rounded px-2 py-1"
                />
              </div>
            )}
          </div>

          {/* Lena/Dena Summary */}
          <div className="bg-indigo-50 p-2 rounded-xl flex justify-between items-center">
            <p className="font-medium text-lg text-indigo-900">Final {getFinalLenaDena() < 0 ? 'Dena' : 'Lena'}</p>
            <p className="font-bold text-xl text-indigo-900">{Math.abs(getFinalLenaDena()).toLocaleString()}</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
