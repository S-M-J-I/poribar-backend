const User = require('../models/User')
const Nurse = require('../models/Nurse')
const admin = require('../firebase/firebaseAuth')
const fs = require('fs')
const path = require('path')

const saveUser = async (body, avatar_file, type) => {
    const data = Object.assign({}, body)

    admin.auth().createUser(body)
        .then(async user => {

            const { name, username, email, password, phone,date } = data
            console.log(name, username, email, password)

            if (type === "user") {
                const savedUser = new User({
                    uid: user.uid,
                    name,
                    username,
                    email,
                    password,
                    phone,
                    date,
                    avatar: avatar_file.filename,
                    ext: avatar_file.originalname.split('.')[1]
                })

                await savedUser.save()
            } else if (type === "nurse") {
                const savedNurse = new Nurse({
                    uid: user.uid,
                    name,
                    username,
                    email,
                    password,
                    avatar: avatar_file.filename,
                    ext: avatar_file.originalname.split('.')[1]
                })

                await savedNurse.save()
            }

        })
        .catch(err => {
            throw err
        })
}

const getUser = async (uid, type) => {
    if (type === "user") {
        const user = await User.findOne({ uid: uid })
        let imageFileBuffer = fs.readFileSync(path.join(__dirname, '../', `images/avatar/${user.avatar}`), 'base64')
        user.avatar = imageFileBuffer
        return user
    } else if (type === "nurse") {
        const user = await Nurse.findOne({ uid: uid })
        let imageFileBuffer = fs.readFileSync(path.join(__dirname, '../', `images/avatar/${user.avatar}`), 'base64')
        user.avatar = imageFileBuffer
        return user
    }
}
const getAllUsers = async (type) => {
    if (type === "user") {
        const users = await User.find({})
        console.log(users)
        await Promise.all(users.map(user => {
            let imageFileBuffer = fs.readFileSync(path.join(__dirname, '../', `images/avatar/${user.avatar}`), 'base64')
            user.avatar = imageFileBuffer
        }))
        return users
    } else if (type === "nurse") {
        const users = await Nurse.find({})
        await Promise.all(users.forEach(user => {
            let imageFileBuffer = fs.readFileSync(path.join(__dirname, '../', `images/avatar/${user.avatar}`), 'base64')
            user.avatar = imageFileBuffer
        }))
        return users
    }
}

module.exports = {
    saveUser,
    getUser,
    getAllUsers
}