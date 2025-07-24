const Doctor = require('../models/Doctor');

exports.addDoctor = async (req, res) => {
  try {
    const { name, specialty, address, lat, lng } = req.body;

    if (!name || !specialty || !address || !lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
        data: null
      });
    }

    const doctor = new Doctor({
      name,
      specialty,
      address,
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)]
      }
    });

    await doctor.save();

    res.status(201).json({
      success: true,
      message: 'Doctor added successfully',
      data: doctor
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      data: null
    });
  }
};

exports.getDoctorsNearLocation = async (req, res) => {
  try {
    const { lat, lng, maxDistance = 10000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required',
        data: []
      });
    }

    const doctors = await Doctor.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          distanceField: 'distance',
          maxDistance: parseFloat(maxDistance),
          spherical: true
        }
      },
      {
        $project: {
          distance: 0 // ✅ this hides distance from response
        }
      }
    ]);

    if (doctors.length === 0) {
      return res.json({
        success: true,
        message: '✅ Clinic added successfully! No doctors found in this area',
        data: []
      });
    }

    res.status(200).json({
      success: true,
      message: 'Doctors found',
      data: doctors
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({
      success: false,
      message: 'Error searching for doctors',
      data: []
    });
  }
};
