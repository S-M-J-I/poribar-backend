const firebaseAdmin = require('firebase-admin')
const service = require('../configs/poribar-test-firebase-adminsdk-uq165-0c324eab67.json')
const functions = require('firebase-functions')

const admin = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(service)
})


module.exports = admin