const company_listing_model = require('../models/company-list-model')

class company_listing_services {
    async fetchcompanylisting(query) {
        try{
            const fetch_company = await company_listing_model.find(query)
            return fetch_company
        }catch (err) {
            let err_function = new Error(err)
            let err_message = err_function.message
            let err_message_arr = err_message.split(':')

            if (err_message_arr[0] === 'ReferenceError') {
                let error = {
                    "code": 500,
                    "ErrorMessage": err_message
                }
                return error
            }
            if (err_message_arr[0] === 'MongoServerError') {
                let error = {
                    "code": 11000,
                    "ErrorMessage": err_message
                }
                return error
            }
            return err
        }
    }
}
module.exports = company_listing_services