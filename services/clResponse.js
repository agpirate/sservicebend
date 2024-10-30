import axios  from "axios"
import reply from "../public/reply.js"
console.log(reply)
//------Audience Response Scheme
export default  async function _craftResponse(Message){
    if(Message.sts && Message.msg.length){ //Message Detected
        console.log(Message.msg[0]+ " " +reply + " \n\n"+new Date().toLocaleString())
        return Message.msg[0]+ " \n\n" +reply + " \n"+new Date().toLocaleString()
    }
    else{return reply+ " "+new Date().toLocaleString()  }
  }
