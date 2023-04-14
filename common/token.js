const jwt = require("jsonwebtoken")

const generateToken = async (payload)=>{
    const token  = await jwt.sign(payload,"kaif",{
            expiresIn:"1d"
    })
    return token;
}

module.exports = {
    generateToken
}