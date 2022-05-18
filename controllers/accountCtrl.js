//const Users = require('../models/userModels')
const ShelterUser = require('../Schema/userSchema')
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken');


const accountController = {
    refreshToken: (request, response) =>{
        try {
        const loginErr = "Please Login or Register"
            const refresh_token = request.cookies.refreshtoken;
            if(!refresh_token) {
                return response.status(400).json({msg: loginErr})
            }

            jsonwebtoken.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, (err, user) =>{
                if(err) {
                    return response.status(400).json({msg: loginErr})
                }

                const accesstoken = createAccessToken({id: user.id})

                response.json({accesstoken})
            })

        } catch (err) {
            return response.status(500).json({msg: err.message})
        } 
    },
    login: async (request, response) =>{
        try {
            const {email, password} = request.body;
            
            const user = await ShelterUser.findOne({email})

            if(!user) {
                return response.status(400).send({msg: "This user does not exist. Please try again."})
            }

            //Compare the user's password
            const PasswordCorrect = await bcrypt.compare(password, user.password)
            if(!PasswordCorrect) {
                return response.status(400).send({msg: "Incorrect password. Please try again."})
            }
            // create access token and refresh token if login successed.
            const accesstoken = createAccessToken({id: user._id})
            const refreshtoken = createRefreshToken({id: user._id})

            response.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 5*24*60*60*1000
            })

            response.json({accesstoken})

        } catch (err) {
            return response.status(500).json({msg: err.message})
        }
    },
    register: async (request, response) =>{
        try {
        const usedEmailErr =  "This email already used. Please try again."
        const PWLenErr = "Password length need at least 6 characters. Please try again."
        const AdminCodeErr = "Wrong signup code. Please try again."
            const {name, email, password, role} = request.body;
            // user & password verification 
            const user = await ShelterUser.findOne({email})
            if(user) {
                return response.status(400).send({msg: usedEmailErr})
            }
            if(password.length < 6) {
                return response.status(400).send({msg: PWLenErr})
            }
            if (role!="" && role!="ABC") {
                return response.status(400).send({msg: AdminCodeErr})
            }
            // Password Encryption
            const passwordHash = await bcrypt.hash(password, 10)

            // Save mongodb
            const CreatedUser = new ShelterUser({ name, email, role, password: passwordHash })
            await CreatedUser.save()

            // Create jsonwebtoken to authentication
            const accesstoken = createAccessToken({id: CreatedUser._id})
            const refreshtoken = createRefreshToken({id: CreatedUser._id})

            response.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 5*24*60*60*1000
            })

            response.json({accesstoken})

        } catch (err) {
            return response.status(500).json({msg: err.message})
        }
    },
    //Logout
    logout: async (request, response) =>{
        try {
            response.clearCookie('refreshtoken', {path: '/user/refresh_token'})
            return response.json({msg: "You are Logged out already!"})
        } catch (err) {
            return response.status(500).json({msg: err.message})
        }
    },
    //Find id in db and verifiy
    getUserInfo: async (request, response) =>{
        try {
        const noUserErr = "This user does not exist."
            const user = await ShelterUser.findById(request.user.id).select('-password')
            if(!user){
                return response.status(400).json({msg: noUserErr})   
            }

            response.json(user)
        } catch (err) {
            return response.status(500).json({msg: err.message})
        }
    },
    //Add favourite to user
    addFavourite: async (request, response) =>{
        try {
        const noUserErr = "This user does not exist."
        const AddFavouriteMsg = "Added to favourite"
            const user = await ShelterUser.findById(request.user.id)
            if(!user){
                return response.status(400).json({msg: noUserErr})
            }

            await ShelterUser.findOneAndUpdate({_id: request.user.id}, {
                favourite: request.body.favourite
            })

            return response.json({msg: AddFavouriteMsg})
        } catch (err) {
            return response.status(500).json({msg: err.message})
        }
    }
}

const createAccessToken = (user) =>{
    return jsonwebtoken.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d'
    })
}
const createRefreshToken = (user) =>{
    return jsonwebtoken.sign(user, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '5d'
    })
}

module.exports = accountController