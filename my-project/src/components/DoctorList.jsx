import { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Leaflet default marker fix
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setError('Please enter a location');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const geoResponse = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: searchTerm,
          format: 'json',
          limit: 1,
          addressdetails: 1,
        },
      });

      if (!geoResponse.data || geoResponse.data.length === 0) {
        throw new Error('Location not found. Try a more specific address.');
      }

      const { lat, lon } = geoResponse.data[0];
      const location = [parseFloat(lat), parseFloat(lon)];
      setSearchLocation(location);

      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/doctors/nearby`, {
        params: {
          lat: location[0],
          lng: location[1],
          maxDistance: 10000,
        },
      });

      if (!response.data || !response.data.success || !Array.isArray(response.data.data)) {
        throw new Error('No doctors found in this area');
      }

      setDoctors(response.data.data);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-fixed bg-center bg-cover"
      style={{
        backgroundImage: "url('/DoctorLocation.avif')",
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="bg-white bg-opacity-90 max-w-4xl mx-auto p-6 rounded shadow mt-6">
        <h2 className="text-2xl font-bold mb-4">Find Doctors Near You</h2>

        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g., Doctors in Guntur"
              className="flex-grow p-2 border rounded-l"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {searchLocation && (
          <div className="mb-6 h-96">
            <MapContainer center={searchLocation} zoom={13} className="h-full z-10">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <Marker position={searchLocation}>
                <Popup>Search Location</Popup>
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
                    <div>
                      <h3 className="font-bold">{doctor.name}</h3>
                      <p>{doctor.specialty}</p>
                      <p>{doctor.address}</p>
                      {doctor.distance && (
                        <p>{Math.round(doctor.distance / 100) / 10} km away</p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}

        <div className="space-y-4">
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <div
                key={doctor._id}
                className="border p-4 rounded shadow hover:bg-gray-50 bg-white bg-opacity-90"
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
            ))
          ) : (
            searchLocation &&
            !loading &&
            !error && (
              <p className="text-gray-500 text-center py-8">
                No doctors found in this area
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorList;
