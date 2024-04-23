const express = require("express")
const AuthController = require("../controllers/AuthController")
const authRoutes = express.Router()

authRoutes.post("/register", AuthController.registerUser)
authRoutes.post("/login", AuthController.loginUser)
authRoutes.post("/searchUser", AuthController.getUserFromNodeCache)
authRoutes.post("/updateBalnce", AuthController.updateBalance)
authRoutes.post("/getBalance", AuthController.getUserBalance)

module.exports = authRoutes