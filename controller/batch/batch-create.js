const batch_service = require('../../services/batch-service')
const batch_Service = new batch_service()
const apiError = require('../../error/api-error')

class batch_listing {
    async create_batch_listing(req, res, next) {
        let payload = req.body
        
        try { 
            if (!payload) {
                next(apiError.badRequest('error'))
                return

            }
            else if (payload) {
                const batch_listing_create = await batch_Service.create_batch(payload)
                if (batch_listing_create.code === 500) {
                    next(apiError.internal({
                        'statusCode': 500,
                        'ErrorMessage': batch_listing_create.ErrorMessage,
                        'Error': 'badImplementation'

                    }))
                    return
                } else if (batch_listing_create.code === 11000) {
                    next(apiError.conflict({
                        'statuscode': 409,
                        'Error': 'conflict',
                        'ErrorMessage': 'duplicate data'
                    }))
                    return
                } else if (batch_listing_create.code === 400) {
                    next(apiError.badRequest({
                        'statusCode': 400,
                        'ErrorMessage':'invalid data' ,
                        'Error': 'badRequest'


                    }))
                    return
                }else if(batch_listing_create.length === 0){
                    return res.status(200).send({
                        'statuscode':204,
                        'data': batch_listing_create
                    })
                }
                 else {
                    return res.status(200).send({
                        'statuscode':200,
                        'data': batch_listing_create
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

module.exports = batch_listing