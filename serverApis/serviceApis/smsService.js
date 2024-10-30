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
import { Router, urlencoded } from "express"
const router = Router()
//axios.defaults.headers.post['Content-Type']='gzip'
import { model, mongoose } from "mongoose";
//var Schema = mongoose.Schema,
var ObjectId = mongoose.Types.ObjectId;

import axios  from "axios"
import dotenv from "dotenv"
dotenv.config();

//--------------------servicess
const modelIName = "/sms"
var _now=new Date()
var _programQuery ={
  "schedule.start":{$lte: _now },
  "schedule.end":{ $gte: _now}
}

router.post(modelIName, async (req, res) => {
    // res.setHeader('Content-Type', 'application/json');
  // res.setHeader('Content-Type','text/json')
  //Extracting requestResource...
  let  reqParams = req.query ? req.query : req.params
  let reqData =req.body ?? false
  console.log("Body......................................")
  console.log(req.body)

  let _reciever,_msg = null
  // let _msg = null
  //------waiting Sms From Body
  if(reqData && Object.keys(reqData).length){
    _reciever=reqData.phones
    _msg=reqData.msg
  }else{//------waiting Sms From parameters or queries
    if(reqParams && Object.keys(reqParams).length){
      _reciever =String(reqParams.to).split(',')
      _msg =reqParams.msg
    }else{
      return res.send('Sending Error')
    }
  }
  //----Extract sender & messages
  console.log('messages receiver',_reciever,reqData)
  //--------sending Messages
  for (let rec in _reciever){ 
    //----setup paramets
    //split userPhone by +251923333
    let _rcv =String(_reciever[rec].trim().split(','))//extract +251... or 251.. or 091233 or 912312 formated phone
   console.log("FirstV")
   console.log(_rcv)
    //-----sender Informations
    if(_rcv.includes('+')){ //+251832 format 
      // console.log("IFFFFFFFFFFFFFFFFFFFFFFFF")
      // console.log(_rcv)
      // _rcv = _rcv
    }else{//phone is non(+251) format

      if(_rcv.length > 10){//251934242 format
      //   console.log("ELIFFFFFFFFFFFFFFFFFFFFFFFF")
      // console.log(_rcv)
      }else{//0912321 or 92342 format
        console.log("phone_number:"+_rcv)
        console.log("length:"+_rcv.length)
        _rcv ='+251'+ (_rcv.length == 10 ? 
                  _rcv.substring(1,_rcv.length): 
                  _rcv)//if 091231231 format
      }
    }
    //------build the message url
    ///------sending the messages
    try{
      console.log("sending....................")
      console.log(_rcv)
      console.log(_msg)
      console.log(process.env.canal_URL2)
      const res = await axios.get(process.env.canal_URL,{
        params:{
          to:_rcv,
          text:_msg,
          //-------------------Codding pairs for kannel codding schems
           coding:2,charset:'UTF-8'
        },
        // headers: {
        //   'Content-Type': 'text/html;charset=UTF-8',
        // }
      })
        
    }catch(eror){
      console.log(eror)
    }
  }
  console.log('to_ audience  Respose =>',_msg)
  return res.send('sending messages sent.')
 // 
  //--------------------------------------================================
});
// API
export default router
//----------------------------------Query Builder
