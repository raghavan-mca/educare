const company_listing_service = require('../../services/company-listing')
const company_listing_services = new company_listing_service()
const apiError = require('../../error/api-error')

class company_listing {
    async searchcompanylisting(req, res, next) {
        let params = req.params
        try {
            if (!params) {
                next(apiError.badRequest('error'))
                return

            }
            else if (params) {
                const company_listing_search = await company_listing_services.searchcompanylisting(params)

                if (company_listing_search.code === 500) {
                    next(apiError.internal({
                        'statusCode': 500,
                        'ErrorMessage': company_listing_search.ErrorMessage,
                        'Error': 'badImplementation'

                    }))
                    return
                } else if (company_listing_search.code === 11000) {
                    next(apiError.conflict({
                        'statuscode': 409,
                        'Error': 'conflict',
                        'ErrorMessage': 'duplicate data'
                    }))
                    return
                } else if (company_listing_search.code === 400) {
                    next(apiError.badRequest({
                        'statusCode': 400,
                        'ErrorMessage':'invalid data' ,
                        'Error': 'badRequest'


                    }))
                    return
                }else if(company_listing_search.length === 0){
                    return res.status(200).send({
                        'statuscode':204,
                        'data': company_listing_search
                    })
                }
                 else {
                    return res.status(200).send({
                        'statuscode':200,
                        'data': company_listing_search
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