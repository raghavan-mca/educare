const company_listing_services = require('../../services/company-listing')
const company_listing_Services = new company_listing_services()
const apiError = require('../../error/api-error')

class company_placement {
    async bulkdeletecompanylisting(req, res, next) {

        let payload = req.body
        try {
            if (!payload) {
                next(apiError.badRequest('error'))
                return

            } else if (payload) {
                const company_listing_bulk_delete = await company_listing_Services.bulkdeletecompanyPlacement(payload)

                if (company_listing_bulk_delete.code === 500) {
                    next(apiError.internal({
                        'statusCode': 500,
                        'ErrorMessage': company_listing_bulk_delete.ErrorMessage,
                        'Error': 'badImplementation'

                    }))
                    return
                } else if (company_listing_bulk_delete.code === 11000) {
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
                        'data': company_listing_bulk_delete,
                        'deleted id':payload.id
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