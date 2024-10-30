//const express = require('express');
import {
  queModel,_queModel,
  fedbModel,_fedbModel,
  //audienceModel,
  pollProgramModel,pollContenstantModel
  //---
} from "../../dbServerApis/models/serviceModels.js";
import { audienceModel } from "../../dbServerApis/models/profileModels.js";
import { _findRecord } from "../../services/apiServices/findRecord.js";

import nodeJk  from "../../services/clResponse.js"
import { Router } from "express"
const router = Router()

import { spawn } from 'child_process';
import * as path from 'path';

import axios  from "axios"
import dotenv from "dotenv"
dotenv.config();

const modelIName = "/canalfeed"

var _now=new Date()
var _programQuery ={
  "schedule.start":{$lte: _now },
  "schedule.end":{ $gte: _now}
}
async function registerAudience(reqData,findBy){
  try {
    return await audienceModel
      .findOne(findBy) //findeOne returns :--- Object or null values (while find returns [],[values,....])
      .then(async(modelQA) => {
        if(modelQA ?? false){  //check if existed(findOne result)
          modelQA.count ++
          //////console.log('Updating Existing Audience',findBy)
        }else{  //create new if not
          modelQA = new audienceModel(reqData);
          modelQA.count=1
          //////console.log('Adding New Audience',findBy)
            }

            return  await modelQA.save().then((modelData) => {
              if (modelData && Object.keys(modelData).length) {
                //////console.log('Client Done')
                return { status: 200, data: modelData };
              } else {return { status: 303, data: modelData}; }
            }).catch((modelError) => {return { status: 303, data: modelError}; });
          //-------------------------Saving Model_END
        }).catch((modelQAR)=>{return { status:303, data:modelQAR}
        }) //------------
  } catch { return { status: 303, data: 'Fatal DATABASE ERROR'};}
  }
async function _register_polAns(_model,reqData,findBy){
    try {
      return await _model
        .findOne(findBy) //findeOne returns :--- Object or null values (while find returns [],[values,....])
        .then(async(modelQA) => {
          if(modelQA ?? false){  //existing
            modelQA.score = (modelQA.score ?? false) ? modelQA.score +1 : 1  
          }else{  //if No_record
            return { status: 303, data: 'Null Record'};
              }
            return  await modelQA.save().then((modelData) => {
                if (modelData && Object.keys(modelData).length) {
                //////console.log('PllContesant Done')
                  return { status: 200, data: modelData };
                } else {return { status: 303, data: modelData}; }
              }).catch((modelError) => {return { status: 303, data: modelError}; });
            //-------------------------Saving Model_END
          }).catch((modelQAR)=>{return { status:303, data:modelQAR}
          }) //------------
    } catch { return { status: 303, data: 'Fatal DATABASE ERROR'};}
    }
async function _register_fedbAns(_model,reqData,findBy){
      try {
        return await _model
          .findOne(findBy) //findeOne returns :--- Object or null values (while find returns [],[values,....])
          .then(async(modelQA) => {
            modelQA = new _model(reqData);
            return  await modelQA.save().then((modelData) => {
              if (modelData && Object.keys(modelData).length) {
                //////console.log('Feedback Done')
                return { status: 200, data: modelData };
              } else {return { status: 303, data: modelData}; }
            }).catch((modelError) => {return { status: 303, data: modelError}; });
              //-------------------------Saving Model_END
        }).catch((modelQAR)=>{return { status:303, data:modelQAR}
        }) //------------
      } catch { return { status: 303, data: 'Fatal DATABASE ERROR'};}
      }
async function _register_queAns(_model,reqData,findBy){
  try {
    return await _model
      .findOne(findBy) //findeOne returns :--- Object or null values (while find returns [],[values,....])
      .then(async(modelQA) => {
        modelQA = new _model(reqData);
        return  await modelQA.save().then((modelData) => {
          if (modelData && Object.keys(modelData).length) {
            //////console.log('Questionarie|Ans Done')
            return { status: 200, data: modelData };
          } else {return { status: 303, data: modelData}; }
        }).catch((modelError) => {return { status: 303, data: modelError}; });
          //-------------------------Saving Model_END
    }).catch((modelQAR)=>{return { status:303, data:modelQAR}
    }) //------------
  } catch { return { status: 303, data: 'Fatal DATABASE ERROR'};}
  }
const scriptPath = path.join(process.cwd(),'..','/sms-backend/scripts/pydecoding.py');

