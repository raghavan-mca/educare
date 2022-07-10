const report_services = require("../../services/report-service")
const report_Services = new report_services()
const apiError = require('../../error/api-error')

class reports {
    async createReport(req, res, next) {
        let payload = req.body
        
        try {
            if (!payload) {
                next(apiError.badRequest('error'))
                return

            }
            else if (payload) {
                const create_report = await report_Services.create_report(payload)

                if (create_report.code === 500) {
                    next(apiError.internal({
                        'statusCode': 500,
                        'ErrorMessage': create_report.ErrorMessage,
                        'Error': 'badImplementation'

                    }))
                    return
                } else if (create_report.code === 11000) {
                    next(apiError.conflict({
                        'statuscode': 409,
                        'Error': 'conflict',
                        'ErrorMessage': 'duplicate data'
                    }))
                    return
                } else if (create_report.code === 400) {
                    next(apiError.badRequest({
                        'statusCode': 400,
                        'ErrorMessage':'invalid data' ,
                        'Error': 'badRequest'


                    }))
                    return
                }else if(create_report.length === 0){
                    return res.status(200).send({
                        'statuscode':204,
                        'data': create_report
                    })
                }
                 else {
                    return res.status(200).send({
                        'statuscode':200,
                        'data': create_report
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