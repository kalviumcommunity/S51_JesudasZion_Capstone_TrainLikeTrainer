const Joi = require('joi');

const loginValidationSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const validateLogin = (data) => {
    const { error, value } = loginValidationSchema.validate(data);
    if (error) {
        throw new Error(error.details[0].message);
    }
    return value;
};

module.exports = validateLogin;
