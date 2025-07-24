// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ role, setRole }) => {
  const navigate = useNavigate();

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    navigate(`/${selectedRole}`);
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-semibold hover:text-gray-700">
              Doctor-Patient Platform
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleRoleSelect('doctor')}
              className={`px-3 py-2 rounded-md ${
                role === 'doctor'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Doctor
            </button>
            <button
              onClick={() => handleRoleSelect('patient')}
              className={`px-3 py-2 rounded-md ${
                role === 'patient'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Patient
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
