const router = require('express').Router()
const dogCtrls = require('../controllers/dogCtrl')
const authUser = require('../middleware_auth/authUser')
const authAdmin = require('../middleware_auth/authAdmin')

router.get('/dogs', dogCtrls.getDogs)
router.post('/dogs', authUser, authAdmin, dogCtrls.createDog)
router.delete('/dogs/:id', authUser, authAdmin, dogCtrls.deleteDogs)
router.put('/dogs/:id', authUser, authAdmin, dogCtrls.updateDogs)

module.exports = router