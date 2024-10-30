//const express = require('express');
import {
  pollVotesModel
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

const modelI = pollVotesModel
const modelIName = "/votes"
var updateShaker = 1 //tree shaking...

let _primaryObject = ["id", "Id", "ID"]
let _secondaryObject = ["saleitID","userID"]

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

const getFileOptions = () => {
//////////////////////////////console.log('request with UploadFile_Detected - FileUptions -Multer Happening')
var _fileName =  ""
var _originalName=  ""
var _fieldName = ""
////////////////////////////console.log('calling get file options')
return {
  storage: multer.diskStorage({

    filename: (req, file, cb) => {
      
      let extension = supportedMimes[file.mimetype];
      _originalName = file.originalname.split(".")[0];
      //`${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`
      _fileName =_originalName.split(" ")[0] + "-" + new Date().getTime() + "." + extension;
      _fieldName =file.fieldname

      cb(null, _fileName);
    },
    //path: "/"+ _fieldName + _fileName,
    destination: (req, file, cb) => {cb(null, "./public/"+ file.fieldname)},
    path:        (req, file, cb) => {cb(null, "/"+file.fieldname +"/"+_fileName)},
    //destination: "./public/"+_fieldName, //directory (folder) setting
    //--------additional meta(drived)
    //timestamp:new Date()

  }),

  limits: { fileSize: 1000000 * 5 },
  fileFilter: (req, file, cb) => {
    let extension = supportedMimes[file.mimetype];
    if (!extension) {
      return cb(null, false);
    } else {
      cb(null, true);
    }
  },
};
};

async function _filesMeta(files){
var filesMetaF =[]
let filesMeta ={}
for(let _fileObjKy in files){

  filesMeta[_fileObjKy]=[]
  filesMeta[_fileObjKy+"Meta"]=[]

  var fileList = files[_fileObjKy]

//  //////////////////////////console.log(fileList,'extractedfile')

  for(let _listInx in fileList)
  {

  try{
    var file = fileList[_listInx]
    //var fieldname = file.fieldname

    var newFileName = `${Date.now()}-${Math.round(Math.random() * 1e2)}${path.extname(file.originalname)}`; //save file_name as buffere
    var dbName = fs.readFileSync(file.path); //save file_name as buffere
    var encode_dbName = dbName.toString("base64");
    var _thefilePath = "/"+file.fieldname+"/"+file.filename

    var fileMeta = {
      //contentType: files.mimetype,
      contentType: file.mimetype,
      mimetype:file.mimetype,
      encoding:file.encoding,
      originalname:file.originalname,
      destination:file.destination,
      fieldname:file.fieldname,
      filename:file.filename,
      path:file.path,
      size:file.size,
      //----------
      thefilePath:_thefilePath,
      //dbName: encode_dbName,
      geoLocation:"0000000000xyz"
    };
    ////////////////////////////console.log('request with UploadFile_Detected [Files]',fileMeta)
  
    filesMeta[_fileObjKy][_listInx]=fileMeta.thefilePath
    filesMeta[_fileObjKy+"Meta"][_listInx]=fileMeta

  }catch{ 
    return false
     }

}
  //filesMetaF.append(filesMeta)
}
return filesMeta
}
// SET STORAGE//Where to save

async function create_content(reqData,findBy,_computIt=false){
  try {
    return await modelI
      .findOne({ $and: findBy }, {}) //findeOne returns :--- Object or null values (while find returns [],[values,....])
      .then(async(modelQA) => {
          //----------  Check For The Data __Existance 
          if(modelQA==null){  //is't New or Exited
            modelQA = new modelI(reqData)          
          }else{
            //return { status: 404, data:"Not REgistered" }
             modelQA=Object.assign(modelQA, reqData);
          }

          //-----------Content Weighting---Preparing Data
          //-------------------------Saving Model_START
          return  await modelQA.save().then((modelData) => {
            if (modelData && Object.keys(modelData).length) {return { status: 200, data: modelData };
            } else {return { status: 404, data:"(DBs)_up303:- " + modelData}; }
          }).catch((modelError) => {return { status: 404, data: "(DBs)_up404:- " + modelError}; });
        //-------------------------Saving Model_END
      }).catch((modelQAR)=>{return { status:505, data:"(DBs)_up505:- " + modelQAR}
      }) //------------
} catch { return { status: 505, data: '(Compute/DBs)_ambigiouse _upError'};}
}

async function update_content(reqData,findBy,_computIt=true){
  try {
    //-----------------
    return await modelI
      .findOne(findBy) ///if findby is null it returns index_0 item
      .then(async(modelQA) => {
        //----------  Check For The Data __Existance
        if(modelQA==null){  //is't New or Exited            
          return { status: 404, data:"Not REgistered" }
        }else{
          modelQA=Object.assign(modelQA, reqData);
        }
        
        //-----------Content Weighting---Preparing Data
        //-------------------------Saving Model_START
        return  await modelQA.save().then((modelData) => {
            if (modelData && Object.keys(modelData).length) {return { status: 200, data: modelData };
            } else {return { status: 404, data:"(DBs)_up303:- " + modelData};}
          }).catch((modelError) => {
            return { status: 404, data: "File doesn't found" + modelError};});
            //-------------------------Saving Model_END
      }).catch((modelQAR)=>{ return { status:505, data:"Database Error" + modelQAR}
      }) //------------
} catch { return { status: 505, data: 'Server Error'};}
}

router.post(modelIName, async (req, res) => {
      //-----------------Sender Meta (Header ++ Token)--Authentications and Authorizations Params
      let [_issrole,userId] = [req._issrole ?? false, req.userId ?? false]
      if(!userId){ 
        return res.status(404).send({ message: "NullData(P +token) Received." });    
      }
    //-------------------
    let findBy={}
    //-----------Extracting Request_Body & Validate
    let reqData= req?.body ?? false
    if (!reqData || (Object.keys(reqData).length == 0)) {
      return res.status(404).send({ message: "NullData Body Received." });
    }//---------
    if (!(reqData?.['c_code'] ?? false)) {
      return res.status(303).send({ message: "body.data is null" });
    }else{ 
      //findBy['_id']=new ObjectId(reqData[_postkey])
      findBy['c_code']=false
    }
    return await create_content(reqData,findBy,_iscompute).then((modelData) => {
        if (modelData.status == 200) {res.set(_setResponseHeader);
          return res.status(200).json(modelData['data']);
        } else {return res.status(404).json(modelData['data']);}
      }).catch((imodelData) =>{return res.status(404).json("Srv) ;- File Uploading and Data ambigiouse"+ imodelData)
      });
   }
);

let _putkey ='id'
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
      //-----------------Sender Meta (Header ++ Token)--Authentications and Authorizations Params
      let [_issrole,userId] = [req._issrole ?? false, req.userId ?? false]
      if(!userId){ 
        //return res.status(404).send({ message: "NullData(P +token) Received." });    
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
      return res.send(modelData["data"]);
    } else {return res.status(404).json("(Srv):- _read303;but, "+ modelData["data"]); }
  } catch (error) {return res.status(505).json("(Srv);- _read505");}
});

