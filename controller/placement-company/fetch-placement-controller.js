const company_placement_services = require('../../services/company_placement')
const company_placement_Services = new company_placement_services()
const apiError = require('../../error/api-error')

class company_placement {
    async fetchcompanyPlacement(req, res, next) {
        let query = req.query
        try {
            if (!query) {
                next(apiError.badRequest('error'))
                return

            }
            else if (query) {
                const company_placement_fetch = await company_placement_Services.fetchcompanyPlacement(query)

                if (company_placement_fetch.code === 500) {
                    next(apiError.internal({
                        'statusCode': 500,
                        'ErrorMessage': company_placement_fetch.ErrorMessage,
                        'Error': 'badImplementation'

                    }))
                    return
                } else if (company_placement_fetch.code === 11000) {
                    next(apiError.conflict({
                        'statuscode': 409,
                        'Error': 'conflict',
                        'ErrorMessage': 'duplicate data'
                    }))
                    return
                } else if (company_placement_fetch.code === 400) {
                    next(apiError.badRequest({
                        'statusCode': 400,
                        'ErrorMessage':'invalid data' ,
                        'Error': 'badRequest'


                    }))
                    return
                }else if(company_placement_fetch.length===0){
                    return res.status(200).send({
                        'statuscode':204,
                        'data': company_placement_fetch
                    })
                }
                 else {
                     return res.status(200).send({
                        'statuscode':200,
                        'data': company_placement_fetch
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