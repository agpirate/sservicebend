//const express = require('express');
//const express = require('express');
import {
  _queModel
} from "../../dbServerApis/models/serviceModels.js";

import { Router } from "express";
import multer from "multer";

import { mongoose } from "mongoose";
//var Schema = mongoose.Schema,
var ObjectId = mongoose.Types.ObjectId;

import path from "path";
import fs from "fs";

import dotenv from "dotenv"
dotenv.config();

const router = Router();

//====================  CREATING   ========================
//import compute___pll  from "../../services/modalServices/compute___pll";

const modelI = _queModel
const modelIName = "/answers"
var updateShaker = 1 //tree shaking...

//--------------------servicess
let _setResponseHeader = {
"Content-Type": "application/json", //  modelData.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
"Content-Length": "5050",
ETag: "Roaw",
};

let setCookies = {
"Content-Type": "application/json", //  modelData.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
"Content-Length": "5050",
ETag: "Roaw",
"Set-Cookie": ["type=ninja", "language=javascript"],
};

///////-----------Headers modelData
const supportedMimes = {
"application/pdf": "pdf",
"application/zip": "zip",

"text/csv": "csv",
"text/pdf": "pdf",
"text/json": "json",

"image/jpeg": "jpeg",
"image/png": "png",
"image/svg+xml": "svg+xml",
"image/webp": "webp",

"video/mp4": "mp4",
"video/mkv": "mkv",
};


// SET STORAGE//Where to save

async function create_content(reqData,findBy){
  try {
    return await modelI
      .findOne(findBy) //findeOne returns :--- Object or null values (while find returns [],[values,....])
      .then(async(modelQA) => { 
          //----------  Check For The Data __Existance 
          if(modelQA==null){  //is_NEW
            modelQA = new modelI(reqData)            
          }else{//Updating(Special)
            modelQA=Object.assign(modelQA, reqData);
          }

          return  await modelQA.save().then((modelData) => {
            if (modelData && Object.keys(modelData).length) {return { status: 200, data: modelData };
            } else {return { status: 303, data: modelData}; }
          }).catch((modelError) => {return { status: 303, data: modelError}; });
        //-------------------------Saving Model_END
      }).catch((modelQAR)=>{return { status:303, data:modelQAR}
      }) //------------
} catch { return { status: 303, data: 'Fatal DATABASE ERROR'};}
}

async function update_content(reqData,findBy){
  try {
    //-----------------
    return await modelI
      .findOne(findBy) ///if findby is null it returns index_0 item
      .then(async(modelQA) => {
        //----------  Check For The Data __Existance
        if(modelQA==null){  //is't New or Exited            
          return { status: 303, data:"Record Doesn't Found." }
        }else{//----------------Column Computing_I
         modelQA=Object.assign(modelQA, reqData);
        }

        return  await modelQA.save().then((modelData) => {
          if (modelData && Object.keys(modelData).length) {return { status: 200, data: modelData };
          } else {return { status: 303, data: modelData}; }
        }).catch((modelError) => {return { status: 303, data: modelError}; });
      //-------------------------Saving Model_END
      }).catch((modelQAR)=>{return { status:303, data:modelQAR}
      }) //------------
} catch { return { status: 303, data: 'Fatal DATABASE ERROR'};}
}

let is_newCols='qid' //uniques_id
router.post(modelIName, async (req, res) => {
      //-----------------Sender Meta (Header ++ Token)--Authentications and Authorizations Params
      //-----------------Sender Meta (Header ++ Token)--Authentications and Authorizations Params
      let [_issrole,userId] = [req._issrole ?? false, req.userId ?? false]
      if(!userId){ 
        //return res.status(404).send({ message: "NullData(P +token) Received." });    
      }
      try{ 
      //-----------Extracting Request_Body & Validate
      let reqData= req.body ?? {} 
      if(reqData['id'] ?? false){ 
        findBy['id']=new ObjectId(reqData['id'])
      }else{  //Existing_columns(for Null O/P)
        findBy[is_newCols]= false//reqData[is_newCols] ?? false 
       
        //return res.status(303).send({ message: "NullData(P) Received." });
      }
      //----------  
      return await create_content(reqData,findBy).then((modelData) => {
        if (modelData.status == 200) {res.set(_setResponseHeader);
          return res.status(modelData.status).json(modelData.data);
        } else {return res.status(modelData.status).send(modelData.data);}
      }).catch((imodelData) =>{return res.status(404).send( imodelData)}); 
           //------------------------------------------------
    }catch(error){ return res.status(404).send( error)}         
  });  


