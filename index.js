var createExpressApp = require("./startup/createApplication")
var handlebars = require("./startup/useHandleBars")
const {Logger} = require("./utility/logger")
var io = require("./utility/socker.io")
var http = require("http") 
var app = createExpressApp()
var Server = http.createServer(app)
if (process.env.NODE_ENV !== 'production') {
    Logger.SetConsoleLogger()
    }

    process.on('uncaughtException',(ex)=>{
        Logger.error(ex.message,ex)
      })

io(Server)
handlebars(app,__dirname)




const room = require("./routes/room")
    
    
app.use("/room",room)

Server.listen(app.get('port'),function(){
    Logger.info(`server listening on port ${app.get('port')}`)
});
//app.listen(app.get('port'), function() {});

