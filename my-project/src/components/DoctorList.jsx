import { useState, lazy, Suspense } from 'react';
import axios from 'axios';
import { Marker, Popup } from 'react-leaflet';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const MapComponent = lazy(() => import('./MapComponent'));

const DoctorList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [searchLocation, setSearchLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      toast.error('Please enter a location');
      return;
    }

    setIsLoading(true);
    try {
      // Geocode search term
      const { data } = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: { q: searchTerm, format: 'json', limit: 1 },
      });
      if (!data.length) throw new Error('Location not found');

      const [lat, lng] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      setSearchLocation([lat, lng]);

      // Fetch nearby doctors
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/doctors/nearby`, {
        params: { latitude: lat, longitude: lng, maxDistance: 10000},
      });
      setDoctors(response.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Find Doctors Near You</h2>
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g., New York, USA"
                className="flex-grow p-2 border rounded"
                required
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                disabled={isLoading}
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {searchLocation && (
            <div className="mb-6 h-96 rounded-lg overflow-hidden">
              <Suspense fallback={<div className="h-full bg-gray-200 animate-pulse" />}>
                <MapComponent center={searchLocation} zoom={13}>
                  <Marker position={searchLocation}>
                    <Popup>Your Location</Popup>
                  </Marker>
                  {doctors.map((doctor) => (
                    <Marker
                      key={doctor._id}
                      position={[doctor.location.coordinates[1], doctor.location.coordinates[0]]} // latitude, longitude order
                    >
                      <Popup>
                        <div>
                          <h3 className="font-bold">{doctor.name}</h3>
                          <p>{doctor.specialty}</p>
                          <p className="text-sm">{doctor.address}</p>
                          {doctor.distance && (
                            <p className="text-xs text-gray-500">
                              {(doctor.distance).toFixed(1)} km away
                            </p>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapComponent>
              </Suspense>
            </div>
          )}

          <div className="space-y-4">
            {doctors.map((doctor) => (
              <div key={doctor._id} className="border p-4 rounded-lg hover:shadow-md">
                <h3 className="text-xl font-semibold">{doctor.name}</h3>
                <p className="text-gray-600">{doctor.specialty}</p>
                <p className="text-gray-700">{doctor.address}</p>
                {doctor.distance && (
                  <p className="text-sm text-gray-500">
                    {(doctor.distance).toFixed(1)} km away
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorList;
