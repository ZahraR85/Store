import Joi from 'joi';

export const validateRegistration = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().pattern(/^[a-zA-Z]+$/).required(),
    family: Joi.string().pattern(/^[a-zA-Z]+$/).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\d{10,15}$/).required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  next();
};

export const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    identifier: Joi.string().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  next();
};
