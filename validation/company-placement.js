const joi = require('joi')

module.exports = {
    create_validation: {
        body: joi.object({
            company_name: joi.string().required(),
            job_role: joi.string(),
            placement_date: joi.string(),
            registration_date: joi.string(),
            salary: {
                min_salary: joi.number(),
                max_salary: joi.number(),
            },
            registration_link: joi.string(),
            company_website: joi.string().required(),
            location: joi.string(),
            company_email: joi.string().required(),
            percentage: {
                ten: joi.number().min(1).max(101),
                twelve: joi.number().min(1).max(101),
                ug: joi.number().min(1).max(101),
                pg: joi.number().min(1).max(101),
                diploma: joi.number().min(1).max(101),
            },
            open_to_all: joi.number(),

        }),

    },
    fetch_validation: {
        query: joi.object({
            placement_date: joi.string().optional(),
            min_salary: joi.number().optional(),
            max_salary: joi.number().optional(),
            ten: joi.number().min(1).max(101).optional(),
            twelve: joi.number().min(1).max(101).optional(),
            ug: joi.number().min(1).max(101).optional(),
            pg: joi.number().min(1).max(101).optional(),
            diploma: joi.number().min(1).max(101).optional(),
            open_to_all: joi.number().optional(),
            placement_status:joi.number().optional()

        }),
    },
    update_validation: {
        params: joi.object({
            id: joi.string().required()
        })
    },
    delete_validation: {
        params: joi.object({
            id: joi.string().required()
        })
    },
    bulk_delete_validation: {
        body: joi.object({
            ids: joi.array().required()
        })
    }

}