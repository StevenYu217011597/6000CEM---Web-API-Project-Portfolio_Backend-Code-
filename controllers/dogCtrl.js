const Dogs = require("../Schema/dogSchema")

class APIfeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }
    filtering(){
        const queryItem = {...this.queryString}
        
        const filterOuts = ['page', 'sort', 'limit']
        filterOuts.forEach(Item=> delete(queryItem[Item]))

        let queryStr = JSON.stringify(queryItem);
        const EditedQueryStr = queryStr.replace(/\b(regex)\b/g, match => '$' + match)
        
        this.query.find(JSON.parse(EditedQueryStr))

        return this;
    }

    sorting(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        }else{
            this.query = this.query.sort('-createdAt')
        }
        return this;
    }
}

const dogCtrl = {
    getDogs: async(request,response)=> {
        try {
            const features = new APIfeatures(Dogs.find(), request.query).filtering().sorting()
            const dogs = await features.query
            response.json({
                status: 'success', 
                result: dogs.length,
                dogs: dogs
            })
        } catch (err) {
            return response.json({msg:err.message})
        }
    },
    createDog: async(req,res)=> {
        try {
            const createDogErr = "Create a dog"
            const noImgErr = "No image upload"
            const existErr = "This dog already exist"
       
            const {dog_id, dog_name, dog_desc, dog_dob, dog_status, dog_img} = req.body;
            if(!dog_img) {
                return res.json({msg: noImgErr})
            }
            const dog = await Dogs.findOne({dog_id})
            if(dog)
                return res.json({msg: existErr})

            const newDog = new Dogs({
                dog_id, dog_name, dog_desc, dog_dob, dog_status, dog_img
            })

            await newDog.save()
            res.json({msg: createDogErr})

        } catch (err) {
            return res.json({msg: err.message})
        }
    },
    deleteDogs: async(req,res)=> {
        try {
            const deleteDogErr = "Deleted a Dog"
            await Dogs.findByIdAndDelete(req.params.id)
            res.json({msg:deleteDogErr})
        } catch (err) {
            return res.json({msg: err.message})
        }
    },
    updateDogs: async(req,res)=> {
        try {
            const noImgErr = "No image upload"
            const UpdateDog = "Updated a dog"
            const {dog_id, dog_name, dog_desc, dog_dob, dog_status, dog_img} = req.body;
            if(!dog_img) {
                return res.json({msg: noImgErr})
            }
            await Dogs.findOneAndUpdate({_id: req.params.id},{dog_name, dog_desc, dog_dob, dog_status, dog_img
            })
            res.json({msg: UpdateDog})
        } catch (err) {
            return res.json({msg: err.message})
        }
    },
}

module.exports = dogCtrl