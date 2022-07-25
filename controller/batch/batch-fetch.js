const batch_services = require('../../services/batch-service')
const batch_Services = new batch_services()
const apiError = require('../../error/api-error')

class batch {
    async fetch_batch_listing(req, res, next) {
        let query = req.query
        try {
            if (!query) {
                next(apiError.badRequest('error'))
                return

            }
            else if (query) {
                const batch_fetch = await batch_Services.fetch_batch(query)

                if (batch_fetch.code === 500) {
                    next(apiError.internal({
                        'statusCode': 500,
                        'ErrorMessage': batch_fetch.ErrorMessage,
                        'Error': 'badImplementation'

                    }))
                    return
                } else if (batch_fetch.code === 11000) {
                    next(apiError.conflict({
                        'statuscode': 409,
                        'Error': 'conflict',
                        'ErrorMessage': 'duplicate data'
                    }))
                    return
                } else if (batch_fetch.code === 400) {
                    next(apiError.badRequest({
                        'statusCode': 400,
                        'ErrorMessage':'invalid data' ,
                        'Error': 'badRequest'


                    }))
                    return
                }else if(batch_fetch.length===0){
                    return res.status(200).send({
                        'statuscode':204,
                        'data': batch_fetch
                    })
                }
                 else {
                     return res.status(200).send({
                        'statuscode':200,
                        'data': batch_fetch
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

module.exports = batch