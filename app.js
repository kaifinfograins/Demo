const express = require("express")
const app = express()
const connection = require("./config/mongoose")

const bodyParser = require("body-parser")
const port = 8080;

const demoRoutes = require("./routes/demoRouter")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))


// for session create

const session = require("express-session")

app.use(
    session({
        secret:"hello",
        resave: false,
        saveUninitialized: true,
        cookie: {maxAge : 60000},
    })
    );






app.use("/api",demoRoutes)



app.listen(port, ()=>{
    console.log(`server start successfully at port : http://localhost:${port}`)
})