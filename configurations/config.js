require('dotenv').config()

module.exports={
    port : process.env.PORT,
    connection : process.env.DB_CONNECTION
}