const express = require('express');
const {getUser, setUser, updateUser, loginUser} = require("../controller/controller.user");
const { auth } = require('../middleware/middleware');
var router = express.Router();


router.get('/',[auth], async(req,res)=>{
    try {
        let getUserRes = await getUser(req) 
        if(!getUserRes.status) throw getUserRes      
        
        res.status(200).send(getUserRes.data)
        
    } catch (error) {
        console.log("error in get user router",error)
        
        if(!error.status && error.error){
            return res.status(error.errorcode).send(error.error)
        }
        return res.status(500).send("server error")
    }
})

router.post('/add',async(req,res)=>{
    try {
        let setUserRes = await setUser(req) 
        if(!setUserRes.status) throw setUserRes      
        
        res.status(200).send(setUserRes.data)
        
    } catch (error) {
        console.log("error in add user router",error)
        
        if(!error.status && error.error){
            return res.status(error.errorcode).send(error.error)
        }
        return res.status(500).send("server error")
    }
})

router.put('/update', [auth], async(req,res)=>{
    try {
        let updateUserRes = await updateUser(req) 
        if(!updateUserRes.status) throw updateUserRes      
        
        res.status(200).send(updateUserRes.data)
        
    } catch (error) {
        console.log("error in update user router",error)
        
        if(!error.status && error.error){
            return res.status(error.errorcode).send(error.error)
        }
        return res.status(500).send("server error")
    }
})

router.post('/loginUser', async(req,res)=>{
    try {
        let loginUserRes = await loginUser(req) 
        if(!loginUserRes.status) throw loginUserRes  
                
        res.status(200).send(loginUserRes.data)
        
    } catch (error) {
        console.log("error in add user router",error)
        
        if(!error.status && error.error){
            return res.status(error.errorcode).send(error.error)
        }
        return res.status(500).send("server error")
    }
})

module.exports = router