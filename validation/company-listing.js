const joi = require('joi')

module.exports = {
    fetch_validation: {
        query: joi.object({
            id:joi.string().optional()
        })
    }
}