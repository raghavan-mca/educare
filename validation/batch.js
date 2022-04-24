const joi = require('joi')

module.exports = {
    batch_create: {
        body: joi.object({
            batch: joi.string().required(),
            department_id: joi.string().required(),
            year: joi.string().allow(null).optional() ,
            user_id:joi.string().required(),
        })
    },
    batch_fetch: {
        query: joi.object({
            department_id: joi.string().required()
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
    }
}
