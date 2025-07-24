const Doctor = require('../models/Doctor'); // Make sure this path is correct

// Add a new doctor
exports.addDoctor = async (req, res) => {
  try {
    const { name, specialty, address, location } = req.body;

    // Validation
    if (!name || !specialty || !address || !location || !location.coordinates) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required (name, specialty, address, location.coordinates)',
      });
    }

    const doctor = new Doctor({
      name,
      specialty,
      address,
      location: {
        type: 'Point',
        coordinates: location.coordinates, // [longitude, latitude]
      },
    });

    await doctor.save();

    res.status(201).json({
      success: true,
      message: 'Doctor added successfully',
      data: doctor,
    });
  } catch (error) {
    console.error('Error adding doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding doctor',
    });
  }
};

// Get nearby doctors
exports.getNearbyDoctors = async (req, res) => {
  try {
    const { longitude, latitude } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Longitude and latitude are required',
      });
    }

    const doctors = await Doctor.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: 5000, // 5km radius
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Nearby doctors fetched',
      data: doctors,
    });
  } catch (error) {
    console.error('Error fetching nearby doctors:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while finding nearby doctors',
    });
  }
};