// Get a single product by ID                           
router.get(modelIName, async (req, res) => {
      //-----------------Sender Meta (Header ++ Token)--Authentications and Authorizations Params
      let [_issrole,userId] = [req._issrole ?? false, req.userId ?? false]
      if(!userId){ 
        //return res.status(404).send({ message: "NullData(P +token) Received." });    
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
      return res.send(modelData["data"]);
    } else {return res.status(404).json("(Srv):- _readf202;but, "+ modelData["data"]); }
  } catch (error) {return res.status(505).json("(Srv);- _readf505"); }
});
//---------------------------------------
//let delKey = "_id";
router.delete(modelIName, async (req, res) => {
  //-----------Authentications and Authorizations Params
      //-----------------Sender Meta (Header ++ Token)--Authentications and Authorizations Params
      let [_issrole,userId] = [req._issrole ?? false, req.userId ?? false]
      if(!userId){ 
        //return res.status(404).send({ message: "NullData(P +token) Received." });    
      }
  //--------------------
  let reqParams = req.query ?? req.params
  if (!(reqParams ?? false) || (Object.keys(reqParams).length == 0)) {
    //return res.status(404).send({ message: "NullData(P) Received." });
  }
   //------------------------
  // let [findBy, returnWat, limits] = await _getdeleteParams(reqParams);

  try {
    let modelData = await dOps(modelI, reqParams["id"]); //send Id_value only
    if (modelData.status == 200) {res.set(_setResponseHeader);
      return res.send(modelData["data"]);
    } else {return res.status(404).json("(Srv):- _del202;but, "+modelData["data"]);}
  } catch (error) {return res.status(505).json("(Srv);- _del505");}
});
/////////////////----------------------------------------Client Interfacing API
//----------------------------------Query Builder
// API
export default router


