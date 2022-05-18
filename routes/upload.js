const router = require('express').Router()
const cloudinary = require('cloudinary')
const auth = require('../middleware_auth/authUser')
const authAdmin = require('../middleware_auth/authAdmin')
const fs = require('fs')
// we will upload image on cloudinary

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

//Upload image

router.post('/upload', auth, authAdmin, (req, res) =>{
const noUploadErr = 'No files were uploaded.'
const sizeErr = 'Size too large'
const formatErr = 'File format is incorrect.'
//router.post('/upload', (req, res) =>{
    try {
        if(!req.files || Object.keys(req.files).length === 0){
            return res.status(400).json({msg:noUploadErr})
        }
        
        const file = req.files.file;
        if(file.size > 1024*1024) {
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg:sizeErr})
        }

        if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png'){
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg:formatErr})
        }

        cloudinary.v2.uploader.upload(file.tempFilePath, {folder: "Dogs"}, async(err, result)=>{
            if(err) {
                throw err;
            }
            removeTmp(file.tempFilePath)
            res.json({public_id: result.public_id, url: result.secure_url})
        })

    
    } catch (err){
        res.status(500).json({ msg: err.message})
    }
})


// Delete image only admin can use
router.post('/delete',auth , authAdmin, (req, res) =>{
const noImgErr = 'No images Selected'
//outer.post('/delete', (req, res) =>{
    try {
        const {public_id} = req.body;
        if(!public_id) {
            return res.status(400).json({msg: noImgErr})
        }

        cloudinary.v2.uploader.destroy(public_id, async(err, result) =>{
            if(err) {
                throw err;
            }

            res.json({msg: "Deleted Image"})
        })

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
    
})

const removeTmp = (path) =>{
    fs.unlink(path, err=>{
        if(err){
            throw err;
        } 
    })
}
module.exports = router