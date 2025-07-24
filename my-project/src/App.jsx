import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import DoctorPage from './pages/DoctorPage';
import PatientPage from './pages/PatientPage';
import Home from './pages/Home';
import Navbar from './components/Navbar';

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
    </div>
  );
}

export default App;
