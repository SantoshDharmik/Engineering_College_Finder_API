import jwt from "jsonwebtoken"

import {userModel} from "../models/userSchema.js"


let checkAdmin = async (req, res, next) => {
    try {
        let { token } = req.headers

        if (!token) throw ("not a valid token !")

        let decode = jwt.verify(token, process.env.JWT_SECRET)    

        let validUser = await userModel.findOne({ "email": decode.email })

        if (!validUser) throw ("not a valid user !")

        req.user = validUser

        //to perform step by step procces in code
        next()

    } catch (error) {
         console.log("error from checkAdmin middleware : ", error)
        res.status(401).json({ message: "failed to execute process !", error })

    }
}

export { checkAdmin}