const express = require("express")
const router = express.Router()

const{insertUser,updateUser,getUser,deleteUser,loginUser} = require("../controller/demoController")

router.post('/addUser',insertUser)
router.post('/login',loginUser)

router.put('/updateUser/:id',updateUser)
router.get('/userDetails',getUser)
router.delete('/deleteUser/:id',deleteUser)


module.exports=router;