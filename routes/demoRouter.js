const express = require("express")
const router = express.Router()
const upload = require("../common/upload")

const{insertUser,updateUser,getUser,deleteUser,loginUser,changePassword,userLogout} = require("../controller/demoController")

router.post('/addUser', upload.single("image"),insertUser)

router.post('/login',loginUser)
router.get('/logOut', userLogout)
router.put('/changePassword',changePassword)

router.put('/updateUser/:id',updateUser)
router.get('/userDetails',getUser)
router.delete('/deleteUser/:id',deleteUser)


module.exports=router;