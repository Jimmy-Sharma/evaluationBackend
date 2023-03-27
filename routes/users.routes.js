const express = require("express")
const userRouter = express.Router()
const { LinkedinModel } = require("../model/linkedin.model")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


//User Registration
userRouter.post("/register", async (req, res) => {
    const { name, email, gender, password, age, city, is_married } = req.body
    try {
        bcrypt.hash(password, 5, async (err, hash) => {
            const user = new LinkedinModel({ name, email, gender, password: hash, age, city, is_married })
            await user.save()
            res.status(200).send({
                "msg": "Registration has been done succefully."
            })
        })
    } catch (error) {
        res.status(400).send({
            "msg": err.message
        })
    }
})

//User login
userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await LinkedinModel.findOne({ email })
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    res.status(200).send({
                        "msg": "Logged in Successfully", "token": jwt.sign({ "userID": user._id })
                    })
                } else {
                    res.status(400).send({
                        "msg": "Wrong Credentials"
                    })
                }
            })
        }
    } catch (err) {
        res.status(400).send({
            "msg": err.message
        })
    }
})

module.exports = {
    userRouter
}