// return res.status(404).json("(Srv):- _del202;but, "+modelData["data"]);//return res.status(505).json("(Srv);- _del505");
router.put(modelIName, async (req, res) => {
      //-----------------Sender Meta (Header ++ Token)--Authentications and Authorizations Params
      let [_issrole,userId] = [req._issrole ?? false, req.userId ?? false]
      if(!userId){ 
        //return res.status(404).send({ message: "NullData(P +token) Received." });    
      }
      //--------------------
      let findBy ={}
      //------------------------
      //-----------Extracting Request_Body & Validate
      let reqData= req.body ?? {}
      if (reqData['id'] ?? false) {findBy['_id']=new ObjectId(reqData['id'])
      }else{ 
        return res.status(303).send("req.body is null")
      }
      //------------------is there to compute
      return await update_content(reqData,findBy).then((modelData) => {
        if (modelData.status == 200) {res.set(_setResponseHeader);
          return res.status(modelData.status).json(modelData.data);
        } else {return res.status(modelData.status).send(modelData.data);}
      }).catch((imodelData) =>{return res.status(404).send( imodelData)}); 
    }
);

  // Get all products
  router.get(modelIName+"s", async (req, res) => {
    //-----------Authentications and Authorizations Params
    let [_issrole,userId,_qW] = [req._issrole ?? false, req.userId ?? false,req.queryWeight ?? false]
    if(!userId){ 
      //return res.status(404).send({ message: "NullData(P) Received." });  
      }

    //--------------------
    let reqParams = req.query ?? req.params
    if (!(reqParams ?? false) || (Object.keys(reqParams).length == 0)) {
      //return res.status(404).send({ message: "NullData(P) Received." });
    }
     //------------------------
     let [findBy, returnWat, limits] = await _getdeleteParams(reqParams);

    try {
      let modelData = await rOps(modelI, findBy, returnWat, limits);
      if (modelData.status == 200) {res.set(_setResponseHeader);
        return res.status(200).json(modelData["data"]);
      } else {return res.status(modelData.status).send(modelData.data); }
    } catch (error) {return res.status(404).send(error)}
  });
  
  // Get a single product by ID                           
  router.get(modelIName, async (req, res) => {
    //-----------Authentications and Authorizations Params
    let [_issrole,userId,_qW] = [req._issrole ?? false, req.userId ?? false,req.queryWeight ?? false]
    if(!userId){ 
      //return res.status(404).send({ message: "NullData(P) Received." });    
    }
    //--------------------
    let reqParams = req.query ?? req.params
    if (!(reqParams ?? false) || (Object.keys(reqParams).length == 0)) {
      //return res.status(404).send({ message: "NullData(P) Received." });
    }
    //------------------------
    let [findBy, returnWat, limits] = await _getdeleteParams(reqParams);
    try {
      let modelData = await rOp(modelI, findBy, returnWat, limits);
      if (modelData.status == 200) {res.set(_setResponseHeader);
        return res.status(200).json(modelData["data"]);
      } else {return res.status(modelData.status).send(modelData["data"]);}
    } catch (error) {return res.status(505).send("Database Error."); }
  });
  //---------------------------------------
  //let delKey = "_id";
  router.delete(modelIName, async (req, res) => {
    //-----------Authentications and Authorizations Params
    let [_issrole,userId,_qW] = [req._issrole ?? false, req.userId ?? false,req.queryWeight ?? false]
    if(!userId){ 
      //return res.status(404).send({ message: "NullData(P) Received." });    
    }
    //--------------------
    let reqParams = req.query ?? req.params
    if (!(reqParams ?? false) || (Object.keys(reqParams).length == 0)) {
      return res.status(404).send("Record doesn't found.");
    }

    try {
      let modelData = await dOps(modelI, reqParams["id"]); //send Id_value only
      if (modelData.status == 200) {res.set(_setResponseHeader);
        return res.status(200).json(modelData["data"]);
      } else {return res.status(modelData.status).send(modelData['data']);}
    } catch (error) {return res.status(505).send(error);}
  });
/////////////////----------------------------------------Client Interfacing API
//----------------------------------Query Builder
// API
export default router


let _primaryObject = ["id", "Id", "ID"]
let _secondaryObject = ["creator_id","cid",]
//--------------

