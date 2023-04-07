import Joi from "joi"

export default Joi.object({
    id: Joi.number().integer().positive().required,
    title: Joi.string().required,
    content: Joi.string().required,
    dueDate: Joi.date().required,
    status: Joi.number().required
})