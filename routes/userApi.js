const express = require('express')
const admin = require('../firebase/firebaseAuth')
const router = express.Router()
const User = require('../models/User')
const Nurse = require('../models/Nurse')
const auth = require('../middleware/auth')
const multer = require('multer')
const uploadAvatar = multer({ dest: 'images/avatar' })
const image_dirs = require('../middleware/image_filter')

const fs = require('fs')
const path = require('path')

router.post('/user/signup', uploadAvatar.single('avatar'), async (req, res) => {

    try {
        const data = Object.assign({}, req.body)

        admin.auth().createUser(req.body)
            .then(async user => {
                console.log(data)

                console.log(req.file.originalname)
                const file = req.file.originalname
                const ext = file.split('.')[1]

                const { name, username, email, password } = data


                const savedUser = new User({
                    uid: user.uid,
                    name,
                    username,
                    email,
                    password,
                    avatar: req.file.filename,
                    ext: req.file.originalname.split('.')[1]
                })

                await savedUser.save()

                res.status(200).send("Registered User")
            })
            .catch(err => {
                res.status(500).send(err)
            })


    } catch (err) {
        res.send(err)
    }
})


router.post('/nurse/signup', async (req, res) => {

    try {

        admin.auth().createUser(req.body)
            .then(async user => {
                const nurse = new Nurse({
                    uid: user.uid,
                    ...req.body
                })

                await nurse.save()
                res.status(200).send("Registered Nurse")
            })
            .catch(err => {
                res.send("Error")
            })


    } catch (err) {
        res.send(err)
    }
})


router.post('/user/profile', async (req, res) => {
    console.log(req.body)
    try {
        const user = await User.findOne({ 'uid': req.body.uid })
        res.status(200).send(user)
    } catch (err) {
        res.status(500).send("Something went wrong")
    }
})

router.post('/user/images', async (req, res) => {
    try {
        // req.body.reqFor: avatar
        // res.redirect('/user/profile/avatar')


        const { reqFor, filename } = req.body
        console.log(reqFor)
        console.log(image_dirs)
        console.log('dir: ', __dirname)

        const filepath = `${image_dirs.get(reqFor)}/${filename}`
        fp = path.join(__dirname, '../', filepath)

        console.log(path)
        res.sendFile(fp, function (err) {
            res.status(500).send("Server more gese")
        })

    } catch (err) {
        console.log("HELLO BITCHES")
        res.status(500).send("Server more gese")
    }
})

router.post('/user/profile/update', auth, async (req, res) => {
    try {
        // username, email, pass, ph no, photo

    } catch (err) {

    }
})

module.exports = router