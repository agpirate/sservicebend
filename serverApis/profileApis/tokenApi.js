
import { profileModel } from "../../dbServerApis/models/profileModels.js";
//const profileModel = require("../../dbServerApis/models/profileModels")
import { acctypeModel } from "../../dbServerApis/models/profileModels.js";

import jwt  from "jsonwebtoken";
import { Router } from "express";
import { model, mongoose } from "mongoose";
//var Schema = mongoose.Schema,
var ObjectId = mongoose.Types.ObjectId;

import dotenv from "dotenv"
dotenv.config();

const router = Router()

// Protected route
let _checkQuery='username'
let _checkQuery2='password'
router.post("/login", async (req, res) => {
      //---------------------Grap User Data of Request_Header + Body
      let reqData =req?.body ?? false 
      if(!reqData && Object.keys(reqData).length == 0){
        return res.status(303).send({ message: "request body is null." });
      }
      //-------------------Building the Searching Query
      let findBy={}
      findBy[_checkQuery] = reqData[_checkQuery] ?? false
      findBy[_checkQuery2] = reqData[_checkQuery2] ?? false
      //-------------Finde User On Database
      //console.log(reqData,'Login Cred....')
      try {
        return await profileModel.findOne(findBy).then(async (modelData) => {
         
            // //console.log('User is Authenticated && Has Permissions of ===>',modelData)
            if (modelData && Object.keys(modelData).length) {
               //--------------Search For Role and Permissions----Start
                  const token =  jwt.sign({ userId: modelData['id'],role:modelData.role }, 'tigtvsms', { expiresIn: '2h' }); 
                  //---set Token as Response
                  res.setHeader('Authorization', `Bearer ${token}`)//To send the token in the Authorization header, the client needs to include it in subsequent requests:
                  res.cookie('access_token', token, { maxAge: 11900000 }); //this Would Inject token into [cookie_storage && cookie_Header]
                  res.setHeader('role','_rolePermisions.profile.group') //Injecting new_attribute into mongodb(findOne or Obj)_ data is not good..best...In Header
                  res.setHeader('token',JSON.stringify(token)) //Injecting new_attribute into mongodb(findOne or Obj)_ data is not good..best...In Header

                 let _newObj=Object.assign({},modelData)
                 let _newObjj = _newObj._doc
                 _newObjj['token'] =token
                 _newObjj['id']=modelData.id
                 _newObjj['username']=modelData.username
                 _newObjj['role']=modelData.role
                delete _newObjj['password']
                // //console.log(_newObjj,'newObj')
                return res.status(200).json(_newObjj)
  
            } else { return res.status(modelData.status).json("(Srv):- _read202;but, (DBs) _read303 "+ modelData ); }
          }).catch((modelError) => {return res.status(404).json("(Srv):- _read202;but, (DBs) _read404 "+modelError ); }); // return modelError
      } catch (error) {  return  res.status(505).json("(Srv);- _readf505_ "+error);  }
    });
  //----------------------------------Query Builder

  // API
 export default router

  