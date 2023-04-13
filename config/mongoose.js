const mongoose = require("mongoose")

mongoose.set("strictQuery",true)
const connection =mongoose.connect("mongodb://0.0.0.0:27017/Demo",{
    useNewUrlParser :true,
    useUnifiedTopology :true
}).then( ()=>{
    console.log("Database conneected successfully")
})

module.exports ={
    connection
}