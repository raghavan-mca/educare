const company_placement_services = require('../../services/company_placement')
const company_placement_Services = new company_placement_services()
const apiError = require('../../error/api-error')

class company_placement {
    async updatecompanyPlacement(req, res, next) {

        let payload = req.body
        let params = req.params


        try {

            if (!payload || !params) {
                next(apiError.badRequest('error'))
                return

            } else if (payload && params) {
                const company_placement_update = await company_placement_Services.updatecompanyPlacement(payload,params)

                if (company_placement_update.code === 500) {
                    next(apiError.internal({
                        'statusCode': 500,
                        'ErrorMessage': company_placement_update.ErrorMessage,
                        'Error': 'badImplementation'

                    }))
                    return
                } else if (company_placement_update.code === 11000) {
                    next(apiError.conflict({
                        'statuscode': 409,
                        'Error': 'conflict',
                        'ErrorMessage': 'duplicate data'
                    }))
                    return
                }else if (company_placement_update.code === 400) {
                    next(apiError.badRequest({
                        'statusCode': 400,
                        'ErrorMessage':'invalid data' ,
                        'Error': 'badRequest'


                    }))
                    return
                }
                else {
                    return res.status(200).send({
                        'statuscode':200,
                        'data': company_placement_update
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
module.exports = company_placement