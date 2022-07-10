const joi = require('joi')

module.exports = {
    department_create: {
        body: joi.object({
            department_name: joi.string().required(),
            category: joi.string().required(),
            duration: joi.string().required(),
            department_head: joi.string().optional().allow(""),
            incharge: joi.string().optional().allow(""),
            incharge_phone: joi.number().optional().allow(null),
            incharge_mail: joi.string().optional().allow(""),
        })
    },
    department_fetch: {
        query: joi.object({
            department_name: joi.string().optional(),
            focus_student_intern:joi.number().optional(),
            focus_student_placement:joi.number().optional(),
            id:joi.string().optional(),

        })
    },
    department_edit:{
        body:joi.object({
            department_name:joi.string().required(),
            category:joi.string().required(),
            duration:joi.string().required(),
            department_head:joi.string().optional().allow(""),
            incharge:joi.string().optional().allow(""),
            incharge_phone:joi.number().optional().allow(null),
            incharge_mail:joi.string().optional().allow(""),
            
        })
    },
    department_edit_params: {
        params: joi.object({
            id : joi.string().required(),
        })
    },
    department_delete_params: {
        params: joi.object({
            id : joi.string().required(),
        })
    },
}
