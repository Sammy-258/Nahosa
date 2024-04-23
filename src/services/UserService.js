const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
exports.findUserByEmail = async (email) => { 
    return prisma.user.findUnique({ where: {email}})
}

exports.createUser = async (email, name, password) => {
    try {
        const hashPassword = await bcryptjs.hash(password, 10)
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashPassword
            }
        })
        return user
    } catch (error) {
        console.error(error)
    }
}

exports.updateLoginAttempts = async (email) => {
    try {
        await prisma.user.update({
            where: {email},
            data : {
                loginAttempts:  {
                    increment : 1
                }
            }
        })
    } catch (error) {
        console.error(error)
    }
}

exports.resetLoginAttempts = async (email) => {
    try {
        await prisma.user.update({
            where: {email},
            data : {
                loginAttempts: 0
            }
        })
    } catch (error) {
        console.error(error)
    }
}

exports.lockUserAccount = async (email, lockDuration) => {
    try {
        await prisma.user.update({
            where: {email},
            data : {
                isLocked:  true,
                lockDuration : lockDuration
            }
        })
    } catch (error) {
        console.error(error)
    }
}

exports.unlockUserAccount = async (email) => {
    try {
        await prisma.user.update({
            where: {email},
            data : {
                isLocked:  false,
                lockDuration : null,
                loginAttempts: 0
            }
        })
    } catch (error) {
        console.error(error)
    }
}

exports.generateToken = (userId, userEmail) => {
    const payload ={
        userId: userId,
        userEmail: userEmail
    }
    const options = {
        expiresIn: process.env.JWT_DURATION
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, options)
    return token
}

exports.findUnverifiedUsers = () => {
    const unverifiedUsers = prisma.user.findMany({
        where: {
            isVerified: null
        }
    });

    return unverifiedUsers
}

exports.sendVerificationEmail = (email) => {
    console.log(`verification email has been sent to ${email}`)
}

