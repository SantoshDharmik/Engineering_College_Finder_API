import express from "express"

import dotenv from "dotenv"

import "./database/connection.js"

import mongoose from "mongoose"

import { router } from "./routers/router.js"

import { userRouter } from "./routers/userRouter.js"

dotenv.config({path: "./config.env"})

let app = express()

let port = process.env.port

app.use(express.urlencoded({ extended: true}))

app.use(express.json())

app.use(express.static("public"))

app.get('/', (req,res) => {res.redirect("/colleges/api/get-details")
})

app.use("/colleges/api", router)
// we can create these common router to perform all oiptions

app.use("/users/api", userRouter)
// we can create these router to perform register and login oiptions

app.get((req,res) => {
    console.log("someone is trying to access a 404 route !")
    res.status(404).json({
        message:"content not found !"
    })
})

app.listen(port,() => {
    console.log(`server is running on port ${port}`)
})