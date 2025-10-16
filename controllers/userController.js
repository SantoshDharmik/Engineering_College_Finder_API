import {userModel} from "../models/userSchema.js"

import bcrypt from "bcrypt"

import jwt from "jsonwebtoken"

let handleRegisterUser = async (req,res) => {
    try {

        let {name, phone, email, address, password} = req.body

        if (!name || !phone || !email || !address || !password) throw ("Incomplete data. Cannot Register User !")

            // if user trying to create with same number and email 

         let userExists = await userModel.findOne({ $or: [{ "email": email }, { "phone": phone }] })   
         
         if (userExists) throw ("email/phone already registred please enter a different email/phone or please head to login.")

        let newUser = new userModel({ name, phone, email, address, password })    

        await newUser.save()

         res.status(202).json({ message: `Successfully Registreded user with email ${email}` })



        
    }catch (error) {
        console.log('error while registering the user  : ', error)
        res.status(400).json({ message: "unable to register user", error })
    }
}


const handleLoginUser = async (req,res) => {
    try {
        let {email, password} = req.body

        if (!email || !password) throw ({ message: `Incomplete/invalid data`, status:400})

        let user = await userModel.findOne({"email":email})
        
        if (!user) throw ({ message: `user not found with email ${email}. Please register the user first.`, status: 404 })
        
        let validPassword = await bcrypt.compare(password,user.password)
        
        if (!validPassword) throw ({message: `incorret email/password !`, status: 401})

             let playLoad = { email: user.email }

              let token = await jwt.sign(playLoad
            , process.env.JWT_SECRET, { expiresIn: "0.25hr" })

        res.status(202).json({ message: "login successfull !", token })   


    } catch(error) {
        console.log("error while login : ", error)
        res.status(error.status || 401).json({ message: error.message || "unable to login at this moment. Please try again later !", error })
    }
}

export {handleRegisterUser,handleLoginUser}