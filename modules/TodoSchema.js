import Joi from "joi";

export default Joi.object({
        rawid: Joi.number().integer().positive().required(),
        title: Joi.string().required(),
        content: Joi.string().required(),
        dueDate: Joi.number().required(),
        state: Joi.string().required()
})