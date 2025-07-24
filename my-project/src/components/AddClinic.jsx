import { useState, lazy, Suspense } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const MapComponent = lazy(() => import('./MapComponent'));

const AddClinic = () => {
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    address: '',
  });
  const [position, setPosition] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!position) {
      toast.error('⚠️ Please select a location on the map.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/doctors`,
        {
          ...formData,
          location: {
            type: 'Point',
            coordinates: [position.lng, position.lat], // longitude first, latitude second
          },
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 201) {
        toast.success('✅ Clinic added successfully!');
        setFormData({ name: '', specialty: '', address: '' });
        setPosition(null);
      }
    } catch (err) {
      toast.error(`❌ Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add Your Clinic</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <div>
          <label className="block mb-1">Specialty</label>
          <select
            name="specialty"
            value={formData.specialty}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Specialty</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Dermatology">Dermatology</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="General">General</option>
          </select>
        </div>
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
        <div className="h-96">
          <p className="mb-2 text-sm text-gray-600">
            Click on the map to set your clinic location
          </p>
          <Suspense fallback={<div className="h-full bg-gray-200 animate-pulse" />}>
            <MapComponent position={position} setPosition={setPosition} zoom={12} />
          </Suspense>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isSubmitting ? 'Saving...' : 'Save Clinic'}
        </button>
      </form>
    </div>
  );
};

export default AddClinic;
