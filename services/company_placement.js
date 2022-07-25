const company_placement_model = require('../models/company-placement-model')
const company_listing_model = require('../models/company-list-model')
const randomstring = require("randomstring")




class company_placement_services {

    async createcompanyPlacement(payload) {
        try {
            let word = payload.company_name.substring(0, 3).toUpperCase()
            let random_number = Math.floor(Math.random() * 1000)
            let random_number1 = Math.floor(Math.random() * 1000)
            let randomword = randomstring.generate(2).toUpperCase()
            let placement_code = `${word}${random_number}${randomword}`
            let id = `${word}${random_number}${random_number}${random_number1}${randomword}${word}${randomword}`

            if (payload.placement_date === "" && payload.registration_date === "") {
                payload["placement_timestamp"] = 0
                payload["placement_status"] = 3
                payload["registration_timestamp"] = 0
                payload["registration_status"] = 2

            }
            else if (payload.placement_date === "" || payload.registration_date === "") {
                if (payload.placement_date === "") {
                    payload["placement_timestamp"] = 0
                    payload["placement_status"] = 3
                    payload['registration_timestamp'] = new Date(`${payload.registration_date}`).getTime()

                }
                else if (payload.registration_date === "") {
                    payload["registration_timestamp"] = 0
                    payload["registration_status"] = 2
                    payload['placement_timestamp'] = new Date(`${payload.placement_date}`).getTime()


                }

            } else {

                payload['placement_timestamp'] = new Date(`${payload.placement_date}`).getTime()
                payload['registration_timestamp'] = new Date(`${payload.registration_date}`).getTime()


            }

            payload.placement_id = placement_code

            let company_list_data = {
                "company_name": payload.company_name,
                "website": payload.company_website,
                "email": payload.company_email,
            }
            let company_find = await company_listing_model.find(company_list_data)
            let company_placement, company_list;
            if (company_find.length > 0) {
                let ids = company_find[0].id

                payload.id = ids

                const company_placement_create = new company_placement_model(payload)
                company_placement = await company_placement_create.save()
            } else {


                payload.id = id
                company_list_data.id = id
                const company_list_create = new company_listing_model(company_list_data)
                company_list = await company_list_create.save()
                if (company_list) {
                    const company_placement_create = new company_placement_model(payload)
                    company_placement = await company_placement_create.save()
                }
            }
            if (company_placement) {
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
    async fetchcompanyPlacement(query) {
        try {
            let filter = {}
            let fetch_company_placement



            let date_module = new Date()
            let convert_string = JSON.stringify(date_module).split('T')[0].replace("\"", "")
            let month_calculate = new Date(convert_string)
            month_calculate.setMonth(month_calculate.getMonth() - 1)

            let yesterday_calculate = new Date(convert_string)
            yesterday_calculate.setDate(yesterday_calculate.getDate() - 1)

            let last_month_stringify = JSON.stringify(month_calculate).split('T')[0].replace("\"", "")
            let yesterday_stringify = JSON.stringify(yesterday_calculate).split('T')[0].replace("\"", "")
            let last_month_date = new Date(`${last_month_stringify}`).getTime()
            let today = new Date(`${yesterday_stringify}`).getTime()

            let expire_date = {
                'placement_timestamp': {
                    $gt: 1,
                    $lte: last_month_date

                }
            }
            let register_date = {
                'registration_timestamp': {
                    $lt: today
                }
            }
            let placement_date = {
                'placement_timestamp': {
                    $gt: last_month_date, $lte: today
                }
            }

            const placement_expire_date_find = await company_placement_model.find(expire_date)
            const placement_register_date_find = await company_placement_model.find(register_date)
            const placement_date_find = await company_placement_model.find(placement_date)


            let datenumber = new Date(`${query.placement_date},00:00:00:00`).getTime()
            let salaryfilter = query.min_salary || query.max_salary
            let datefilter = query.placement_date;
            let statusfilter = query.placement_status
            let opentoallfilter = query.open_to_all
            let percentagefilter = query.ten || query.twelve || query.ug || query.pg || query.diploma


            if (salaryfilter || datefilter || statusfilter || opentoallfilter || percentagefilter) {

                if (salaryfilter && datefilter && statusfilter && opentoallfilter && percentagefilter) {
                    if (query.min_salary || query.max_salary) {
                        let minimum_salary = Number(query.min_salary)
                        let maximum_salary = Number(query.max_salary)
                        if (minimum_salary && maximum_salary) {
                            filter['salary.min_salary'] = {
                                $gte: minimum_salary,
                            }
                            filter['salary.max_salary'] = {
                                $lte: maximum_salary
                            }
                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                    if (query.placement_date) {
                        filter['placement_timestamp'] = datenumber;
                    }
                    if (query.placement_status) {
                        let status = Number(query.placement_status)
                        if (status === 0) {
                            filter['placement_status'] = status;
                        } else if (status === 1) {
                            filter['placement_status'] = status;
                        } else if (status === 2) {
                            filter['placement_status'] = status;
                        } else if (status === 3) {
                            filter['placement_status'] = status;
                        } else {
                            return {
                                'code': 400
                            };
                        }
                    };
                    if (query.open_to_all) {
                        let opentoall = Number(query.open_to_all)
                        if (opentoall === 0) {
                            filter['open_to_all'] = opentoall;

                        } else if (opentoall === 1) {

                            filter['open_to_all'] = opentoall;

                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                    if (query.ten || query.twelve ||
                        query.ug || query.pg || query.diploma) {
                        let ten = Number(query.ten)
                        let twelve = Number(query.twelve)
                        let ug = Number(query.ug)
                        let pg = Number(query.pg)
                        let diploma = Number(query.diploma)
                        if (ten && twelve && ug && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve &&
                            ug && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (ten && twelve &&
                            ug && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve &&
                            pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten &&
                            ug && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (twelve &&
                            ug && pg && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ten && twelve && ug) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (ten && twelve && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && twelve && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && ug && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && ug && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ten && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (twelve && ug && pg) {

                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (twelve && ug && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (twelve && pg && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ug && pg && diploma) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }

                        } else if (ten && ug) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (ten && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (twelve && ug) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (twelve && pg) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (twelve && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ug && pg) {

                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ug && diploma) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (pg && diploma) {
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten) {
                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100

                            }
                        } else if (twelve) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                        } else if (ug) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (pg) {
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (diploma) {
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                } else if (salaryfilter && datefilter && statusfilter && opentoallfilter) {
                    if (query.min_salary || query.max_salary) {
                        let minimum_salary = Number(query.min_salary)
                        let maximum_salary = Number(query.max_salary)
                        if (minimum_salary && maximum_salary) {
                            filter['salary.min_salary'] = {
                                $gte: minimum_salary,
                            }
                            filter['salary.max_salary'] = {
                                $lte: maximum_salary
                            }
                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                    if (query.placement_date) {
                        filter['placement_timestamp'] = datenumber;
                    }
                    if (query.placement_status) {
                        let status = Number(query.placement_status)
                        if (status === 0) {
                            filter['placement_status'] = status;
                        } else if (status === 1) {
                            filter['placement_status'] = status;
                        } else if (status === 2) {
                            filter['placement_status'] = status;
                        } else if (status === 3) {
                            filter['placement_status'] = status;
                        } else {
                            return {
                                'code': 400
                            };
                        }
                    };
                    if (query.open_to_all) {
                        let opentoall = Number(query.open_to_all)
                        if (opentoall === 0) {
                            filter['open_to_all'] = opentoall;

                        } else if (opentoall === 1) {

                            filter['open_to_all'] = opentoall;

                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                } else if (salaryfilter && datefilter && statusfilter && percentagefilter) {
                    if (query.min_salary || query.max_salary) {
                        let minimum_salary = Number(query.min_salary)
                        let maximum_salary = Number(query.max_salary)
                        if (minimum_salary && maximum_salary) {
                            filter['salary.min_salary'] = {
                                $gte: minimum_salary,
                            }
                            filter['salary.max_salary'] = {
                                $lte: maximum_salary
                            }
                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                    if (query.placement_date) {
                        filter['placement_timestamp'] = datenumber;
                    }
                    if (query.placement_status) {
                        let status = Number(query.placement_status)
                        if (status === 0) {
                            filter['placement_status'] = status;
                        } else if (status === 1) {
                            filter['placement_status'] = status;
                        } else if (status === 2) {
                            filter['placement_status'] = status;
                        } else if (status === 3) {
                            filter['placement_status'] = status;
                        } else {
                            return {
                                'code': 400
                            };
                        }
                    };
                    if (query.ten || query.twelve ||
                        query.ug || query.pg || query.diploma) {
                        let ten = Number(query.ten)
                        let twelve = Number(query.twelve)
                        let ug = Number(query.ug)
                        let pg = Number(query.pg)
                        let diploma = Number(query.diploma)
                        if (ten && twelve && ug && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve &&
                            ug && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (ten && twelve &&
                            ug && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve &&
                            pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten &&
                            ug && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (twelve &&
                            ug && pg && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ten && twelve && ug) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (ten && twelve && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && twelve && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && ug && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && ug && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ten && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (twelve && ug && pg) {

                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (twelve && ug && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (twelve && pg && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ug && pg && diploma) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }

                        } else if (ten && ug) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (ten && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (twelve && ug) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (twelve && pg) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (twelve && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ug && pg) {

                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ug && diploma) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (pg && diploma) {
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten) {
                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100

                            }
                        } else if (twelve) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                        } else if (ug) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (pg) {
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (diploma) {
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                } else if (salaryfilter && datefilter && opentoallfilter && percentagefilter) {
                    if (query.min_salary || query.max_salary) {
                        let minimum_salary = Number(query.min_salary)
                        let maximum_salary = Number(query.max_salary)
                        if (minimum_salary && maximum_salary) {
                            filter['salary.min_salary'] = {
                                $gte: minimum_salary,
                            }
                            filter['salary.max_salary'] = {
                                $lte: maximum_salary
                            }
                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                    if (query.placement_date) {
                        filter['placement_timestamp'] = datenumber;
                    }
                    if (query.open_to_all) {
                        let opentoall = Number(query.open_to_all)
                        if (opentoall === 0) {
                            filter['open_to_all'] = opentoall;

                        } else if (opentoall === 1) {

                            filter['open_to_all'] = opentoall;

                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                    if (query.ten || query.twelve ||
                        query.ug || query.pg || query.diploma) {
                        let ten = Number(query.ten)
                        let twelve = Number(query.twelve)
                        let ug = Number(query.ug)
                        let pg = Number(query.pg)
                        let diploma = Number(query.diploma)
                        if (ten && twelve && ug && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve &&
                            ug && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (ten && twelve &&
                            ug && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve &&
                            pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten &&
                            ug && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (twelve &&
                            ug && pg && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ten && twelve && ug) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (ten && twelve && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && twelve && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && ug && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && ug && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ten && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (twelve && ug && pg) {

                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (twelve && ug && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (twelve && pg && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ug && pg && diploma) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }

                        } else if (ten && ug) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (ten && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (twelve && ug) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (twelve && pg) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (twelve && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ug && pg) {

                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ug && diploma) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (pg && diploma) {
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten) {
                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100

                            }
                        } else if (twelve) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                        } else if (ug) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (pg) {
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (diploma) {
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                } else if (salaryfilter && statusfilter && opentoallfilter && percentagefilter) {

                    if (query.min_salary || query.max_salary) {
                        let minimum_salary = Number(query.min_salary)
                        let maximum_salary = Number(query.max_salary)
                        if (minimum_salary && maximum_salary) {
                            filter['salary.min_salary'] = {
                                $gte: minimum_salary,
                            }
                            filter['salary.max_salary'] = {
                                $lte: maximum_salary
                            }
                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                    if (query.placement_status) {
                        let status = Number(query.placement_status)
                        if (status === 0) {
                            filter['placement_status'] = status;
                        } else if (status === 1) {
                            filter['placement_status'] = status;
                        } else if (status === 2) {
                            filter['placement_status'] = status;
                        } else if (status === 3) {
                            filter['placement_status'] = status;
                        } else {
                            return {
                                'code': 400
                            };
                        }
                    };
                    if (query.open_to_all) {
                        let opentoall = Number(query.open_to_all)
                        if (opentoall === 0) {
                            filter['open_to_all'] = opentoall;

                        } else if (opentoall === 1) {

                            filter['open_to_all'] = opentoall;

                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                    if (query.ten || query.twelve ||
                        query.ug || query.pg || query.diploma) {
                        let ten = Number(query.ten)
                        let twelve = Number(query.twelve)
                        let ug = Number(query.ug)
                        let pg = Number(query.pg)
                        let diploma = Number(query.diploma)
                        if (ten && twelve && ug && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve &&
                            ug && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (ten && twelve &&
                            ug && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve &&
                            pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten &&
                            ug && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (twelve &&
                            ug && pg && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ten && twelve && ug) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (ten && twelve && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && twelve && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && ug && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && ug && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ten && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (twelve && ug && pg) {

                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (twelve && ug && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (twelve && pg && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ug && pg && diploma) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }

                        } else if (ten && ug) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (ten && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (twelve && ug) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (twelve && pg) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (twelve && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ug && pg) {

                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ug && diploma) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (pg && diploma) {
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten) {
                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100

                            }
                        } else if (twelve) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                        } else if (ug) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (pg) {
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (diploma) {
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                } else if (datefilter && statusfilter && opentoallfilter && percentagefilter) {
                    if (query.placement_date) {
                        filter['placement_timestamp'] = datenumber;
                    }
                    if (query.placement_status) {
                        let status = Number(query.placement_status)
                        if (status === 0) {
                            filter['placement_status'] = status;
                        } else if (status === 1) {
                            filter['placement_status'] = status;
                        } else if (status === 2) {
                            filter['placement_status'] = status;
                        } else if (status === 3) {
                            filter['placement_status'] = status;
                        } else {
                            return {
                                'code': 400
                            };
                        }
                    };
                    if (query.open_to_all) {
                        let opentoall = Number(query.open_to_all)
                        if (opentoall === 0) {
                            filter['open_to_all'] = opentoall;

                        } else if (opentoall === 1) {

                            filter['open_to_all'] = opentoall;

                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                    if (query.ten || query.twelve ||
                        query.ug || query.pg || query.diploma) {
                        let ten = Number(query.ten)
                        let twelve = Number(query.twelve)
                        let ug = Number(query.ug)
                        let pg = Number(query.pg)
                        let diploma = Number(query.diploma)
                        if (ten && twelve && ug && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve &&
                            ug && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (ten && twelve &&
                            ug && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve &&
                            pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten &&
                            ug && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (twelve &&
                            ug && pg && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ten && twelve && ug) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (ten && twelve && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && twelve && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && ug && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && ug && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ten && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (twelve && ug && pg) {

                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (twelve && ug && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (twelve && pg && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ug && pg && diploma) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }

                        } else if (ten && ug) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (ten && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (twelve && ug) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (twelve && pg) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (twelve && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ug && pg) {

                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ug && diploma) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (pg && diploma) {
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten) {
                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100

                            }
                        } else if (twelve) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                        } else if (ug) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (pg) {
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (diploma) {
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                } else if (salaryfilter && datefilter && statusfilter) {

                    if (query.min_salary || query.max_salary) {
                        let minimum_salary = Number(query.min_salary)
                        let maximum_salary = Number(query.max_salary)
                        if (minimum_salary && maximum_salary) {
                            filter['salary.min_salary'] = {
                                $gte: minimum_salary,
                            }
                            filter['salary.max_salary'] = {
                                $lte: maximum_salary
                            }
                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                    if (query.placement_date) {
                        filter['placement_timestamp'] = datenumber;
                    }
                    if (query.placement_status) {
                        let status = Number(query.placement_status)
                        if (status === 0) {
                            filter['placement_status'] = status;
                        } else if (status === 1) {
                            filter['placement_status'] = status;
                        } else if (status === 2) {
                            filter['placement_status'] = status;
                        } else if (status === 3) {
                            filter['placement_status'] = status;
                        } else {
                            return {
                                'code': 400
                            };
                        }
                    };
                } else if (salaryfilter && datefilter && opentoallfilter) {
                    if (query.min_salary || query.max_salary) {
                        let minimum_salary = Number(query.min_salary)
                        let maximum_salary = Number(query.max_salary)
                        if (minimum_salary && maximum_salary) {
                            filter['salary.min_salary'] = {
                                $gte: minimum_salary,
                            }
                            filter['salary.max_salary'] = {
                                $lte: maximum_salary
                            }
                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                    if (query.placement_date) {
                        filter['placement_timestamp'] = datenumber;
                    }
                    if (query.open_to_all) {
                        let opentoall = Number(query.open_to_all)
                        if (opentoall === 0) {
                            filter['open_to_all'] = opentoall;

                        } else if (opentoall === 1) {

                            filter['open_to_all'] = opentoall;

                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                } else if (salaryfilter && datefilter && percentagefilter) {
                    if (query.min_salary || query.max_salary) {
                        let minimum_salary = Number(query.min_salary)
                        let maximum_salary = Number(query.max_salary)
                        if (minimum_salary && maximum_salary) {
                            filter['salary.min_salary'] = {
                                $gte: minimum_salary,
                            }
                            filter['salary.max_salary'] = {
                                $lte: maximum_salary
                            }
                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                    if (query.placement_date) {
                        filter['placement_timestamp'] = datenumber;
                    }
                    if (query.ten || query.twelve ||
                        query.ug || query.pg || query.diploma) {
                        let ten = Number(query.ten)
                        let twelve = Number(query.twelve)
                        let ug = Number(query.ug)
                        let pg = Number(query.pg)
                        let diploma = Number(query.diploma)
                        if (ten && twelve && ug && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve &&
                            ug && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (ten && twelve &&
                            ug && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve &&
                            pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten &&
                            ug && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (twelve &&
                            ug && pg && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ten && twelve && ug) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (ten && twelve && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && twelve && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && ug && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && ug && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ten && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (twelve && ug && pg) {

                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (twelve && ug && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (twelve && pg && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ug && pg && diploma) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }

                        } else if (ten && ug) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (ten && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (twelve && ug) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (twelve && pg) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (twelve && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ug && pg) {

                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ug && diploma) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (pg && diploma) {
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten) {
                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100

                            }
                        } else if (twelve) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                        } else if (ug) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (pg) {
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (diploma) {
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                } else if (salaryfilter && statusfilter && opentoallfilter) {
                    if (query.min_salary || query.max_salary) {
                        let minimum_salary = Number(query.min_salary)
                        let maximum_salary = Number(query.max_salary)
                        if (minimum_salary && maximum_salary) {
                            filter['salary.min_salary'] = {
                                $gte: minimum_salary,
                            }
                            filter['salary.max_salary'] = {
                                $lte: maximum_salary
                            }
                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                    if (query.placement_status) {
                        let status = Number(query.placement_status)
                        if (status === 0) {
                            filter['placement_status'] = status;
                        } else if (status === 1) {
                            filter['placement_status'] = status;
                        } else if (status === 2) {
                            filter['placement_status'] = status;
                        } else if (status === 3) {
                            filter['placement_status'] = status;
                        } else {
                            return {
                                'code': 400
                            };
                        }
                    };
                    if (query.open_to_all) {
                        let opentoall = Number(query.open_to_all)
                        if (opentoall === 0) {
                            filter['open_to_all'] = opentoall;

                        } else if (opentoall === 1) {

                            filter['open_to_all'] = opentoall;

                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                } else if (salaryfilter && statusfilter && percentagefilter) {
                    if (query.min_salary || query.max_salary) {
                        let minimum_salary = Number(query.min_salary)
                        let maximum_salary = Number(query.max_salary)
                        if (minimum_salary && maximum_salary) {
                            filter['salary.min_salary'] = {
                                $gte: minimum_salary,
                            }
                            filter['salary.max_salary'] = {
                                $lte: maximum_salary
                            }
                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                    if (query.placement_status) {
                        let status = Number(query.placement_status)
                        if (status === 0) {
                            filter['placement_status'] = status;
                        } else if (status === 1) {
                            filter['placement_status'] = status;
                        } else if (status === 2) {
                            filter['placement_status'] = status;
                        } else if (status === 3) {
                            filter['placement_status'] = status;
                        } else {
                            return {
                                'code': 400
                            };
                        }
                    };
                    if (query.ten || query.twelve ||
                        query.ug || query.pg || query.diploma) {
                        let ten = Number(query.ten)
                        let twelve = Number(query.twelve)
                        let ug = Number(query.ug)
                        let pg = Number(query.pg)
                        let diploma = Number(query.diploma)
                        if (ten && twelve && ug && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve &&
                            ug && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (ten && twelve &&
                            ug && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve &&
                            pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten &&
                            ug && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (twelve &&
                            ug && pg && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ten && twelve && ug) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (ten && twelve && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && twelve && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && ug && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && ug && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ten && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (twelve && ug && pg) {

                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (twelve && ug && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (twelve && pg && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ug && pg && diploma) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }

                        } else if (ten && ug) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (ten && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (twelve && ug) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (twelve && pg) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (twelve && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ug && pg) {

                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ug && diploma) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (pg && diploma) {
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten) {
                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100

                            }
                        } else if (twelve) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                        } else if (ug) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (pg) {
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (diploma) {
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                } else if (salaryfilter && opentoallfilter && percentagefilter) {
                    if (query.min_salary || query.max_salary) {
                        let minimum_salary = Number(query.min_salary)
                        let maximum_salary = Number(query.max_salary)
                        if (minimum_salary && maximum_salary) {
                            filter['salary.min_salary'] = {
                                $gte: minimum_salary,
                            }
                            filter['salary.max_salary'] = {
                                $lte: maximum_salary
                            }
                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                    if (query.open_to_all) {
                        let opentoall = Number(query.open_to_all)
                        if (opentoall === 0) {
                            filter['open_to_all'] = opentoall;

                        } else if (opentoall === 1) {

                            filter['open_to_all'] = opentoall;

                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                    if (query.ten || query.twelve ||
                        query.ug || query.pg || query.diploma) {
                        let ten = Number(query.ten)
                        let twelve = Number(query.twelve)
                        let ug = Number(query.ug)
                        let pg = Number(query.pg)
                        let diploma = Number(query.diploma)
                        if (ten && twelve && ug && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve &&
                            ug && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (ten && twelve &&
                            ug && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve &&
                            pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten &&
                            ug && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (twelve &&
                            ug && pg && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ten && twelve && ug) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (ten && twelve && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && twelve && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && ug && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && ug && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ten && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (twelve && ug && pg) {

                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (twelve && ug && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (twelve && pg && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ug && pg && diploma) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }

                        } else if (ten && ug) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (ten && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (twelve && ug) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (twelve && pg) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (twelve && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ug && pg) {

                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ug && diploma) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (pg && diploma) {
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten) {
                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100

                            }
                        } else if (twelve) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                        } else if (ug) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (pg) {
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (diploma) {
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                } else if (datefilter && statusfilter && opentoallfilter) {
                    if (query.placement_date) {
                        filter['placement_timestamp'] = datenumber;
                    }
                    if (query.placement_status) {
                        let status = Number(query.placement_status)
                        if (status === 0) {
                            filter['placement_status'] = status;
                        } else if (status === 1) {
                            filter['placement_status'] = status;
                        } else if (status === 2) {
                            filter['placement_status'] = status;
                        } else if (status === 3) {
                            filter['placement_status'] = status;
                        } else {
                            return {
                                'code': 400
                            };
                        }
                    };
                    if (query.open_to_all) {
                        let opentoall = Number(query.open_to_all)
                        if (opentoall === 0) {
                            filter['open_to_all'] = opentoall;

                        } else if (opentoall === 1) {

                            filter['open_to_all'] = opentoall;

                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                } else if (datefilter && statusfilter && percentagefilter) {
                    if (query.placement_date) {
                        filter['placement_timestamp'] = datenumber;
                    }
                    if (query.placement_status) {
                        let status = Number(query.placement_status)
                        if (status === 0) {
                            filter['placement_status'] = status;
                        } else if (status === 1) {
                            filter['placement_status'] = status;
                        } else if (status === 2) {
                            filter['placement_status'] = status;
                        } else if (status === 3) {
                            filter['placement_status'] = status;
                        } else {
                            return {
                                'code': 400
                            };
                        }
                    };
                    if (query.ten || query.twelve ||
                        query.ug || query.pg || query.diploma) {
                        let ten = Number(query.ten)
                        let twelve = Number(query.twelve)
                        let ug = Number(query.ug)
                        let pg = Number(query.pg)
                        let diploma = Number(query.diploma)
                        if (ten && twelve && ug && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve &&
                            ug && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (ten && twelve &&
                            ug && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve &&
                            pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten &&
                            ug && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (twelve &&
                            ug && pg && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ten && twelve && ug) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (ten && twelve && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && twelve && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && ug && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && ug && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ten && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (twelve && ug && pg) {

                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (twelve && ug && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (twelve && pg && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ug && pg && diploma) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }

                        } else if (ten && ug) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (ten && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (twelve && ug) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (twelve && pg) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (twelve && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ug && pg) {

                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ug && diploma) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (pg && diploma) {
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten) {
                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100

                            }
                        } else if (twelve) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                        } else if (ug) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (pg) {
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (diploma) {
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                } else if (datefilter && opentoallfilter && percentagefilter) {
                    if (query.placement_date) {
                        filter['placement_timestamp'] = datenumber;
                    }
                    if (query.open_to_all) {
                        let opentoall = Number(query.open_to_all)
                        if (opentoall === 0) {
                            filter['open_to_all'] = opentoall;

                        } else if (opentoall === 1) {

                            filter['open_to_all'] = opentoall;

                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                    if (query.ten || query.twelve ||
                        query.ug || query.pg || query.diploma) {
                        let ten = Number(query.ten)
                        let twelve = Number(query.twelve)
                        let ug = Number(query.ug)
                        let pg = Number(query.pg)
                        let diploma = Number(query.diploma)
                        if (ten && twelve && ug && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve &&
                            ug && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (ten && twelve &&
                            ug && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve &&
                            pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten &&
                            ug && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (twelve &&
                            ug && pg && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ten && twelve && ug) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (ten && twelve && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && twelve && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && ug && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && ug && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ten && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (twelve && ug && pg) {

                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (twelve && ug && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (twelve && pg && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ug && pg && diploma) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }

                        } else if (ten && ug) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (ten && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (twelve && ug) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (twelve && pg) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (twelve && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ug && pg) {

                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ug && diploma) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (pg && diploma) {
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten) {
                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100

                            }
                        } else if (twelve) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                        } else if (ug) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (pg) {
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (diploma) {
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                } else if (statusfilter && opentoallfilter && percentagefilter) {
                    if (query.placement_status) {
                        let status = Number(query.placement_status)
                        if (status === 0) {
                            filter['placement_status'] = status;
                        } else if (status === 1) {
                            filter['placement_status'] = status;
                        } else if (status === 2) {
                            filter['placement_status'] = status;
                        } else if (status === 3) {
                            filter['placement_status'] = status;
                        } else {
                            return {
                                'code': 400
                            };
                        }
                    };
                    if (query.open_to_all) {
                        let opentoall = Number(query.open_to_all)
                        if (opentoall === 0) {
                            filter['open_to_all'] = opentoall;

                        } else if (opentoall === 1) {

                            filter['open_to_all'] = opentoall;

                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                    if (query.ten || query.twelve ||
                        query.ug || query.pg || query.diploma) {
                        let ten = Number(query.ten)
                        let twelve = Number(query.twelve)
                        let ug = Number(query.ug)
                        let pg = Number(query.pg)
                        let diploma = Number(query.diploma)
                        if (ten && twelve && ug && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve &&
                            ug && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (ten && twelve &&
                            ug && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve &&
                            pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten &&
                            ug && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (twelve &&
                            ug && pg && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ten && twelve && ug) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (ten && twelve && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && twelve && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && ug && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && ug && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ten && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (twelve && ug && pg) {

                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (twelve && ug && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (twelve && pg && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ug && pg && diploma) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }

                        } else if (ten && ug) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (ten && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (twelve && ug) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (twelve && pg) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (twelve && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ug && pg) {

                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ug && diploma) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (pg && diploma) {
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten) {
                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100

                            }

                        } else if (twelve) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                        } else if (ug) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (pg) {
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (diploma) {
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                } else if (salaryfilter && datefilter) {
                    if (query.min_salary || query.max_salary) {
                        let minimum_salary = Number(query.min_salary)
                        let maximum_salary = Number(query.max_salary)
                        if (minimum_salary && maximum_salary) {
                            filter['salary.min_salary'] = {
                                $gte: minimum_salary,
                            }
                            filter['salary.max_salary'] = {
                                $lte: maximum_salary
                            }
                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                    if (query.placement_date) {
                        filter['placement_timestamp'] = datenumber;
                    }
                } else if (salaryfilter && statusfilter) {
                    if (query.min_salary || query.max_salary) {
                        let minimum_salary = Number(query.min_salary)
                        let maximum_salary = Number(query.max_salary)
                        if (minimum_salary && maximum_salary) {
                            filter['salary.min_salary'] = {
                                $gte: minimum_salary,
                            }
                            filter['salary.max_salary'] = {
                                $lte: maximum_salary
                            }
                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                    if (query.placement_status) {
                        let status = Number(query.placement_status)
                        if (status === 0) {
                            filter['placement_status'] = status;
                        } else if (status === 1) {
                            filter['placement_status'] = status;
                        } else if (status === 2) {
                            filter['placement_status'] = status;
                        } else if (status === 3) {
                            filter['placement_status'] = status;
                        } else {
                            return {
                                'code': 400
                            };
                        }
                    };
                } else if (salaryfilter && opentoallfilter) {
                    if (query.min_salary || query.max_salary) {
                        let minimum_salary = Number(query.min_salary)
                        let maximum_salary = Number(query.max_salary)
                        if (minimum_salary && maximum_salary) {
                            filter['salary.min_salary'] = {
                                $gte: minimum_salary,
                            }
                            filter['salary.max_salary'] = {
                                $lte: maximum_salary
                            }
                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                    if (query.open_to_all) {
                        let opentoall = Number(query.open_to_all)
                        if (opentoall === 0) {
                            filter['open_to_all'] = opentoall;

                        } else if (opentoall === 1) {

                            filter['open_to_all'] = opentoall;

                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                } else if (salaryfilter && percentagefilter) {
                    if (query.min_salary || query.max_salary) {
                        let minimum_salary = Number(query.min_salary)
                        let maximum_salary = Number(query.max_salary)
                        if (minimum_salary && maximum_salary) {
                            filter['salary.min_salary'] = {
                                $gte: minimum_salary,
                            }
                            filter['salary.max_salary'] = {
                                $lte: maximum_salary
                            }
                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                    if (query.ten || query.twelve ||
                        query.ug || query.pg || query.diploma) {
                        let ten = Number(query.ten)
                        let twelve = Number(query.twelve)
                        let ug = Number(query.ug)
                        let pg = Number(query.pg)
                        let diploma = Number(query.diploma)
                        if (ten && twelve && ug && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve &&
                            ug && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (ten && twelve &&
                            ug && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve &&
                            pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten &&
                            ug && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (twelve &&
                            ug && pg && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ten && twelve && ug) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (ten && twelve && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && twelve && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && ug && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && ug && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ten && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (twelve && ug && pg) {

                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (twelve && ug && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (twelve && pg && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ug && pg && diploma) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }

                        } else if (ten && ug) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (ten && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (twelve && ug) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (twelve && pg) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (twelve && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ug && pg) {

                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ug && diploma) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (pg && diploma) {
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten) {
                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100

                            }

                        } else if (twelve) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                        } else if (ug) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (pg) {
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (diploma) {
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                } else if (datefilter && statusfilter) {
                    if (query.placement_date) {
                        filter['placement_timestamp'] = datenumber;
                    }
                    if (query.placement_status) {
                        let status = Number(query.placement_status)
                        if (status === 0) {
                            filter['placement_status'] = status;
                        } else if (status === 1) {
                            filter['placement_status'] = status;
                        } else if (status === 2) {
                            filter['placement_status'] = status;
                        } else if (status === 3) {
                            filter['placement_status'] = status;
                        } else {
                            return {
                                'code': 400
                            };
                        }
                    };
                } else if (datefilter && opentoallfilter) {
                    if (query.placement_date) {
                        filter['placement_timestamp'] = datenumber;
                    }
                    if (query.open_to_all) {
                        let opentoall = Number(query.open_to_all)
                        if (opentoall === 0) {
                            filter['open_to_all'] = opentoall;

                        } else if (opentoall === 1) {

                            filter['open_to_all'] = opentoall;

                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                } else if (datefilter && percentagefilter) {
                    if (query.placement_date) {
                        filter['placement_timestamp'] = datenumber;
                    }
                    if (query.ten || query.twelve ||
                        query.ug || query.pg || query.diploma) {
                        let ten = Number(query.ten)
                        let twelve = Number(query.twelve)
                        let ug = Number(query.ug)
                        let pg = Number(query.pg)
                        let diploma = Number(query.diploma)
                        if (ten && twelve && ug && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve &&
                            ug && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (ten && twelve &&
                            ug && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve &&
                            pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten &&
                            ug && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (twelve &&
                            ug && pg && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ten && twelve && ug) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (ten && twelve && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && twelve && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && ug && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && ug && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ten && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (twelve && ug && pg) {

                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (twelve && ug && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (twelve && pg && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ug && pg && diploma) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }

                        } else if (ten && ug) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (ten && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (twelve && ug) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (twelve && pg) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (twelve && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ug && pg) {

                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ug && diploma) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (pg && diploma) {
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten) {
                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100

                            }

                        } else if (twelve) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                        } else if (ug) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (pg) {
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (diploma) {
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                } else if (statusfilter && opentoallfilter) {
                    if (query.placement_status) {
                        let status = Number(query.placement_status)
                        if (status === 0) {
                            filter['placement_status'] = status;
                        } else if (status === 1) {
                            filter['placement_status'] = status;
                        } else if (status === 2) {
                            filter['placement_status'] = status;
                        } else if (status === 3) {
                            filter['placement_status'] = status;
                        } else {
                            return {
                                'code': 400
                            };
                        }
                    };
                    if (query.open_to_all) {
                        let opentoall = Number(query.open_to_all)
                        if (opentoall === 0) {
                            filter['open_to_all'] = opentoall;

                        } else if (opentoall === 1) {

                            filter['open_to_all'] = opentoall;

                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                } else if (statusfilter && percentagefilter) {
                    if (query.placement_status) {
                        let status = Number(query.placement_status)
                        if (status === 0) {
                            filter['placement_status'] = status;
                        } else if (status === 1) {
                            filter['placement_status'] = status;
                        } else if (status === 2) {
                            filter['placement_status'] = status;
                        } else if (status === 3) {
                            filter['placement_status'] = status;
                        } else {
                            return {
                                'code': 400
                            };
                        }
                    };
                    if (query.ten || query.twelve ||
                        query.ug || query.pg || query.diploma) {
                        let ten = Number(query.ten)
                        let twelve = Number(query.twelve)
                        let ug = Number(query.ug)
                        let pg = Number(query.pg)
                        let diploma = Number(query.diploma)
                        if (ten && twelve && ug && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve &&
                            ug && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (ten && twelve &&
                            ug && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve &&
                            pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten &&
                            ug && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (twelve &&
                            ug && pg && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ten && twelve && ug) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (ten && twelve && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && twelve && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && ug && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && ug && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ten && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (twelve && ug && pg) {

                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (twelve && ug && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (twelve && pg && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ug && pg && diploma) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }

                        } else if (ten && ug) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (ten && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (twelve && ug) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (twelve && pg) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (twelve && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ug && pg) {

                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ug && diploma) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (pg && diploma) {
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten) {
                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100

                            }

                        } else if (twelve) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                        } else if (ug) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (pg) {
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (diploma) {
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                } else if (opentoallfilter && percentagefilter) {
                    if (query.open_to_all) {
                        let opentoall = Number(query.open_to_all)
                        if (opentoall === 0) {
                            filter['open_to_all'] = opentoall;

                        } else if (opentoall === 1) {

                            filter['open_to_all'] = opentoall;

                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                    if (query.ten || query.twelve ||
                        query.ug || query.pg || query.diploma) {
                        let ten = Number(query.ten)
                        let twelve = Number(query.twelve)
                        let ug = Number(query.ug)
                        let pg = Number(query.pg)
                        let diploma = Number(query.diploma)
                        if (ten && twelve && ug && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve &&
                            ug && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (ten && twelve &&
                            ug && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve &&
                            pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten &&
                            ug && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (twelve &&
                            ug && pg && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ten && twelve && ug) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (ten && twelve && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && twelve && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && ug && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && ug && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ten && pg && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (twelve && ug && pg) {

                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (twelve && ug && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (twelve && pg && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (ug && pg && diploma) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten && twelve) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }

                        } else if (ten && ug) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (ten && pg) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ten && diploma) {

                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (twelve && ug) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (twelve && pg) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (twelve && diploma) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ug && pg) {

                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }

                        } else if (ug && diploma) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }
                        } else if (pg && diploma) {
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else if (ten) {
                            filter["percentage.ten"] = {
                                $gte: ten,
                                $lte: 100

                            }

                        } else if (twelve) {
                            filter["percentage.twelve"] = {
                                $gte: twelve,
                                $lte: 100
                            }
                        } else if (ug) {
                            filter["percentage.ug"] = {
                                $gte: ug,
                                $lte: 100
                            }
                        } else if (pg) {
                            filter["percentage.pg"] = {
                                $gte: pg,
                                $lte: 100
                            }
                        } else if (diploma) {
                            filter["percentage.diploma"] = {
                                $gte: diploma,
                                $lte: 100
                            }

                        } else {
                            return {
                                'code': 400
                            };
                        }
                    }
                } else if (salaryfilter) {

                    let minimum_salary = Number(query.min_salary)
                    let maximum_salary = Number(query.max_salary)


                    if (minimum_salary && maximum_salary) {
                        filter['salary.min_salary'] = {
                            $gte: minimum_salary
                        }
                        filter['salary.max_salary'] = {
                            $lte: maximum_salary
                        }
                    } else {
                        return {
                            'code': 400
                        };
                    }
                } else if (datefilter) {
                    filter['placement_timestamp'] = datenumber;
                } else if (statusfilter) {
                    let status = Number(query.placement_status)
                    if (status === 0) {
                        filter['placement_status'] = status;
                    } else if (status === 1) {
                        filter['placement_status'] = status;
                    } else if (status === 2) {
                        filter['placement_status'] = status;
                    } else if (status === 3) {
                        filter['placement_status'] = status;
                    } else {
                        return {
                            'code': 400
                        };
                    }
                } else if (opentoallfilter) {
                    let opentoall = Number(query.open_to_all)
                    if (opentoall === 0) {
                        filter['open_to_all'] = opentoall;

                    } else if (opentoall === 1) {

                        filter['open_to_all'] = opentoall;

                    } else {
                        return {
                            'code': 400
                        };
                    }
                } else if (percentagefilter) {
                    let ten = Number(query.ten)
                    let twelve = Number(query.twelve)
                    let ug = Number(query.ug)
                    let pg = Number(query.pg)
                    let diploma = Number(query.diploma)
                    if (ten && twelve && ug && pg && diploma) {

                        filter["percentage.ten"] = {
                            $gte: ten,
                            $lte: 100
                        }
                        filter["percentage.twelve"] = {
                            $gte: twelve,
                            $lte: 100
                        }
                        filter["percentage.ug"] = {
                            $gte: ug,
                            $lte: 100
                        }
                        filter["percentage.pg"] = {
                            $gte: pg,
                            $lte: 100
                        }
                        filter["percentage.diploma"] = {
                            $gte: diploma,
                            $lte: 100
                        }

                    } else if (ten && twelve &&
                        ug && pg) {

                        filter["percentage.ten"] = {
                            $gte: ten,
                            $lte: 100
                        }
                        filter["percentage.twelve"] = {
                            $gte: twelve,
                            $lte: 100
                        }
                        filter["percentage.ug"] = {
                            $gte: ug,
                            $lte: 100
                        }
                        filter["percentage.pg"] = {
                            $gte: pg,
                            $lte: 100
                        }
                    } else if (ten && twelve &&
                        ug && diploma) {

                        filter["percentage.ten"] = {
                            $gte: ten,
                            $lte: 100
                        }
                        filter["percentage.twelve"] = {
                            $gte: twelve,
                            $lte: 100
                        }
                        filter["percentage.ug"] = {
                            $gte: ug,
                            $lte: 100
                        }
                        filter["percentage.diploma"] = {
                            $gte: diploma,
                            $lte: 100
                        }

                    } else if (ten && twelve &&
                        pg && diploma) {

                        filter["percentage.ten"] = {
                            $gte: ten,
                            $lte: 100
                        }
                        filter["percentage.twelve"] = {
                            $gte: twelve,
                            $lte: 100
                        }
                        filter["percentage.pg"] = {
                            $gte: pg,
                            $lte: 100
                        }
                        filter["percentage.diploma"] = {
                            $gte: diploma,
                            $lte: 100
                        }

                    } else if (ten &&
                        ug && pg && diploma) {

                        filter["percentage.ten"] = {
                            $gte: ten,
                            $lte: 100
                        }
                        filter["percentage.ug"] = {
                            $gte: ug,
                            $lte: 100
                        }
                        filter["percentage.pg"] = {
                            $gte: pg,
                            $lte: 100
                        }
                        filter["percentage.diploma"] = {
                            $gte: diploma,
                            $lte: 100
                        }

                    } else if (twelve &&
                        ug && pg && diploma) {
                        filter["percentage.twelve"] = {
                            $gte: twelve,
                            $lte: 100
                        }
                        filter["percentage.ug"] = {
                            $gte: ug,
                            $lte: 100
                        }
                        filter["percentage.pg"] = {
                            $gte: pg,
                            $lte: 100
                        }
                        filter["percentage.diploma"] = {
                            $gte: diploma,
                            $lte: 100
                        }
                    } else if (ten && twelve && ug) {

                        filter["percentage.ten"] = {
                            $gte: ten,
                            $lte: 100
                        }
                        filter["percentage.twelve"] = {
                            $gte: twelve,
                            $lte: 100
                        }
                        filter["percentage.ug"] = {
                            $gte: ug,
                            $lte: 100
                        }
                    } else if (ten && twelve && pg) {

                        filter["percentage.ten"] = {
                            $gte: ten,
                            $lte: 100
                        }
                        filter["percentage.twelve"] = {
                            $gte: twelve,
                            $lte: 100
                        }
                        filter["percentage.pg"] = {
                            $gte: pg,
                            $lte: 100
                        }

                    } else if (ten && twelve && diploma) {

                        filter["percentage.ten"] = {
                            $gte: ten,
                            $lte: 100
                        }
                        filter["percentage.twelve"] = {
                            $gte: twelve,
                            $lte: 100
                        }
                        filter["percentage.diploma"] = {
                            $gte: diploma,
                            $lte: 100
                        }

                    } else if (ten && ug && pg) {

                        filter["percentage.ten"] = {
                            $gte: ten,
                            $lte: 100
                        }
                        filter["percentage.ug"] = {
                            $gte: ug,
                            $lte: 100
                        }
                        filter["percentage.pg"] = {
                            $gte: pg,
                            $lte: 100
                        }

                    } else if (ten && ug && diploma) {

                        filter["percentage.ten"] = {
                            $gte: ten,
                            $lte: 100
                        }
                        filter["percentage.ug"] = {
                            $gte: ug,
                            $lte: 100
                        }
                        filter["percentage.diploma"] = {
                            $gte: diploma,
                            $lte: 100
                        }
                    } else if (ten && pg && diploma) {

                        filter["percentage.ten"] = {
                            $gte: ten,
                            $lte: 100
                        }
                        filter["percentage.pg"] = {
                            $gte: pg,
                            $lte: 100
                        }
                        filter["percentage.diploma"] = {
                            $gte: diploma,
                            $lte: 100
                        }

                    } else if (twelve && ug && pg) {

                        filter["percentage.twelve"] = {
                            $gte: twelve,
                            $lte: 100
                        }
                        filter["percentage.ug"] = {
                            $gte: ug,
                            $lte: 100
                        }
                        filter["percentage.pg"] = {
                            $gte: pg,
                            $lte: 100
                        }
                    } else if (twelve && ug && diploma) {
                        filter["percentage.twelve"] = {
                            $gte: twelve,
                            $lte: 100
                        }
                        filter["percentage.ug"] = {
                            $gte: ug,
                            $lte: 100
                        }
                        filter["percentage.diploma"] = {
                            $gte: diploma,
                            $lte: 100
                        }
                    } else if (twelve && pg && diploma) {
                        filter["percentage.twelve"] = {
                            $gte: twelve,
                            $lte: 100
                        }
                        filter["percentage.pg"] = {
                            $gte: pg,
                            $lte: 100
                        }
                        filter["percentage.diploma"] = {
                            $gte: diploma,
                            $lte: 100
                        }
                    } else if (ug && pg && diploma) {
                        filter["percentage.ug"] = {
                            $gte: ug,
                            $lte: 100
                        }
                        filter["percentage.pg"] = {
                            $gte: pg,
                            $lte: 100
                        }
                        filter["percentage.diploma"] = {
                            $gte: diploma,
                            $lte: 100
                        }

                    } else if (ten && twelve) {

                        filter["percentage.ten"] = {
                            $gte: ten,
                            $lte: 100
                        }
                        filter["percentage.twelve"] = {
                            $gte: twelve,
                            $lte: 100
                        }

                    } else if (ten && ug) {

                        filter["percentage.ten"] = {
                            $gte: ten,
                            $lte: 100
                        }
                        filter["percentage.ug"] = {
                            $gte: ug,
                            $lte: 100
                        }
                    } else if (ten && pg) {

                        filter["percentage.ten"] = {
                            $gte: ten,
                            $lte: 100
                        }
                        filter["percentage.pg"] = {
                            $gte: pg,
                            $lte: 100
                        }

                    } else if (ten && diploma) {

                        filter["percentage.ten"] = {
                            $gte: ten,
                            $lte: 100
                        }
                        filter["percentage.diploma"] = {
                            $gte: diploma,
                            $lte: 100
                        }
                    } else if (twelve && ug) {
                        filter["percentage.twelve"] = {
                            $gte: twelve,
                            $lte: 100
                        }
                        filter["percentage.ug"] = {
                            $gte: ug,
                            $lte: 100
                        }
                    } else if (twelve && pg) {
                        filter["percentage.twelve"] = {
                            $gte: twelve,
                            $lte: 100
                        }
                        filter["percentage.pg"] = {
                            $gte: pg,
                            $lte: 100
                        }
                    } else if (twelve && diploma) {
                        filter["percentage.twelve"] = {
                            $gte: twelve,
                            $lte: 100
                        }
                        filter["percentage.diploma"] = {
                            $gte: diploma,
                            $lte: 100
                        }

                    } else if (ug && pg) {

                        filter["percentage.ug"] = {
                            $gte: ug,
                            $lte: 100
                        }
                        filter["percentage.pg"] = {
                            $gte: pg,
                            $lte: 100
                        }

                    } else if (ug && diploma) {
                        filter["percentage.ug"] = {
                            $gte: ug,
                            $lte: 100
                        }
                        filter["percentage.diploma"] = {
                            $gte: diploma,
                            $lte: 100
                        }
                    } else if (pg && diploma) {
                        filter["percentage.pg"] = {
                            $gte: pg,
                            $lte: 100
                        }
                        filter["percentage.diploma"] = {
                            $gte: diploma,
                            $lte: 100
                        }

                    } else if (ten) {
                        filter["percentage.ten"] = {
                            $gte: ten,
                            $lte: 100

                        }
                    } else if (twelve) {
                        filter["percentage.twelve"] = {
                            $gte: twelve,
                            $lte: 100
                        }
                    } else if (ug) {
                        filter["percentage.ug"] = {
                            $gte: ug,
                            $lte: 100
                        }
                    } else if (pg) {
                        filter["percentage.pg"] = {
                            $gte: pg,
                            $lte: 100
                        }
                    } else if (diploma) {
                        filter["percentage.diploma"] = {
                            $gte: diploma,
                            $lte: 100
                        }

                    } else {
                        return {
                            'code': 400
                        };
                    }
                }

            }

            if (Object.keys(filter).length === 0) {
                if (placement_register_date_find.length > 0 || placement_date_find.length > 0 || placement_expire_date_find.length > 0) {
                    if (placement_register_date_find.length > 0) {
                        const update_placement_result_status = await company_placement_model.updateMany(register_date, {
                            'registration_status': 1
                        }, {
                            upsert: true
                        })

                    }
                    if (placement_expire_date_find.length > 0) {

                        // let element = placement_date_find[0].placement_timestamp
                        const update_placement_result_status = await company_placement_model.updateMany(expire_date, {
                            'placement_status': 2
                        }, {
                            upsert: true
                        })

                    }
                    if (placement_date_find.length > 0) {

                        // let element = placement_date_find[0].placement_timestamp
                        const update_placement_result_status = await company_placement_model.updateMany(placement_date, {
                            'placement_status': 1
                        }, {
                            upsert: true
                        })

                    }

                }


                fetch_company_placement = await company_placement_model.find(filter)
            } else {
                fetch_company_placement = await company_placement_model.find(filter)
            }
            return fetch_company_placement

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
    async updatecompanyPlacement(payload, params) {
        try {

            let word = payload.company_name.substring(0, 3).toUpperCase()
            let random_number = Math.floor(Math.random() * 1000)
            let random_number1 = Math.floor(Math.random() * 1000)
            let randomword = randomstring.generate(2).toUpperCase()
            let id = `${word}${random_number}${random_number}${random_number1}${randomword}${word}${randomword}`

            let date = new Date().getDate()
            let day = new Date().getMonth() + 1
            let year = new Date().getFullYear()
            let today_generate = `${year}-${day}-${date}`
            let today = new Date(`${today_generate},00:00:00:00`).getTime()
            if (payload.placement_date === "" && payload.registration_date === "") {

                payload["placement_timestamp"] = 0
                payload["placement_status"] = 3
                payload["registration_timestamp"] = 0
                payload["registration_status"] = 2

            }
            else if (payload.placement_date && payload.registration_date) {
                payload["placement_status"] = 0
                payload["registration_status"] = 0
                payload['placement_timestamp'] = new Date(`${payload.placement_date},00:00:00:00`).getTime()
                payload['registration_timestamp'] = new Date(`${payload.registration_date},'00:00:00:00`).getTime()


            }

            else if (payload.placement_date === "") {
                payload["placement_timestamp"] = 0
                payload["placement_status"] = 3
                payload["registration_status"] = 0
                payload['registration_timestamp'] = new Date(`${payload.registration_date},'00:00:00:00`).getTime()

            }
            else if (payload.registration_date === "") {
                payload["registration_timestamp"] = 0
                payload["registration_status"] = 2
                payload["placement_status"] = 0
                payload['placement_timestamp'] = new Date(`${payload.placement_date},00:00:00:00`).getTime()


            }




            let company_listing_payload = {
                'company_name': payload.company_name,
                'website': payload.company_website,
                'email': payload.company_email
            }

            let company_placement_find = await company_placement_model.find({
                'placement_id': params.id
            })
            if (company_placement_find[0].company_name === payload.company_name && company_placement_find[0].company_website ===
                payload.company_website && company_placement_find[0].company_email === payload.company_email) {

                let company_placement_update = await company_placement_model.findOneAndUpdate({
                    'placement_id': params.id
                }, payload)
                return company_placement_update

            } else if (company_placement_find[0].company_name !==
                payload.company_name && company_placement_find[0].company_website !==
                payload.company_website && company_placement_find[0].company_email !== payload.company_email) {

                payload['id'] = id
                company_listing_payload['id'] = id

                let company_placement_update = await company_placement_model.findOneAndUpdate({
                    'placement_id': params.id
                }, payload)
                const company_list_create = new company_listing_model(company_listing_payload)
                let company_list = await company_list_create.save()
                return company_placement_update
            } else {
                return {
                    'code': 400
                }
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
    async deletecompanyPlacement(params) {
        try {
            let company_placement_delete = await company_placement_model.deleteOne({
                'placement_id': params.id
            })
            return company_placement_delete
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
            const delete_many = await company_placement_model.deleteMany({
                'placement_id': payload.ids
            })
            return delete_many
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

module.exports = company_placement_services