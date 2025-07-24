const Joi = require('joi');
const ApiError = require('../utils/apiError');

const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return next(new ApiError(400, error.details[0].message));
  }
  next();
};

const doctorSchema = Joi.object({
  name: Joi.string().required().max(100),
  specialty: Joi.string().required(),
  address: Joi.string().required(),
  lat: Joi.number().min(-90).max(90).required(),
  lng: Joi.number().min(-180).max(180).required()
});

const nearbyDoctorsSchema = Joi.object({
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  maxDistance: Joi.number().min(100).max(50000).default(10000)
});


module.exports = {
  validateRequest,
  doctorSchema,
  nearbyDoctorsSchema
};