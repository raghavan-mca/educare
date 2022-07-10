const Joi = require('joi')
const joi = require('joi')

module.exports = {
    report_create: {
        body: joi.object({
            roll_no: joi.string().required(),
            placement_id: joi.string().required(),
            no_of_student_attend_placement: joi.number().required(),

        }),
    },
    report_fetch:{
        query:joi.object({
            placement_id:joi.string().optional()
        })
    }
}