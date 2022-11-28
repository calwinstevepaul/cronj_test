const mongoose = require('mongoose');
const { hashString, checkPassword, createJwt } = require('../helper/helper.users');
const { validateUsers, Users } = require('../models/users');


module.exports.getUser = async(req)=>{
    try {

        if(!req.query._id) throw ({status:false, error:"_id is Missing", errorcode:400});
    
        let userArr = await Users.find({_id:req.query._id})

        return({status:true, data:userArr, errorcode:null})

        
    } catch (error) {
        console.log("error in get user controller",error);

        if(!error.status && error.error){
            return {status:false, error:error.error, errorcode:error.errorcode}
        }
        return{status:false, error:"server error", errorcode:500}
    }

}

module.exports.setUser = async(req)=>{
    try {
        //* Creating user 
        let userObj = {
            _id: mongoose.Types.ObjectId(),
            ...req.body
        };

        //* hashing users
        if(userObj.password) userObj.password = await hashString(userObj.password)        


        //* schema Validation
        let { error } = await validateUsers(userObj);
        if (error) throw ({status:false, error:error.message, errorcode:400});

        const setUser = await Users.create(userObj);
       

        return({status:true, data:setUser, errorcode:null})

        
    } catch (error) {
        console.log("error in add user controller",JSON.stringify(error));

        if(!error.status && error.error){
            return {status:false, error:error.error, errorcode:error.errorcode}
        }

        if( error.name == "MongoError" && error.code == 11000) return {status:false, error:"duplicate key error", errorcode:404}

        return{status:false, error:"server error", errorcode:500}
    }
    
}

module.exports.updateUser = async(req)=>{
    try {
        let {_id} = req.body;
        if(!_id) throw ({status:false, error:"_id is Missing", errorcode:400});

        //* Finding the user 
        const getUser = await Users.findOne({_id}).lean();
        if(!getUser) throw({status:false, error:"no such user", errorcode:400})
        
        //* updating user
        let userObj = {...getUser, ...req.body};
        delete userObj.__v

        //* hashing users
        if(userObj.password) userObj.password = await hashString(userObj.password)
               
        //* schema Validation
        let { error } = await validateUsers(userObj);
        if (error) throw ({status:false, error:error.message, errorcode:400});

        const updateUser = await Users.findOneAndUpdate({_id},{$set:userObj},{new:true});

        return({status:true, data:updateUser, errorcode:null})

    } catch (error) {
        console.log("error in update user controller",error);

        if(!error.status && error.error){
            return {status:false, error:error.error, errorcode:error.errorcode}
        }

        if( error.name == "MongoError" && error.code == 11000) return {status:false, error:"duplicate key error", errorcode:404}

        return{status:false, error:"server error", errorcode:500}
    }

}

module.exports.loginUser = async(req)=>{
    try {
        let {email, password} = req.body;

        //* Finding the user 
        const getUser = await Users.findOne({email}).lean();
        if(!getUser) throw({status:false, error:"Invalid Email Id, Please Sign-up", errorcode:400})
        
    
        //* hashing users
        let isValidPassword = await checkPassword(getUser.password, password)
        if(!isValidPassword) throw({status:false, error:"Incorrect Password", errorcode:400})

        //* Creating JWT 
        let token = createJwt(getUser);
 
        return({status:true, data:{accessToken: token}, errorcode:null})

    } catch (error) {
        console.log("error in update user controller",error);

        if(!error.status && error.error){
            return {status:false, error:error.error, errorcode:error.errorcode}
        }
        return{status:false, error:"server error", errorcode:500}
    }

}
