const students_services = require('../../services/students-service')
const students_Services = new students_services()
const apiError = require('../../error/api-error')

class students {
    async search_with_placement_id(req, res, next) {
        let query = req.query
        try {
            if (!query) {
                next(apiError.badRequest('error'))
                return

            }
            else if (query) {
                const student_search_with_placement_id = await students_Services.search_with_placement_id(query)

                if (student_search_with_placement_id.code === 500) {
                    next(apiError.internal({
                        'statusCode': 500,
                        'ErrorMessage': student_search_with_placement_id.ErrorMessage,
                        'Error': 'badImplementation'

                    }))
                    return
                } else if (student_search_with_placement_id.code === 11000) {
                    next(apiError.conflict({
                        'statuscode': 409,
                        'Error': 'conflict',
                        'ErrorMessage': 'duplicate data'
                    }))
                    return
                } else if (student_search_with_placement_id.code === 400) {
                    next(apiError.badRequest({
                        'statusCode': 400,
                        'ErrorMessage':'invalid data' ,
                        'Error': 'badRequest'


                    }))
                    return
                }else if(student_search_with_placement_id.length===0){
                    return res.status(200).send({
                        'statuscode':204,
                        'data': student_search_with_placement_id
                    })
                }
                 else {
                     return res.status(200).send({
                        'statuscode':200,
                        'data': student_search_with_placement_id
                    })
                }
            }

        } catch (err) {

            if (err.code === 11000) {
                next(apiError.conflict({
                    'statuscode': 409,
                    'Error': 'conflict',
                    'ErrorMessage': 'duplicate data'
                }))
                return
            }
            next(apiError.internal({
                'statusCode': 500,
                'ErrorMessage': 'undefine error',
                'Error': 'badImplementation'

            }))
            return
        }
    }

}

module.exports = students