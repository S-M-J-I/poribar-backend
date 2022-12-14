const express = require('express')
const admin = require('../firebase/firebaseAuth')
const router = express.Router()
const User = require('../models/User')
const Nurse = require('../models/Nurse')
const Appointments = require('../models/Appointments')
const auth = require('../middleware/auth')
const multer = require('multer')
const uploadAvatar = multer({ dest: 'images/avatar' })
const image_dirs = require('../middleware/image_filter')
const userMiddleware = require('../middleware/userMiddlewares')
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')

router.post('/signup', uploadAvatar.single('avatar'), async (req, res) => {

    try {
        console.log(req.body)
        await userMiddleware.saveUser(req.body, req.file, "user")
        res.status(200).send({ status: "success" })
    } catch (err) {
        res.send(err)
    }
})




router.post('/images', async (req, res) => {
    try {
        // req.body.reqFor: avatar
        // res.redirect('/profile/avatar')


        const { reqFor, filename } = req.body
        console.log(reqFor)
        console.log('dir: ', __dirname)

        const filepath = `${image_dirs.get(reqFor)}/${filename}`
        fp = path.join(__dirname, '../', filepath)

        console.log(fp)
        res.sendFile(fp, function (err) {
            res.status(500).send("Server more gese")
        })

    } catch (err) {
        res.status(500).send("Server more gese")
    }
})

router.post('/profile/update/:uid', uploadAvatar.single('avatar'), async (req, res) => {
    try {
        // username, email, pass, ph no, photo
        // fields prefilled
        // console.log(req.body)

        let avatar = null
        if (req.file) {
            avatar = req.file.filename
        }

        let { name, username, email, phone, gender, blood_group, password } = req.body


        stringPassword = password
        password = await userMiddleware.hashPass(password)
        console.log(password)

        const user = await User.findOne({ uid: req.params.uid })
        const oldAvatar = user.avatar

        if (avatar) {
            await User.updateOne({ uid: req.params.uid }, { name, username, email, phone, gender, blood_group, password, avatar })
            fs.unlinkSync(path.join(__dirname, '../', `images/avatar/${oldAvatar}`))
        } else {
            await User.updateOne({ uid: req.params.uid }, { name, username, email, phone, gender, blood_group, password })
        }

        if (user.email !== email || !bcrypt.compare(password, user.password, (err, data) => {
            if (err) {
                return false
            }

            if (data) {
                return true
            }
        })) {
            admin.auth().updateUser(req.params.uid, {
                email: email,
                password: stringPassword
            })
        }

        if (user.type === 'nurse') {
            if (avatar) {
                await Nurse.updateOne({ uid: req.params.uid }, { name, username, email, phone, gender, blood_group, password, avatar })
            } else {
                await Nurse.updateOne({ uid: req.params.uid }, { name, username, email, phone, gender, blood_group, password })
            }
        }

        console.log('ok')
        res.status(201).send({ status: "success" })


    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
})
router.post('/profile/remove/:uid', uploadAvatar.none(), async (req, res) => {
    try {
        const user_uid = req.params.uid
        const user = await User.findOne({ uid: user_uid })
        await User.deleteOne({ uid: user_uid })
        await admin.auth().deleteUser(uid)
        if (user.type === 'user') {
            await Appointments.deleteMany({ customer: user_uid })
        } else if (user.type === 'nurse') {
            await Appointments.deleteMany({ nurse: user_uid })
        }

        res.status(201).send({ status: 'success' })
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
})
router.post('/profile/:uid', /* auth, */ async (req, res) => {
    try {
        const user = await userMiddleware.getUser(req.params.uid, "user")
        res.status(200).send(user)
    } catch (err) {
        // console.log("here")
        console.log(err)
        res.status(500).send("Something went wrong")
    }
})

router.post('/getall', uploadAvatar.none(), async (req, res) => {
    try {
        const users = await userMiddleware.getAllUsers('user')
        res.status(200).send(users)
    } catch (err) {
        console.log(err)
        res.status(500).send("Something went wrong")
    }
});
module.exports = router