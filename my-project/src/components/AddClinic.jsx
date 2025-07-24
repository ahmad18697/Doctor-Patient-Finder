import { useState } from 'react';
import axios from 'axios';
import MapComponent from './MapComponent';

const AddClinic = () => {
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    address: '',
  });
  const [position, setPosition] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!position) {
      setError('⚠️ Please select a location on the map.');
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        lat: position.lat,
        lng: position.lng,
      };

      await axios.post('/api/doctors', dataToSend); // Use proxy
      setMessage('✅ Clinic added successfully!');
      setFormData({ name: '', specialty: '', address: '' });
      setPosition(null);
    } catch (err) {
      setError('❌ Error adding clinic: ' + err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add Your Clinic</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Specialty Input */}
        <div>
          <label className="block mb-1">Specialty</label>
          <input
            type="text"
            name="specialty"
            value={formData.specialty}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Address Input */}
        <div>
          <label className="block mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Map Location */}
        <div className="h-96">
          <p className="mb-2 text-sm text-gray-600">Click on the map to set your clinic location</p>
          <MapComponent position={position} setPosition={setPosition} />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
        >
          Save Clinic
        </button>
      </form>

      {/* Feedback Messages */}
      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default AddClinic;
