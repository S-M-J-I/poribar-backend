const express = require('express')
const admin = require('../firebase/firebaseAuth')
const router = express.Router()
const User = require('../models/User')
const auth = require('../middleware/auth')
const multer = require('multer')
const uploadAvatar = multer({ dest: 'images/avatar' })
const image_dirs = require('../middleware/image_filter')
const userMiddleware = require('../middleware/userMiddlewares')
const fs = require('fs')
const path = require('path')

router.post('/signup', uploadAvatar.single('avatar'), async (req, res) => {

    try {
        console.log(req.body)
        await userMiddleware.saveUser(req.body, req.file, "user")
        res.status(200).send({status:"success"})
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

router.post('/profile/update', uploadAvatar.none() , async (req, res) => {
    try {
        // username, email, pass, ph no, photo
        // fields prefilled
        // console.log(req.body)
        const {name,email,phone,type } = req.body
        await User.updateOne({ uid: req.body.uid }, { name,email,phone, type})
        console.log('ok')
        res.status(201).send({status:"success"})

        
    } catch (err) {
        res.status(500).send(err)
    }
})
router.post('/profile/remove',uploadAvatar.none(), async (req,res)=>{
    try{
        const {uid} = req.body
        await User.deleteOne({uid: uid})
        await admin.auth().deleteUser(uid)
        res.status(201).send({status:'success'})
    }catch(err){
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
        res.status(500).send("Something went wrong")
    }
})

router.post('/getall',uploadAvatar.none(),async (req,res)=>{
        try{
            const users = await userMiddleware.getAllUsers('user')
            res.status(200).send(users)
        }catch(err){
            console.log(err)
            res.status(500).send("Something went wrong")
        }
});
module.exports = router