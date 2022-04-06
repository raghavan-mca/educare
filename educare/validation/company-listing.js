const joi = require('joi')

module.exports = {
    fetch_validation: {
        query: joi.object({
            id:joi.string().optional()
        })
    },
    create_validation:{
        body:joi.object({
            company_name:joi.string().required(),
            website :joi.string().required(),
            email :joi.string().required()
        })
    },
    update_body_validation:{
        body:joi.object({
            company_name:joi.string().optional(),
            website :joi.string().optional(),
            email :joi.string().optional()
        })
    },
    update_params_validation:{
        params: joi.object({
            id: joi.string().required()
        })
    },
    delete_params_validation:{
        params: joi.object({
            id: joi.string().required()
        })
    },
    bulk_delete_validation: {
        body: joi.object({
            ids: joi.array().required()
        })
    },
    search_validation: {
        params: joi.object({
            companyname:joi.string()
        })
    },
}