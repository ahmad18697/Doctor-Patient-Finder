const express = require('express');
const router = express.Router();
const { addDoctor, getDoctorsNearLocation } = require('../controllers/doctors');

router.post('/', addDoctor);
router.get('/nearby', getDoctorsNearLocation);

module.exports = router;
