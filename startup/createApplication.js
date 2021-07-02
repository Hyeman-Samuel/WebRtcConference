var Express = require("express")

module.exports = function createApplication(){
    var application = Express()
    application.use(Express.json());
    application.set('port', process.env.PORT || 3000)
    return application
}