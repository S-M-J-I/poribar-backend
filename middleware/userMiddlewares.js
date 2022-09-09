const User = require('../models/User')
const Nurse = require('../models/Nurse')
const admin = require('../firebase/firebaseAuth')

const saveUser = async (body, avatar_file, type) => {
    const data = Object.assign({}, body)

    admin.auth().createUser(body)
        .then(async user => {

            const { name, username, email, password } = data
            console.log(name, username, email, password)

            if (type === "user") {
                const savedUser = new User({
                    uid: user.uid,
                    name,
                    username,
                    email,
                    password,
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
        return user
    } else if (type === "nurse") {
        const user = await Nurse.findOne({ uid: uid })
        return user
    }
}

module.exports = {
    saveUser,
    getUser
}