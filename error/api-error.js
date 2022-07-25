class apiError{
    constructor(code,message){
        this.code = code;
        this.message = message
    }

    static badRequest(msg){
        return new apiError(400,msg)
    }
    static internal(msg){
        return new apiError(500,msg)
    }
    static conflict(msg){
        return new apiError(409,msg)
    }
}

module.exports = apiError