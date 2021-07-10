const createExpressApp = require("./middleware/createApplication")
const handlebars = require("./middleware/useHandleBars")
const ex_middleware = require("./middleware/exception_middleware")
const session = require("./middleware/useSession")
const {Logger} = require("./utility/logger")
const io = require("./utility/socker.io")
const http = require("http") 






var app = createExpressApp()
var Server = http.createServer(app)
if (process.env.NODE_ENV !== 'production') {
    Logger.SetConsoleLogger()
    }

    process.on('uncaughtException',(ex)=>{
        Logger.error(ex.message,ex)
      })


io(Server)
session(app)
handlebars(app,__dirname)




const room = require("./routes/room")
const user = require("./routes/user")   
    
app.use("/room",room)
app.use("/user",user)
app.use(ex_middleware)

Server.listen(app.get('port'),function(){
    Logger.info(`server listening on port ${app.get('port')}`)
});
//app.listen(app.get('port'), function() {});
