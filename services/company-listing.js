const company_listing_model = require('../models/company-list-model')
const company_placement_model = require('../models/company-placement-model')

const randomstring = require("randomstring")

class company_listing_services {
    async fetchcompanylisting(query) {
        try {
            const fetch_company = await company_listing_model.find(query)
            return fetch_company
        } catch (err) {
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

    async createcompanylisting(payload) {
        try {
            let word = payload.company_name.substring(0, 3).toUpperCase()
            let random_number = Math.floor(Math.random() * 1000)
            let random_number1 = Math.floor(Math.random() * 1000)
            let randomword = randomstring.generate(2).toUpperCase()
            let id = `${word}${random_number}${random_number}${random_number1}${randomword}${word}${randomword}`
            payload['id'] = id
            const company_list_create = new company_listing_model(payload)
            const company_list = await company_list_create.save()
            if (company_list) {
                const output = {
                    'statuscode': 200,
                    'message': 'success',
                }
                return output
            }
        } catch (err) {
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

    async updatecompanylisting(payload, params) {

        try {
            let find_placement_data = await company_placement_model.find(params)
            let placement_update_data = {
                "company_name": payload.company_name,
                "company_email": payload.email,
                "company_website": payload.website
            }

            if (find_placement_data.length > 0) {
                let update_placement_data = await company_placement_model.updateMany(params, placement_update_data)
                let update_company_listing = await company_listing_model.findOneAndUpdate(params, payload)
                return update_company_listing
            }
            else {
                let update_company_listing = await company_listing_model.findOneAndUpdate(params, payload)
                return update_company_listing
            }
        } catch (err) {
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
    async deletecompanylisting(params) {
        try {
            let find_placement_data = await company_placement_model.find(params)
            if(find_placement_data.length>0){
                let delete_placement = await company_placement_model.deleteMany(params)
                let delete_company = await company_listing_model.deleteOne(params)
                delete_company["delete_placement_count"] = delete_placement.deletedCount
                return delete_company
                
            }else{
                let delete_company = await company_listing_model.deleteOne(params)
               return delete_company
            }
        } catch (err) {
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
    async bulkdeletecompanyPlacement(payload) {
        try {
            let find_many_placement = await company_placement_model.find({"id":{$in:payload.ids}})
            if(find_many_placement.length>0){
                let bulk_delete_placement = await company_placement_model.deleteMany({"id":payload.ids})
                let bulk_delete_listing = await company_listing_model.deleteMany({"id":payload.ids})
                bulk_delete_listing["placement delete count"] = bulk_delete_placement.deletedCount
                return bulk_delete_listing
            }else{
                let bulk_delete_listing = await company_listing_model.deleteMany({"id":payload.ids})
                return bulk_delete_listing;
            }
        }
        catch (err) {
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
    async searchcompanylisting(params) {
        try {
            let search_company = await company_listing_model.find(
                {
                    "$or":[
                        {
                           "company_name":{$regex:params.companyname} 
                        }
                    ]
                   
                }
            )
            return search_company
        } catch (err) {
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