const router = require('express').Router()
const userCtrl = require('../controllers/accountCtrl')
const AuthUser = require('../middleware_auth/authUser')

router.route('/register')
    .post(userCtrl.register)
router.route('/refresh_token')
    .get(userCtrl.refreshToken)
router.route('/login')
    .post(userCtrl.login)
router.route('/logout')
    .get(userCtrl.logout)
router.route('/userInfo')
    .get(AuthUser, userCtrl.getUserInfo)
router.route('/shelter')
    .patch(AuthUser, userCtrl.addFavourite)

module.exports = router