async function _getdeleteParams(reqParams = {}) {
  //------No Parameters
  if (!reqParams) {return [false,false,false];}
  //---------Intialize the Queries,limits,returnin values..
  var queryParam ={} //searcher parameters
  let returnWat = {}; //filtering parameters
  let limits = 0; //limitter parameters
  //------------Filter NonSearching(Queries) Purposed Params...()
  var _blackArray=['returnWat','limits','upload','timestamp']
  //--------------
  try {
    for (let paramName of Object.keys(reqParams)){
      if(_blackArray.includes(paramName)){          
      }else{          
        queryParam[paramName]=reqParams[paramName]
      }
    }
  } catch {}
  //-------------------
  let findBy = Object.keys(queryParam).length  ? await _queryBuilder(queryParam)   : [{}];
  //------------------
  return [findBy, returnWat, limits];
}

let _thridObject=[] //Casting to NumberValues
async function _queryBuilder(params = {}) { //JSON.parse(params);
  let searchQueries = [{}]; //Initialize the Query Object
  if(params && Object.keys(params).length){ //does Paramer Existed as Object(K:V)
    
    searchQueries=[]
    for (let paramKey in params) { //Iterate Over The Parameters Object(K:V)
      //----Get and Serialize the Parameter Value
      let keySerialize = paramKey; //Reassign query Namings
      //--------------
      var paramValue = params[keySerialize] ?? ''
      //--------------
      let query = {};

          if (_primaryObject.includes(keySerialize)) {//break; 
              try{query['_id']=new ObjectId(paramValue)}catch{}                
            }
          else{ //----if Query Involves drived(ObjectID)..Referencekey base...ReArrange the ObjectID Naming
            if (_secondaryObject.includes(keySerialize)) {
                  paramValue = _thridObject.includes(keySerialize) ? parseFloat(paramValue) : paramValue //if valued of Param is Phone Try it.. to Floating
                  try{query[keySerialize]=new ObjectId(paramValue);}catch{}  
            }else{ ///---if Query is Normal Columns Value....for String_base search && Object(obj.key..) or Number_base sarch use Below Techni..
              if(typeof paramValue == 'string')
                  {query[keySerialize] = {$regex : paramValue.toString(), "$options": "i" } 
              }else{ query[keySerialize] = paramValue;}
            }
          }
      //-------Append Constructed Queries into Query_Object
      searchQueries.push(query);
    }
    //------Recheck Queries Object(for null or error) && Filter Query Objects
    if (searchQueries.length) { 
      searchQueries = searchQueries.filter((querycheck) => (Object.keys(querycheck).length));
    } else {searchQueries = [{}];
    }
  }
  // console.log(searchQueries,'aswere')
  return searchQueries;
}

//----------------------------------Query Builder
const rOps = async function (dbModel,findBy=[],returnWat={},limits=100) {
  try {
    return await dbModel
      .find({ $and: findBy }, returnWat)
      .sort({updatedAt:-1 })
      .limit(limits) 
      .then((modelData) => {  
        if (modelData && modelData.length) { return { status: 200, data: modelData }; //returns null or object_
        } else { return { status: 200, data:[] }; //not found Error
        } }).catch((modelError) => {
        return { status: 404, data: modelError }; //DBs_Schema or Rules_validations Error
      }); 
  } catch(error) { return { status: 404, data: error};  } //DBs Connections or Configurations, modules Error
};
//---------------------------Reading Filtered Data
const rOp = async function (dbModel,findBy=[],returnWat={},limits=100) {
  try {
    return await dbModel
      .find({ $and: findBy }, returnWat)
      .sort({updatedAt:-1 })
      .limit(limits) 
      .then((modelData) => {
        if (modelData && modelData.length) { return { status: 200, data: modelData }; //returns null or object_
        } else { return { status: 200, data:[] }; //not found Error
        } }).catch((modelError) => {
        return { status: 404, data: modelError }; //DBs_Schema or Rules_validations Error
      }); 
  } catch(error) { return { status: 404, data: error};  } //DBs Connections or Configurations, modules Error
};

const dOps = async function (dbModel, itemId) {
  try {
    return await dbModel
      .findByIdAndDelete(itemId) //or simply >>--  findBy['id']
      .then((modelData) => {
        if (modelData && Object.keys(modelData).length) { return { status: 200, data: modelData }; //returns null or object_
        } else { return { status: 200, data:null }; //not found Error
        } }).catch((modelError) => {
        return { status: 404, data: modelError }; //DBs_Schema or Rules_validations Error
      }); 
  } catch(error) { return { status: 404, data: error};  } //DBs Connections or Configurations, modules Error
};