async function _postputParams(reqParams ={},_roles=null) {
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
  let findBy = Object.keys(queryParam).length  ? await _queryBuilder(queryParam,0)   : [{}];
  //------------------roles based filtering
  if(_roles){findBy.push({'department':_roles['department'] ?? null,'creator_id':new ObjectId(_roles['id']) ?? null})}
  return [findBy, returnWat, limits];
}

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
  let findBy = Object.keys(queryParam).length  ? await _queryBuilder(queryParam,1)   : [{}];
  //------------------
  return [findBy, returnWat, limits];
}

async function _queryBuilder(params = {},isget=0) { //JSON.parse(params);
  let searchQueries = [{}]; //Initialize the Query Object

  if(params && Object.keys(params).length){ //does Paramer Existed as Object(K:V)
    
    searchQueries=[]
    for (let paramKey in params) { //Iterate Over The Parameters Object(K:V)
      //----Get and Serialize the Parameter Value
      let keySerialize = paramKey; //Reassign query Namings
      //--------------
      var paramValue = params[keySerialize] ?? ''
      paramValue = ['phone'].includes(keySerialize) ? parseFloat(paramValue) : paramValue //if valued of Param is Phone Try it.. to Floating
      //------------------
      let query = {};
      if(keySerialize == 'queryWeight'){ //queryWeight Based Parameter Treated Differentlly
          let parsedValue=paramValue.split('.')
          searchQueries=[{Qwc:{$gt:parseInt(parsedValue[1])}},{Qwu:{$gt:parseInt(parsedValue[2])}},{Qwt:{$lt:1000000}}];
          break;
      }else{//----------if Query Involves id(ObjectID)...ReArrange the ObjectID Naming
        if (_primaryObject.includes(keySerialize)) {//break; 
          try{query['_id']=new ObjectId(paramValue)}catch{}                
        }
      else{ //----if Query Involves drived(ObjectID)..
        if (_secondaryObject.includes(keySerialize)) {
              try{query[keySerialize]=new ObjectId(paramValue);}catch{}  
        }else{ ///---if Query is Normal Columns Value....
          if(isget && (typeof paramValue == 'string'))
              {query[keySerialize] = {$regex : paramValue.toString(), "$options": "i" } 
          }else{ query[keySerialize] = paramValue;}
        }
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
  return searchQueries;
}

//----------------------------------Query Builder
//---------------------------Reading All_Un/Filtered Data
const rOps = async function (dbModel,findBy,returnWat,limits) {
  try {
    return await dbModel
      .find({ $and: findBy }, returnWat)
      .sort({updatedAt:-1 })
      .limit(limits) 
      .then((modelData) => {  
        if (modelData && modelData.length) {return { status: 200, data: JSON.stringify(modelData) };
        } else { return { status: 404, data: "(DBs)_read303:- " +modelData }; //not found Error
      } }).catch((modelError) => {
      return { status: 404, data: "(DBs)_read404:- " + modelError }; 
    }); 
} catch (error) { return { status: 505, data: "(DBs)_read505 :-" };  } 
};
//---------------------------Reading Filtered Data
const rOp = async function (dbModel,findBy,returnWat,limits) {
  try {
    return await dbModel
      .find({ $and: findBy }, returnWat)
      .sort({updatedAt:-1 })
      .limit(limits) 
      .then((modelData) => {  
        //console.log('llllllllllll===============>11',modelData.length,findBy)
        if (modelData && modelData.length) {return { status: 200, data: JSON.stringify(modelData) };
      }else { return { status: 200, data:modelData }; //not found Error
      } }).catch((modelError) => {
      return { status: 404, data: "(DBs)_read404:- " + modelError }; //DBs_Schema or RulesparamValueidations Error
    }); 
} catch (error) { return { status: 505, data: "(DBs)_read505 :-" };  } //DBs Connections or Configurations, modules Error
};

const dOps = async function (dbModel, itemId) {
  try {
    return await dbModel
      .findByIdAndDelete(itemId) //or simply >>--  findBy['id']
      .then((modelData) => {
        if (modelData && Object.keys(modelData).length) { return { status: 200, data: JSON.stringify(modelData) }; //returns null or object_
        } else { return { status: 404, data: "(DBs)_del303:- " +modelData }; //not found Error
        } }).catch((modelError) => {
        return { status: 404, data: "(DBs)_del404:- " + modelError }; //DBs_Schema or Rules_validations Error
      }); 
  } catch { return { status: 505, data: "(DBs)_del505 :-" };  } //DBs Connections or Configurations, modules Error
};

  //_computUserWeights(){};