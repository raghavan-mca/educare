const students_service = require('../../services/students-service')
const students_Service = new students_service()
const apiError = require('../../error/api-error')

class students_listing {
    async bulk_delete_students_listing(req, res, next) {
       
        let payload = req.body
        let params = req.params
       
        try { 
            if (!payload || !params) {
                next(apiError.badRequest('error'))
                return

            }
            else if (payload && params) {
                const students_listing_bulk_delete = await students_Service.bulk_delete_students_listing(payload,params)
                if (students_listing_bulk_delete.code === 500) {
                    next(apiError.internal({
                        'statusCode': 500,
                        'ErrorMessage': students_listing_bulk_delete.ErrorMessage,
                        'Error': 'badImplementation'

                    }))
                    return
                } else if (students_listing_bulk_delete.code === 11000) {
                    next(apiError.conflict({
                        'statuscode': 409,
                        'Error': 'conflict',
                        'ErrorMessage': 'duplicate data'
                    }))
                    return
                } else if (students_listing_bulk_delete.code === 400) {
                    next(apiError.badRequest({
                        'statusCode': 400,
                        'ErrorMessage':'invalid data' ,
                        'Error': 'badRequest'


                    }))
                    return
                }else if(students_listing_bulk_delete.length === 0){
                    return res.status(200).send({
                        'statuscode':204,
                        'data': students_listing_bulk_delete
                    })
                }
                 else {
                    return res.status(200).send({
                        'statuscode':200,
                        'data': students_listing_bulk_delete
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

module.exports = students_listing