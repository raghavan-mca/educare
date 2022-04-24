const { allow } = require('joi')
const joi = require('joi')
module.exports = {
    create_validation: {
        body: joi.object({
            company_name: joi.string().required(),
            job_role: joi.string().optional().allow(""),
            placement_date: joi.string().optional().allow(""),
            registration_date: joi.string().optional().allow(""),
            salary: {
                min_salary: joi.number().optional().allow(null),
                max_salary: joi.number().optional().allow(null),
            },
            registration_link: joi.string().optional().allow(""),
            company_website: joi.string().required(),
            location: joi.string().optional().allow(""),
            company_email: joi.string().required(),
            percentage: {
                ten: joi.number().min(1).max(101).optional().allow(null),
                twelve: joi.number().min(1).max(101).optional().allow(null),
                ug: joi.number().min(1).max(101).optional().allow(null),
                pg: joi.number().min(1).max(101).optional().allow(null),
                diploma: joi.number().min(1).max(101).optional().allow(null),
            },
            open_to_all: joi.number().optional().allow(null),

        }),

    },
    fetch_validation: {
        query: joi.object({
            //placement_timestamp: joi.number().optional(),
            //registration_timestamp: joi.number().optional(),
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
    update_body_validation: {
        body: joi.object({
            company_name: joi.string().optional().allow(""),
            job_role: joi.string().optional().allow(""),
            placement_date: joi.string().optional().allow(""),
            registration_date: joi.string().optional().allow(""),
            salary: {
                min_salary: joi.number().optional().allow(null),
                max_salary: joi.number().optional().allow(null),
            },
            registration_link: joi.string().optional().allow(""),
            company_website: joi.string().optional().allow(""),
            location: joi.string().optional().allow(""),
            company_email: joi.string().optional().allow(""),
            percentage: {
                ten: joi.number().min(1).max(101).optional().allow(null),
                twelve: joi.number().min(1).max(101).optional().allow(null),
                ug: joi.number().min(1).max(101).optional().allow(null),
                pg: joi.number().min(1).max(101).optional().allow(null),
                diploma: joi.number().min(1).max(101).optional().allow(null),
            },
            open_to_all: joi.number().optional(),

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