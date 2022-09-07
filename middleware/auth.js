require('../firebase/firebaseAuth')
const User = require('../models/User')
const Nurse = require('../models/Nurse')
const checkRoutes = require('../middleware/checkRoutes')
const fetch = require('node-fetch')

const auth = (req, res, next) => {
    if (req.body.token) {
        admin.auth.verifyIdToken(req.body.token)
            .then(async tokenElement => {
                // verified here
                console.log(token)

                const uid = req.body.user.uid

                // verify user type from db findOne({uid: user.uid})
                try {
                    // find from User
                    const user = await User.findOne({ uid: uid })
                    const type = "user"
                    if (!user) {
                        // if not user, find from nurse
                        user = await Nurse.findOne({ uid: uid })
                        type = "nurse"
                    }

                    const auth_status = checkRoutes(req.body.path, type)

                    if (auth_status === 1) {
                        // redir to path
                        fetch(path, {
                            method: 'POST',
                            body: JSON.stringify(req.body),
                            headers: { 'Content-Type': 'application/json' }
                        })
                            .then(res => res.json())
                            .then(json => {

                            })
                    } else if (auth_status === 2) {
                        // redir to path
                    }



                } catch (err) {
                    res.status(404).send("Error in finding")
                }


                // check auth routes of user
                // if valid forward req to api
                // then forward res to client res.send()
                // else unauth
                next()
            })
            .catch(err => {
                res.status(403).send("Unauthorized")
            })
    } else {
        res.status(403).send("Unauthorized")
    }
    next()
}

module.exports = auth