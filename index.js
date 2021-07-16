const createExpressApp = require("./middleware/createApplication")
const handlebars = require("./middleware/useHandleBars")
const ex_middleware = require("./middleware/exception_middleware")
const parser = require("./middleware/parser")
const session = require("./middleware/useSession")
const mongoDb = require("./middleware/mongoDb")
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

parser(app)
io(Server)
session(app)
handlebars(app,__dirname)
mongoDb()



const room = require("./routes/room")
const user = require("./routes/user")   
const home = require("./routes/home")  
app.use("/room",room)
app.use("/user",user)
app.use("/",home)
app.get("/errorlogs",async (req,res,)=>{
    res.sendFile(`${__dirname}/error.log`)
  })
app.use(ex_middleware)

Server.listen(app.get('port'),function(){
    Logger.info(`server listening on port ${app.get('port')}`)
});
//app.listen(app.get('port'), function() {});
