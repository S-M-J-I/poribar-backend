require('../firebase/firebaseAuth')

const auth = (req, res, next) => {
    if (req.body.token) {
        admin.auth.verifyIdToken(req.body.token)
            .then(tokenElement => {
                // verified here
                console.log(token)

                // verify user type from db findOne({uid: user.uid})
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