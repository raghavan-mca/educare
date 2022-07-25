const Joi = require('joi')
const joi = require('joi')

module.exports = {
    batch_create: {
        body: joi.object({
            batch: joi.string().required(),
            department_id: joi.string().required(),
            year: joi.string().allow(null).optional(),
            user_id: joi.string().required(),
        })
    },
    batch_fetch: {
        query: joi.object({
            department_id: joi.string().optional(),
            focus_student: joi.number().optional(),
            _id: joi.string().optional(),
        })
    },
    batch_edit: {
        body: joi.object({
            batch: joi.string().required(),
            year: joi.string().allow(null).optional()
        })
    },
    batch_edit_params: {
        params: joi.object({
            id: joi.string().required(),
        })
    },
    batch_delete_params: {
        params: joi.object({
            id: joi.string().required(),
        })
    },
    batch_mass_transfer_params: {
        params: joi.object({
            id: joi.string().required(),
        })
    },
    batch_mass_transfer: {
        body: joi.object({
            field: joi.string().required(),
            field_value: joi.number().required(),
        })
    }

}
