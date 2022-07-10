const report_services = require("../../services/report-service")
const report_Services = new report_services()
const apiError = require('../../error/api-error')

class reports {
    async fetchReport(req, res, next) {
        let query = req.query
        try {
            if (!query) {
                next(apiError.badRequest('error'))
                return

            }
            else if (query) {
                const report_batch = await report_Services.fetch_report(query)

                if (report_batch.code === 500) {
                    next(apiError.internal({
                        'statusCode': 500,
                        'ErrorMessage': report_batch.ErrorMessage,
                        'Error': 'badImplementation'

                    }))
                    return
                } else if (report_batch.code === 11000) {
                    next(apiError.conflict({
                        'statuscode': 409,
                        'Error': 'conflict',
                        'ErrorMessage': 'duplicate data'
                    }))
                    return
                } else if (report_batch.code === 400) {
                    next(apiError.badRequest({
                        'statusCode': 400,
                        'ErrorMessage':'invalid data' ,
                        'Error': 'badRequest'


                    }))
                    return
                }else if(report_batch.length===0){
                    return res.status(200).send({
                        'statuscode':204,
                        'data': report_batch
                    })
                }
                 else {
                     return res.status(200).send({
                        'statuscode':200,
                        'data': report_batch
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

module.exports = reports