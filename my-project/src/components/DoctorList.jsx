import { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Leaflet marker fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

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
    setDoctors([]);

    try {
      // First get coordinates from search term
      const geoResponse = await axios.get(
        'https://nominatim.openstreetmap.org/search',
        {
          params: {
            q: searchTerm,
            format: 'json',
            limit: 1,
          },
        }
      );

      if (!geoResponse.data?.length) {
        throw new Error('Location not found. Try a more specific address.');
      }

      const { lat, lon } = geoResponse.data[0];
      const location = [parseFloat(lat), parseFloat(lon)];
      setSearchLocation(location);

      // Then search for nearby doctors
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/doctors/nearby`,
        {
          params: {
            lat: location[0],
            lng: location[1],
            maxDistance: 10000, 
          },
        }
      );

      if (!response.data?.data?.length) {
        toast.info('No doctors found in this area');
      } else {
        setDoctors(response.data.data);
      }
    } catch (err) {
      console.error('Search error:', err);
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
                placeholder="e.g., Doctors in Guntur"
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
              <MapContainer 
                center={searchLocation} 
                zoom={13} 
                className="h-full"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                <Marker position={searchLocation}>
                  <Popup>Your Location</Popup>
                </Marker>
                {doctors.map((doctor) => (
                  <Marker
                    key={doctor._id}
                    position={[
                      doctor.location.coordinates[1],
                      doctor.location.coordinates[0],
                    ]}
                  >
                    <Popup>
                      <div className="font-sans">
                        <h3 className="font-bold">{doctor.name}</h3>
                        <p className="text-gray-700">{doctor.specialty}</p>
                        <p className="text-sm">{doctor.address}</p>
                        {doctor.distance && (
                          <p className="text-xs text-gray-500">
                            {Math.round(doctor.distance / 100) / 10} km away
                          </p>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          )}

          <div className="space-y-4">
            {doctors.map((doctor) => (
              <div
                key={doctor._id}
                className="border p-4 rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold">{doctor.name}</h3>
                <p className="text-gray-600">{doctor.specialty}</p>
                <p className="text-gray-700">{doctor.address}</p>
                {doctor.distance && (
                  <p className="text-sm text-gray-500">
                    {Math.round(doctor.distance / 100) / 10} km away
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