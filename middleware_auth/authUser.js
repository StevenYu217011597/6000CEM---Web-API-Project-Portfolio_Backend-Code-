const jsonwebtoken = require('jsonwebtoken')

const authUser = (req, res, next) => {
    try {
    const InvalidAuthErr = "Invalid Authentication"
        const jwttoken = req.header("AuthToken")
        if(!jwttoken){
            return res.status(400).send({msg:InvalidAuthErr})
        }
        jsonwebtoken.verify(jwttoken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err){
                return res.status(400).send({msg:InvalidAuthErr})
            }
            req.user = user
            next()

        })
    } catch (err) {
        return res.status(500).send({msg:err.message})
    }
}

module.exports = authUser