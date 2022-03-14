const apiError = require("../error/api-error")

function errorhandler(err, req, res, next) {
    let badRequest_output = {
        'statusCode':400,
        'ErrorMessage':err.message,
        'Error':err.error

    }
    let Internal_Server_output = {
        'statusCode':500,
        'ErrorMessage':'invalid file formate',
        'Error':'badImplementation'

    }
    if (err.error === 'Bad Request') {
        if (err instanceof apiError) {
            res.status(err.code).json(err.message)
            return
        }
        res.status(400).json(badRequest_output)
    }
    else {
        if (err instanceof apiError) {
            res.status(err.code).json(err.message)
            return
        }
        res.status(500).json(Internal_Server_output)
    }
}

module.exports = errorhandler