const company_placement_services = require('../../services/company_placement')
const company_placement_Services = new company_placement_services()
const apiError = require('../../error/api-error')

class company_placement {
    async createcompanyPlacement(req, res, next) {

        
        let payload = req.body

        try {

            if (!payload) {
                next(apiError.badRequest('error'))
                return

            } else if (payload) {
                const company_placement_create = await company_placement_Services.createcompanyPlacement(payload)

                if (company_placement_create.code === 500) {
                    next(apiError.internal({
                        'statusCode': 500,
                        'ErrorMessage': company_placement_create.ErrorMessage,
                        'Error': 'badImplementation'

                    }))
                    return
                } else if (company_placement_create.code === 11000) {
                    next(apiError.conflict({
                        'statuscode': 409,
                        'Error': 'conflict',
                        'ErrorMessage': 'duplicate data'
                    }))
                    return
                }
                else {
                    return res.status(200).send({
                        'statuscode':200,
                        'data': company_placement_create
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