const express = require('express');
const router = express.Router();
const { 
  addDoctor, 
  getNearbyDoctors 
} = require('../controllers/doctors');

// Simple, clean routes without parameters
router.post('/', addDoctor);
router.get('/nearby', getNearbyDoctors);

module.exports = router;