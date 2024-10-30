//const express = require('express');
import {
  queModel,_queModel,
  fedbModel,_fedbModel,
  //audienceModel,
  pollProgramModel,pollContenstantModel,pollVotesModel
  //---
} from "../../dbServerApis/models/serviceModels.js";
import { audienceModel,profileModel } from "../../dbServerApis/models/profileModels.js";
import { _findRecord } from "../../services/apiServices/findRecord.js";

import nodeJk  from "../../services/clResponse.js"
import { Router } from "express"
const router = Router()

import { model, mongoose } from "mongoose";
//var Schema = mongoose.Schema,
var ObjectId = mongoose.Types.ObjectId;

import dotenv from "dotenv"
import { _pllcontentastSchema } from "../../dbServerApis/schemas/serviceSchema.js";
dotenv.config();

//--------------------servicess
const modelIName = "/analysis"

router.get(modelIName, async (req, res) => {
  res.setHeader('Content-Type','text/html')
  //Extracting requestResource...
  let  reqParams = req.query ? req.query : req.params

  let _qanswers =await rOp(_queModel,[{}])
  let _feedbacks =await rOp(_fedbModel,[{}])
  let _contestants =await rOp(pollContenstantModel,[{}])
  
  let _countparticipant=0
  //------------------counting contestant count
  if(_contestants.status == 200){
    for(let i in _contestants.data){
      let _score=_contestants.data[i]?.score ?? 0
      _countparticipant = _countparticipant + _score
    }
  }
  let _pieCount ={'qcount':(_qanswers.status == 200) ?_qanswers.data.length : 0,
  'fcount':(_feedbacks.status == 200) ?_feedbacks.data.length : 0,
  'pcount':_countparticipant}

  console.log('to_ audience  Respose =>',_pieCount)
  return res.status(200).json(_pieCount)// 
  //--------------------------------------================================
});
// API
export default router
//----------------------------------Query Builder

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

