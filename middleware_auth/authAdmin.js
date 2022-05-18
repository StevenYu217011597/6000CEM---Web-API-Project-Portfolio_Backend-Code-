const ShelterUsers = require('../Schema/userSchema')

const authAdmin = async (req, res, next)=> {
    try {
    const AccessDeniedErr = "Access denied. Please login as administartor!"
        const user = await ShelterUsers.findOne({
            _id: req.user.id
        })
        if(user.role === ""){
            return res.status(400).send({msg: AccessDeniedErr})
        }
        next()
    } catch (err) {
        return res.status(500).send({msg:err.message})
    }
}

module.exports = authAdmin