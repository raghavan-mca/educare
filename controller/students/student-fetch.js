const students_services = require('../../services/students-service')
const students_Services = new students_services()
const apiError = require('../../error/api-error')

class students {
    async fetch_students_listing(req, res, next) {
        let query = req.query
        try {
            if (!query) {
                next(apiError.badRequest('error'))
                return

            }
            else if (query) {
                const students_fetch = await students_Services.fetch_students_listing(query)

                if (students_fetch.code === 500) {
                    next(apiError.internal({
                        'statusCode': 500,
                        'ErrorMessage': students_fetch.ErrorMessage,
                        'Error': 'badImplementation'

                    }))
                    return
                } else if (students_fetch.code === 11000) {
                    next(apiError.conflict({
                        'statuscode': 409,
                        'Error': 'conflict',
                        'ErrorMessage': 'duplicate data'
                    }))
                    return
                } else if (students_fetch.code === 400) {
                    next(apiError.badRequest({
                        'statusCode': 400,
                        'ErrorMessage':'invalid data' ,
                        'Error': 'badRequest'


                    }))
                    return
                }else if(students_fetch.length===0){
                    return res.status(200).send({
                        'statuscode':204,
                        'data': students_fetch
                    })
                }
                 else {
                     return res.status(200).send({
                        'statuscode':200,
                        'data': students_fetch
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