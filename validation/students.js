const Joi = require('joi')
const joi = require('joi')

module.exports = {
    students_create: {
        body: joi.object({
            name: joi.string().required(),
            age: joi.number().required(),
            dob: joi.string().required(),
            gender: joi.number().required(),
            front_end_gender: joi.string().required(),
            roll_no: joi.string().required(),
            percentage: {
                ten: joi.number().min(1).max(101).required(),
                twelve: joi.number().min(1).max(101).optional().allow(null),
                ug: joi.number().min(1).max(101).optional().allow(null),
                pg: joi.number().min(1).max(101).optional().allow(null),
                diploma: joi.number().min(1).max(101).optional().allow(null),
            },
            mobile: joi.number().required(),
            alternative_mobile: joi.number().optional().allow(null),
            email: joi.string().required(),
            batch_id: joi.string().required(),

        }),
    },
    students_fetch: {
        query: joi.object({
            _id:joi.string().optional(),
            batch_id: joi.string().optional(),
            department_id: joi.string().optional(),
            name: joi.string().optional(),
            roll_no: joi.string().optional(),
            focus_student_intern:joi.number().optional(),
            focus_student_placement:joi.number().optional()

        })
    },
    students_sort: {
        query: joi.object({
            batch_id: joi.string().required(),
            order: Joi.string().required(),
            field: Joi.string().required()
        })
    },
    students_edit: {
        body: joi.object({
            name: joi.string().required(),
            age: joi.number().required(),
            dob: joi.string().required(),
            gender: joi.number().required(),
            front_end_gender: joi.string().required(),
            roll_no: joi.string().required(),
            percentage: {
                ten: joi.number().min(1).max(101).required(),
                twelve: joi.number().min(1).max(101).optional().allow(null),
                ug: joi.number().min(1).max(101).optional().allow(null),
                pg: joi.number().min(1).max(101).optional().allow(null),
                diploma: joi.number().min(1).max(101).optional().allow(null),
            },
            mobile: joi.number().required(),
            alternative_mobile: joi.number().optional().allow(null),
            email: joi.string().required(),
        }),
    },
    students_edit_params: {
        params: joi.object({
            id: joi.string().required(),
            student_id: joi.string().required(),
        })
    },
    students_delete_params: {
        params: joi.object({
            student_id: joi.string().required(),
            id: joi.string().required(),
        })
    },
    students_bulk_delete_params: {
        params: joi.object({
            id: joi.string().required(),
        })
    },
    students_bulk_delete_body: {
        body: joi.object({
            ids: joi.array().required(),
        })
    },
    students_transfer_params: {
        params: joi.object({
            id: joi.string().required(),
        })
    },
    students_transfer_body: {
        body: joi.object({
            ids: joi.array().required(),
            field: joi.string().required(),
            field_value: joi.number().required(),
        })
    },
    students_upload_params: {
        params: joi.object({
            id: joi.string().required(),
        })
    },
    students_search_query: {
        query: joi.object({
            id: joi.string().required(),
            focus_student:joi.number().required(),
            placement_id: joi.string().required()
        })
    },
    multi_api_query: {
        query: joi.object({
            department_id: joi.string().required(),
            take: joi.string().required(),
        })
    },
}
