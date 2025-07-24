// src/pages/Home.jsx
import React from 'react';

const Home = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold mb-4">Welcome to Doctor-Patient Platform</h1>
      <p className="text-xl mb-8">Please select your role above</p>

      <div className="flex justify-center">
        <video
          src="/Location.mp4"
          width="640"
          height="360"
          autoPlay
          muted
          loop
          playsInline
          className="rounded-lg shadow-lg pointer-events-none"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default Home;
