const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")


async function authMiddelware(req,res,next){
    
    const token = req.cookies.token || req.headers.authorzation?.split(" ")[1]

    if(!token){
        return res.status(401).json({
            message: " Unauthorized access, token is missing"
        })
    }

    const isBlacklisted = await tokenBlacklistModel.findOne({token})
    if(isBlacklisted){
        return res.status(401).json({
            message: " Unauthorized access, token is invalid "
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findById(decoded.userId)

        req.user = user 
        return next()
        
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            message: " Unauthorized access, Token is invalid "
        })
    }
}

async function authSystemMiddelware(req,res,next){

    const token = req.cookies.token || req.headers.authorzation?.split(" ")[1]
    if(!token){
        return res.status(401).json({
            message: "Unauthorized access, Token is missing please try again"
        })
    }


    const isBlacklisted = await tokenBlacklistModel.findOne({token})
    if(isBlacklisted){
        return res.status(401).json({
            message: " Unauthorized access, token is invalid "
        })
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findById(decoded.userId).select("+systemUser")
        if(!user.systemUser){
            return res.status(403).json({
                message: "Forbidden access, You are not a system user "
            })
        }
        req.user = user 
        return next()

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: " Internal Server Error"
        })
    }
}
module.exports = {
    authMiddelware,
    authSystemMiddelware
}