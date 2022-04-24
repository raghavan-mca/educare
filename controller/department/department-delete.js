const department_services = require('../../services/department-service')
const department_Services = new department_services()
const apiError = require('../../error/api-error')

class department {
    async delete_department_listing(req, res, next) {
        let params = req.params
        try {
            if (!params) {
                next(apiError.badRequest('error'))
                return

            }
            else if (params) {
                const department_delete = await department_Services.delete_department_listing(params)

                if (department_delete.code === 500) {
                    next(apiError.internal({
                        'statusCode': 500,
                        'ErrorMessage': department_delete.ErrorMessage,
                        'Error': 'badImplementation'

                    }))
                    return
                } else if (department_delete.code === 11000) {
                    next(apiError.conflict({
                        'statuscode': 409,
                        'Error': 'conflict',
                        'ErrorMessage': 'duplicate data'
                    }))
                    return
                } else if (department_delete.code === 400) {
                    next(apiError.badRequest({
                        'statusCode': 400,
                        'ErrorMessage':'invalid data' ,
                        'Error': 'badRequest'


                    }))
                    return
                }else if(department_delete.length===0){
                    return res.status(200).send({
                        'statuscode':204,
                        'data': department_delete
                    })
                }
                 else {
                     return res.status(200).send({
                        'statuscode':200,
                        'data': department_delete
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