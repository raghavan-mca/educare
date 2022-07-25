const department_services = require('../../services/department-service')
const department_Services = new department_services()
const apiError = require('../../error/api-error')

class department {
    async fetch_department_listing(req, res, next) {
        let query = req.query
        try {
            if (!query) {
                next(apiError.badRequest('error'))
                return

            }
            else if (query) {
                const department_fetch = await department_Services.fetch_department_listing(query)

                if (department_fetch.code === 500) {
                    next(apiError.internal({
                        'statusCode': 500,
                        'ErrorMessage': department_fetch.ErrorMessage,
                        'Error': 'badImplementation'

                    }))
                    return
                } else if (department_fetch.code === 11000) {
                    next(apiError.conflict({
                        'statuscode': 409,
                        'Error': 'conflict',
                        'ErrorMessage': 'duplicate data'
                    }))
                    return
                } else if (department_fetch.code === 400) {
                    next(apiError.badRequest({
                        'statusCode': 400,
                        'ErrorMessage':'invalid data' ,
                        'Error': 'badRequest'


                    }))
                    return
                }else if(department_fetch.length===0){
                    return res.status(200).send({
                        'statuscode':204,
                        'data': department_fetch
                    })
                }
                 else {
                     return res.status(200).send({
                        'statuscode':200,
                        'data': department_fetch
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

module.exports = department