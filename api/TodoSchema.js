const Joi = require('joi')

module.exports = Joi.object({
        id: Joi.number().integer().positive().required(),
        title: Joi.string().required(),
        content: Joi.string().required(),
        dueDate: Joi.number().required(),
        status: Joi.number().required()
    })
