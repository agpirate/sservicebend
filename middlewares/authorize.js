//const jwt = require('jsonwebtoken');
import jwt from "jsonwebtoken"
import {
  profileModel,acctypeModel
} from "../dbServerApis/models/profileModels.js";

import { mongoose } from "mongoose";
//var Schema = mongoose.Schema,
var ObjectId = mongoose.Types.ObjectId;

import dotenv from "dotenv"
dotenv.config();


// Authorization middleware
async function authorize(req, res, next) {
  //-----------Extract the Token and Header Values
  var _thisCookies= (req.cookies ?? req.headers.cookie) ?? false 
  //req.headers.cookie (if cookies in Header-- they comes as string_not Objec) !! (require split & indexing first)
  var _header = req.headers ?? false
   //------------------Extract _token Values(inside Headers)
  let _cookie = _thisCookies?.['access_token'] ?? false
  //------seterialize the Header_Contern
  if(typeof _header == 'string'){
      let _iisTemp = _header//.split('|')[1]
      try{
        _header= JSON.parse(_iisTemp)
      }catch{}
   }

   let _bearToken = _header['authorization'] ?? false
   if(_bearToken) {
      const bearer = _bearToken.split('"');//split(";")
      _cookie = bearer[1]?.trim()?? _cookie;
   }else{}

  //----------Check if Token Existing
  if(!(_cookie && _header)){return res.status(403).send('Access forbidden');}    
  //----------------------------------------------------------Cookkies Passed
  //-------optional userData
   let _userID = _header['id'] ?? null
   var _issID= _header?.acckey ?? null  //_iss
   var _issrole= null  //_iss
   var _userDep=  null  //_iss
   var _issmodal= _header?._issmodal ?? null  //_issModal 
   var _userQuery= _header?.acckey ?? null  //_iss

   //----------process.env.TOKEN_SECRET
   try{
     const decoded = jwt.verify(_cookie, process.env.TOKEN_SECRET);
      //---------Embeding Generated_Data && Forwarding
      if(!_userID || decoded){
        _userID = decoded.userId ?? _userID;
        _issID=decoded['acckey'] ?? _issID
      }else{}
    console.log(decoded,'bearToken-------------->')
   }catch{          }

  //--------------Check User for REgisteration using user_id ? or return error
  if(_userID){
    await profileModel.findOne({'_id':new ObjectId(_userID)}).then((_user) =>{
          if(_user){
            _issID=_user['acckey'] ?? false
          }else{return res.status(403).send('AccJet');}
      }).catch((error)=>{return res.status(403).send(error);})
  }else{return res.status(403).send('User ID :-'+_userID);}
  //-----------------

  req.userId=_userID
  req.issId=_issID
  req.issrole=_issrole

  req.queryWeight=_userQuery
  //--------------------------------------------------------------------Authentication Ends//
  if(_issID && _issmodal){
   return await acctypeModel.findOne({'_id':new ObjectId(_issID)}).then((_role_permission)=>{
      if(_role_permission){ //if Permissions Founded
        _issrole =_role_permission[_issmodal]
      }else{ _issrole= null }  //ifNot
      //next();
      return true
    }).catch(()=>{ return true;//res.status(403).send('Access forbidden');    
  })
  }else{_issrole=null }
  //-----------------IF...Not _iss_ID
  req._issrole =_issrole

  //---------------------------------------Passed Request
  next();
  return true
}

export default authorize