router.get(modelIName, async (req, res) => {
    res.setHeader('Content-Type','text/plain;charset=UTF-8'); 

    let  reqParams = req.query ? req.query : req.params
    let msg = req.query.msg;
    //console.log(msg)
    //----Data Validatios
    try{reqParams=JSON.parse(reqParams)}catch{}
    var _msg,_clientP =[false,false]
    _msg = reqParams.msg ?? _msg
    _clientP = reqParams?.['sender'] ?? _clientP

   //console.log("\n=======Received SMS=========>\n\n")
   console.log(reqParams,"Full Parameters\n")
   console.log(_msg,"Extracted Message Parameters\n")
   console.log(_clientP,"Extracted Client Phone \n")

    if(!(_msg && _clientP)){
      let _respMsg = await nodeJk(false);
      _redirectRes(_clientP,_respMsg);
      return res.send(await nodeJk(false)) 
      }

    // _msg = _msg ? String(_msg).trim() : _msg
    _clientP = _clientP ? String(_clientP).trim() : _clientP

    //-----sender Informations
    if(_clientP.includes('+')){ //+251832 format 
      // _clientP = _clientP
    }else{//phone is non(+251) format
      if(_clientP.length > 10){//251934242 format
      }else{//0912321 or 92342 format
        _clientP ='251'+ (_clientP.length == 10 ? 
                  _clientP.substring(1,_clientP.length): 
                  _clientP)//if 091231231 format
      }
    }
   //console.log(_clientP,"Formatted Client Phone Number\n")
    //--------------Sender Registratins and settings
    var _audienceInfo = reqParams
    _audienceInfo['phone'] =_clientP
    // _audienceInfo['department']=0
    var _client = await registerAudience(_audienceInfo,{phone:_clientP})
    //------------Decoding Service
    //console.log("Client Registration Result\n")
    //console.log(_client,"Client Data\n")

    //---------------Managing Message Data
    let _charset = reqParams.charset ?? false
    let _coding = Number(reqParams.coding ?? 0)

    if(_charset &&  _charset.toLowerCase().includes('utf-16be' || 'utf-16')){
      //console.log(_msg)
      _msg=reqParams.msg.replace(/\\x/g,'%')
      _msg = _msg.replace(/\x/g,'%') 

      let pythonProcess = ''
      let result =''
      try{
        pythonProcess =  spawn('python3', [scriptPath, _msg, 1]);
      }catch(error){
        let _respMsg = await nodeJk(false);
        _redirectRes(_clientP,_respMsg);
        return res.send(await nodeJk(false)) 
      }
      // _content = ''
       pythonProcess.stdout.on('data', (data) => {
          result += data.toString()
      });
      // Listen for stderr data from the Python process
        pythonProcess.stderr.on('data', async(data) => {
            //----------------
        //console.log(data,'Error Decoded Daata')

        result = ''
      });
      
      return pythonProcess.on('close',async(code) =>{
        _msg =false
        if(code === 0){
          if(result && (_client.status == 200)){ //check clientRegister and Message Existance
              _msg = await _programIdentifier(_client,result)
            }
        }

        //--------------Responding Parameters && setups
      res.setHeader('Content-Type','text/plain;charset=UTF-8');
      let _respMsg = await nodeJk(true,_msg);

      console.log("\nData Received && Registered As && Forwarding to Client!\n")
      console.log(_respMsg,_clientP,'\n')

      _redirectRes(_clientP,_respMsg);
      return res.send(_respMsg)
      }
    )
    }else{

      //console.log(_clientP,"UTF_8 Encoding Data Received\n")
      if(_msg && (_client.status == 200)){ //check clientRegister and Message Existance
        _msg = await _programIdentifier(_client,_msg)
      }else{ return res.send(await nodeJk(false)) }
      //--------------Responding Parameters && setups

      res.setHeader('Content-Type','text/plain;charset=UTF-8');
      let _respMsg = await nodeJk(true,_msg);

      console.log("\nData Received && Registered As && Forwarding to Client!\n")
      console.log(_respMsg,_clientP,'\n')

      _redirectRes(_clientP,_respMsg);
      return res.send(_respMsg)
    }
  //--------------------------------------================================
});

