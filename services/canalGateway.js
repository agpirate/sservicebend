import { spawn } from 'child_process';
import * as path from 'path';

import axios  from "axios"
import dotenv from "dotenv"
dotenv.config();

const modelIName = "/canalfeed"

async function canalGateway(_rcv,_msg){
    let _recieverNumbers =typeof _rcv =='object' ? _rcv : [_rcv]
    for(let phoneIndex in _recieverNumbers){
        try{
            const res = await axios.get(process.env.canal_URL,{
                params:{
                  to:_recieverNumbers[phoneIndex],
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
        }catch{
            
        }
     
    }
    //console.log('Sending Response',process.env.canal_URL)
    return true
  }

  export default canalGateway