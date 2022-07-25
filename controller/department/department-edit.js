const department_service = require('../../services/department-service')
const department_Service = new department_service()
const apiError = require('../../error/api-error')

class department_listing {
    async edit_department_listing(req, res, next) {
       
        let payload = req.body
        let params = req.params
        try { 
            if (!payload || !params) {
                next(apiError.badRequest('error'))
                return

            }
            else if (payload && params) {
                const department_listing_edit = await department_Service.edit_department_listing(payload,params)
                if (department_listing_edit.code === 500) {
                    next(apiError.internal({
                        'statusCode': 500,
                        'ErrorMessage': department_listing_edit.ErrorMessage,
                        'Error': 'badImplementation'

                    }))
                    return
                } else if (department_listing_edit.code === 11000) {
                    next(apiError.conflict({
                        'statuscode': 409,
                        'Error': 'conflict',
                        'ErrorMessage': 'duplicate data'
                    }))
                    return
                } else if (department_listing_edit.code === 400) {
                    next(apiError.badRequest({
                        'statusCode': 400,
                        'ErrorMessage':'invalid data' ,
                        'Error': 'badRequest'


                    }))
                    return
                }else if(department_listing_edit.length === 0){
                    return res.status(200).send({
                        'statuscode':204,
                        'data': department_listing_edit
                    })
                }
                 else {
                    return res.status(200).send({
                        'statuscode':200,
                        'data': department_listing_edit
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

module.exports = department_listing