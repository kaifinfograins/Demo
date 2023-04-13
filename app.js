const express = require("express")
const app = express()
const connection = require("./config/mongoose")

const bodyParser = require("body-parser")
const port = 8080;

const demoRoutes = require("./routes/demoRouter")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))


app.use("/api",demoRoutes)



app.listen(port, ()=>{
    console.log(`server start successfully at port : http://localhost:${port}`)
})