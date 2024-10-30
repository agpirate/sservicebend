

import {
  profileModel,acctypeModel
} from "../dbServerApis/models/profileModels.js";
import jwt  from "jsonwebtoken";

import { mongoose } from "mongoose";
//var Schema = mongoose.Schema,
var ObjectId = mongoose.Types.ObjectId;

import dotenv from "dotenv"
dotenv.config();

let _prevAccess=['admin','ict']

// Authentication middleware
async function authenticate(req, res, next) { // ... authentication logic ...

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
      const bearer = _bearToken.split(' ');//split(";")
      if(bearer.length == 2){
        _cookie = bearer[1]?.trim() ?? _cookie;
      }else{
      _cookie = bearer[0]?.trim() ?? _cookie;
      }
   }else{}

  //----------Check if Token Existing
  if(!(_cookie && _header)){
    return res.status(403).send('Access forbidden');
  }
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
     const decoded = jwt.verify(_cookie,'tigtvsms');
      //---------Embeding Generated_Data && Forwarding
      if(!_userID || decoded){
        _userID = decoded.userId ?? _userID;
        _issrole = decoded.role ?? _issrole;
        _issID=decoded['acckey'] ?? _issID
      }else{}
    // console.log(decoded,'bearToken-------------->')
   }catch{          }

  //--------------Check User for REgisteration using user_id ? or return error
  if(_userID){
    await profileModel.findOne({'_id':new ObjectId(_userID)}).then((_user) =>{
          if(_user){
            // _issID=_user['acckey'] ?? false
            // _issID=_user['acckey'] ?? false
            // _userQuery=_user['queryWeight'] ?? false
            _userDep =_user['department'] ?? false
          }else{return res.status(403).send('Access forbidden2');}
      }).catch(()=>{return res.status(403).send('Access forbidden1');})
  }else{return res.status(403).send('Access forbidden0'+_cookie);}
  //-----------------

  req.userId=_userID
  // req.issId=_issID
  req._userDep=_userDep
  req._issrole=_issrole
  // req.role=role

  req.queryWeight=_userQuery

  //----------Adding query parameters for GET M
  if(_prevAccess.includes(_issrole)){ }
  else{
    if(Object.keys(req.query)?.length ?? false){
      req.query['department'] =_userDep 
    }else{
    req['query'] ={} 
    if(_issrole == 'member'){ req['query'] ={'department':_userDep}  }
    }
  }
  // console.log(_cookie,_userID,req['query'],Object.keys(req.query),'bearToken-------------->')

  //---------------
  next()
  return true
}
export default authenticate;
