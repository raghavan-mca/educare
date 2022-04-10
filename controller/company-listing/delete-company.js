const company_services = require('../../services/company-listing')
const company_Services = new company_services()
const apiError = require('../../error/api-error')

class company_listing {
    async deletecompanylisting(req, res, next) {

        let params = req.params


        try {
            if (!params) {
                next(apiError.badRequest('error'))
                return

            } else if (params) {
                const company_listing_delete = await company_Services.deletecompanylisting(params)

                if (company_listing_delete.code === 500) {
                    next(apiError.internal({
                        'statusCode': 500,
                        'ErrorMessage': company_listing_delete.ErrorMessage,
                        'Error': 'badImplementation'

                    }))
                    return
                } else if (company_listing_delete.code === 11000) {
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
                        'data': company_listing_delete,
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

module.exports = company_listing