import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import DoctorPage from './pages/DoctorPage';
import PatientPage from './pages/PatientPage';
import Home from './pages/Home';
import Navbar from './components/Navbar';

// Import ToastContainer and CSS
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [role, setRole] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role={role} setRole={setRole} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctor" element={<DoctorPage />} />
          <Route path="/patient" element={<PatientPage />} />
        </Routes>
      </main>

      {/* ToastContainer displays all toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000} // Close after 3 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
