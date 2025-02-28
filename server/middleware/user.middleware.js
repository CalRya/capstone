const UserModel = require('../models/Users.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const AuditLog = require('../models/Auditlog.model')
const OtpModel = require('../models/Otp.model')
const nodemailer = require('nodemailer');
require('dotenv').config()

const Log = async ({ userId, action, collectionName, documentId, changes, description }) => {
    await AuditLog.create({ userId, action, collectionName, documentId, changes, description })
}

const Email = async ({ email, userId }) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: 'bonoir80@gmail.com',
                pass: process.env.EmailPassword
            },
        });

        let otp;
        let testOtp;
        do {
            otp = Math.floor(100000 + Math.random() * 900000).toString();
            testOtp = await OtpModel.findOne({ otp: otp });
        } while (testOtp);

        await OtpModel.create({ user: userId._id, otp: otp })

        await transporter.sendMail({
            from: `"Metrobank 👻" <bonoir80@gmail.com>`,
            to: email,
            subject: "Your (pseudo)Metrobank Verification Code",
            html: `
                    <h3>This is for TESTING!!! <br/>
                    Please do not share your one-time-password.<h3/> <br />
                    <h1>${otp}<h1/>
                    `
        });
    } catch (error) {
        console.error(error)
    }
}

const UserMidlleware = {
    CheckUserTokenValid: async (req, res, next) => {
        try {
            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1]
            if (token === null) return res.json({ authorization: `You are not authorized: null` })
            if (token === undefined) return res.json({ authorization: `You are not authorized: undefined` })

            jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
                // if (err) return res.sendStatus(403)
                if (err) return res.json({ authorization: `You are not authorized. : ${err}` })
                req.userId = decoded.userId
                next()
            })
        } catch (error) {
            res.json({ error: `CheckUserTokenValid in user middleware error ${error}` });
        }
    },
    CheckDeveloperTokenValid: async (req, res, next) => {
        try {
            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1]
            if (token === null) return res.json({ authorization: `You are not authorized: null` })
            if (token === undefined) return res.json({ authorization: `You are not authorized: undefined` })

            if (token === process.env.ADMIN_TOKEN) return next()
            res.json({ success: false, message: 'A token is required, nor token is incorrect!' })
        } catch (error) {
            res.json({ error: `CheckDeveloperTokenValid in user middleware error ${error}` });
        }
    },
    LoginUserCheckEmptyFields: async (req, res, next) => {
        try {
            const { email, password } = req.body
            if (!email || !password) return res.json({ success: false, message: 'Required fields should not be empty.' })
            next()
        } catch (error) {
            res.json({ error: `LoginUserCheckEmptyFields in user middleware error ${error}` });
        }
    },
    LoginUserCheckEmail: async (req, res, next) => {
        try {
            const { email } = req.body
            const testEmail = await UserModel.findOne({ email: email })

            if (!testEmail) return res.json({ success: false, message: 'User not found.', testEmail })
            next()
        } catch (error) {
            res.json({ error: `LoginUserCheckEmail in user middleware error ${error}` });
        }
    },
    LoginUserCheckPassword: async (req, res, next) => {
        try {
            const { email, password } = req.body
            const user = await UserModel.findOne({ email: email })

            if (user) {
                const testPassword = await bcrypt.compare(password, user.password)

                if (testPassword) {
                    next()
                } else {
                    res.json({ success: false, message: 'Email or password is Incorrect!' })
                }
            } else {
                res.json({ success: false, message: 'Email or password is Incorrect!' })
            }
        } catch (error) {
            res.json({ error: `LoginUserCheckPassword in user middleware error ${error}` });
        }
    },
    LoginUserCheckIsActive: async (req, res) => {
        try {
            const { email } = req.body
            const user = await UserModel.findOne({ email: email })

            if (user?.isactive) {
                const token = jwt.sign({ userId: user._id }, process.env.SECRET_TOKEN, { expiresIn: '1d' })
                Log({ userId: user?._id, action: 'read', collectionName: 'User', documentId: user?._id, description: `${email} attempted to login` })

                res.json({ success: true, message: 'Login Successful.', user: { isactive: true }, token, name: user.name, userId: user._id, role: user.role })
            } else {
                await Email({ email, userId: user })
                res.json({ success: true, message: 'Login Successful.', user: { isactive: false } })
            }

        } catch (error) {
            res.json({ error: `LoginUserCheckIsActive in user middleware error ${error}` })
        }
    },
    EmailVerification: async (req, res, next) => {
        try {
            const { otp } = req.body

            if (!otp) return res.json({ success: false, message: 'One-time-password must not be empty.' })

            const testOtp = await OtpModel.findOne({ otp: otp })
            if (testOtp) {
                await UserModel.findByIdAndUpdate(
                    testOtp.user,
                    { isactive: true },
                    { new: true }
                )

                const userCred = await UserModel.findById(testOtp.user)
                const token = jwt.sign({ userId: userCred._id }, process.env.SECRET_TOKEN, { expiresIn: '1d' })

                res.json({ success: true, message: 'User verified.', token, name: userCred.name, userId: userCred._id, role: userCred.role })
            } else {
                res.json({ success: false, message: 'Invalid one-time-password!' })
            }

        } catch (error) {
            console.error({ success: false, message: `Error in email function: ${error}` })
        }

    },
    CreateUserCheckEmptyFields: async (req, res, next) => {
        try {
            next()
        } catch (error) {
            res.json({ error: `CreateUserCheckEmptyFields in user middleware error ${error}` });
        }
    },
    CreateUserCheckAdminIfDoesNotExist: async (req, res, next) => {
        try {
            const { email, password, mobileno, name } = req.body

            const testAdmin = await UserModel.find({ role: 'admin' })

            if (testAdmin.length > 0) {
                const testEmail = await UserModel.find({ email: email })
                const testMobileNo = await UserModel.find({ mobileno: mobileno })
                if (testEmail.length > 0) return res.json({ success: false, message: 'Email already exists!' })
                if (testMobileNo.length > 0) return res.json({ success: false, message: 'Mobile number already exists!' })
                next()
            } else {
                await UserModel.create({ email, mobileno, isactive: true, name, password, role: 'admin' })
                res.json({ success: false, message: 'No admin existing, user turned to admin!' })
            }

        } catch (error) {
            res.json({ error: `CreateUserCheckUserIfExists in user middleware error ${error}` });
        }
    },
    CreateUserCheckUserIfExists: async (req, res, next) => {
        try {
            const { email, mobileno } = req.body
            const testEmail = await UserModel.find({ email: email })
            const testMobileNo = await UserModel.find({ mobileno: mobileno })
            if (testEmail.length > 0) return res.json({ success: false, message: 'Email already exists!' })
            if (testMobileNo.length > 0) return res.json({ success: false, message: 'Mobile number already exists!' })
            next()
        } catch (error) {
            res.json({ error: `CreateUserCheckUserIfExists in user middleware error ${error}` });
        }
    },
    CreateUserHashedPassword: async (req, res, next) => {
        try {
            const values = req.body
            const hash = await bcrypt.hash(values.password, 10)
            values.password = hash
            next()
        } catch (error) {
            res.json({ error: `CreateUserHashedPassword in user middleware error ${error}` });
        }
    },
    UpdateUserCheckEmptyFields: async (req, res, next) => {
        try {
            next()
        } catch (error) {
            res.json({ error: `UpdateUserCheckEmptyFields in user middleware error ${error}` });
        }
    },
}

module.exports = UserMidllewares