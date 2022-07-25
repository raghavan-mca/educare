const company_placement_services = require('../../services/company_placement')
const company_placement_Services = new company_placement_services()
const apiError = require('../../error/api-error')

class company_placement {
    async deletecompanyPlacement(req, res, next) {

        let params = req.params


        try {
            if (!params) {
                next(apiError.badRequest('error'))
                return

            } else if (params) {
                const company_placement_delete = await company_placement_Services.deletecompanyPlacement(params)

                if (company_placement_delete.code === 500) {
                    next(apiError.internal({
                        'statusCode': 500,
                        'ErrorMessage': company_placement_delete.ErrorMessage,
                        'Error': 'badImplementation'

                    }))
                    return
                } else if (company_placement_delete.code === 11000) {
                    next(apiError.conflict({
                        'statuscode': 409,
                        'Error': 'conflict',
                        'ErrorMessage': 'duplicate data'
                    }))
                    return
                }
                else {
                    return res.status(202).send({
                        'statuscode':202,
                        'data': company_placement_delete,
                        'deleted id':params.id
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