const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Doctor name is required'], trim: true, maxlength: 100 },
  specialty: { type: String, required: [true, 'Specialty is required'], enum: ['Cardiology', 'Dermatology', 'Pediatrics', 'General'] },
  address: { type: String, required: [true, 'Address is required'] },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { 
      type: [Number], 
      required: true,
      validate: {
        validator: (coords) => coords.length === 2 && coords[0] >= -180 && coords[0] <= 180 && coords[1] >= -90 && coords[1] <= 90,
        message: 'Invalid coordinates'
      }
    }
  }
}, { timestamps: true });

doctorSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Doctor', doctorSchema);