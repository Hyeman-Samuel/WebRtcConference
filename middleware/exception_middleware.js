const {Logger} = require("../utility/Logger");

module.exports = function(err,req,res,next){
    res.status(500).send('Something failed')
    Logger.error(err.message,err)
}