// API
export default router
//----------------------------------Query Builder
async function _programIdentifier(_client,_msg){
  try{
  var [_programCode,_programCodeii,_content] =[null,null,null]
  let _jmsg = _msg

  let _cleanSpaces = ''
  let prgramLetter =''
  _msg=_msg.trim()
    try{
         _cleanSpaces = (_msg.split(' ').filter(char => char.trim() !== ' ').join(''));//cleaning string for code Extraction
         prgramLetter = (_cleanSpaces.trim())[0].toLocaleLowerCase()
        if(prgramLetter =='t'){
          _programCodeii = _cleanSpaces.slice(0,3).toLowerCase()//slice first letter
          _content =((_msg).substring(3,_msg.length).trim()) //slice excluding first letter
        }else{
          _programCodeii = _cleanSpaces.slice(0,2).toLowerCase()//slice first letter
          _content =((_msg).substring(2,_msg.length).trim()) //slice excluding first letter
        }
        }catch(e){      
      _defaultCollector(_clientData,_msg,e)
      _msg= ['Please check the Format,']
      return _msg
    }
 
  let _clientData ={'cid':_client.data.id ?? null,'phone':_client.data.phone} 
//console.log("\nProgram Classfication\n")
//console.log('Program Letter =',prgramLetter,'\nProgramCode =',_programCodeii+'\n')

  if((prgramLetter =='t') ){

   _programQuery.programId ={$regex :_programCodeii, "$options": "i"}
    let _resultpRecord = await _findRecord(pollProgramModel,_programQuery)
    //console.log('\nPolls (TTV) Query Parameters ==',_programQuery)
    //console.log('\nPolls (TTV) Query Result ==',_resultpRecord)
    if(_resultpRecord.status == 200)//the program is alive
    {
      let _recData =_resultpRecord.data
      let _pollcon =await _register_polAns(pollContenstantModel,null,{'code':{$regex :_content, "$options": "i"},'pid':_recData.id}) 
      _msg=_pollcon.status == 200 ? ["You voted for " +_content+'; Tell Your Familly & Friends to Vote ['+_pollcon.data.name+'] too ! \n'] : ['No Contestant Found,'] 
      console.log('\nPolls Vote Result ==',_msg)
      return _msg
    }
    else{
      _defaultCollector(_clientData,_jmsg,_resultpRecord)
      _msg=(_content == 'mq') ? ['!$!'] : ['\nTTV Code_Tewedaderti <= Yteqemu ;\n']
      return _msg
    }
  }
  else{

    if((prgramLetter =='p') ){
      _programQuery.programId =_programCodeii//{$regex :_programCodeii, "$options": "i"}
      let _resultpRecord = await _findRecord(pollProgramModel,_programQuery)
      if(_resultpRecord.status == 200)//the program is alive
      {
        let _recData =_resultpRecord.data
        let _pollcon =await _register_polAns(pollContenstantModel,null,{'code':{$regex :_content, "$options": "i"},'pid':_recData.id}) 
        _msg=_pollcon.status == 200 ? ["you voted for " +_content +' ']  : ['.']
        return _msg
      }
      else{
        _defaultCollector(_clientData,_jmsg,_resultpRecord)
        _msg=(_content == 'tsg') ? ['!$!'] : [',']
        return _msg
      }
    }else{
      //////console.log('--------------------------',_content,_programCodeii)
      if((prgramLetter  == 'q')){
        _programQuery.qcode =_programCodeii//{$regex : _programCodeii, "$options": "i"}  //Finde Active Questionaries by qcode or liveItem_Date
        let _resultqRecord = await _findRecord(queModel,_programQuery)
  
        if(_resultqRecord.status == 200)//the program is alive
        {
          let _recData =_resultqRecord.data
          //--------Register Incoming Answeres (with cid,answere,correct)
          _clientData.qid= (_recData.id ?? false) ? _recData.id : null 
          _clientData.qcode=_recData.qcode ?? ''
          _clientData.answer=_content 
          // _clientData.correct=(_recData.answer.toLowerCase().includes(_content)) ? true:false
          _clientData.correct = _content.toLowerCase() == _recData.answer.toLowerCase()
          // _clientData.correct=(_content.toLowerCase().includes(_recData.answer.toLowerCase())) ? true:false
          //---Register
          let _queAns =await _register_queAns(_queModel,_clientData,{'answer':false})  //update client_choices list
          _msg=_queAns.status == 200 ? [''] : ['.']
          return _msg
        }
        else{
          _defaultCollector(_clientData,_jmsg,_resultqRecord)
          _msg=['']
          return _msg
        }
      }
      else{
        _programQuery.fcode ={$regex : _programCodeii, "$options": "i"}//Finde Active Feedback by fcode or active
        let _resultfRecord = await _findRecord(fedbModel,_programQuery)
        if(_resultfRecord.status == 200 && prgramLetter  =='q')//the program is alive
        {
          let _recData =_resultfRecord.data
         //--------Register Incoming Fedbacks (with cid,fid,content,fcode,correct)
          _clientData.fid=(_recData?.id ?? false) ? _recData.id : null
          _clientData.content=_content ?? ''
          _clientData.fcode=_recData.fcode ?? ''
          //---Register
          let _febs = await _register_fedbAns(_fedbModel,_clientData,{'content':false})  //update client_choices list
          _msg=_febs.status == 200 ? [''] : ['.']
          return _msg
        }
        else{
          _defaultCollector(_clientData,_jmsg,_resultfRecord)
          _msg=['Please Correct The Format,'] 
          return _msg
  
        }
      }
    }
    
  }


}catch(e){
    _defaultCollector({},'',e)
          _msg=['Please Correct The Format,'] 
    return _msg

  }

}
async function _defaultCollector(_clientData={},_content='',reason=null){
  //--------Register Incoming Fedbacks (with cid,fid,content,fcode,correct)
  //console.log(`\n ========= Defaulting Reasons =======\n`)
  //console.log(reason)
  try{_clientData['a']='a'
  }catch{_clientData={}}

   _clientData.fid=''
   _clientData.content=_content
   _clientData.fcode='default'
   //---Register
   try{
    let _default =await _register_fedbAns(_fedbModel,_clientData,{'updatedAt':null})  //update client_choices list
   }catch{ }
  ////console.log('defaulting Message',_clientData)
   return ['']
}

async function _redirectRes(_rcv,_msg){
  const res = await axios.get(process.env.canal_URL,{
    params:{
      to:_rcv,
      text:_msg,
      //-------------------
      coding:2,charset:'UTF-8'
    },
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'Coding':2
    }
  }
  )
    // //console.log('Sending Response',process.env.canal_URL)
  return true
}

