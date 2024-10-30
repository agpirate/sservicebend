//import _permission from "src/hooks/_permission";
import { mongoose } from "mongoose";
var Schema = mongoose.Schema
var ObjectId = Schema.ObjectId;
//var todday = () => Math.floor(Date.now() / 1000);
var todday = () => new Date().toLocaleDateString();//.split("T")[0];

const _permission ={
  //group:{ type: String,  default: "client"},
  profile: {
    group:{
      type: String,
       default: "member",
       enum: ["member","supervisor","official","admin"],
     },
     role:[{
      type: String,
      default: "",
      enum: ["*","***",""],
    }], 
    capability: {
      type: String,
       default: '1010',
     },
     accstage: {
      type: Array,
       default:[],
     }
   },

   queProgram: {
    group:{
      type: String,
       default: "member",
       enum: ["member","supervisor","official","admin"],
     },
     role:[{
      type: String,
      default: "",
      enum: ["*","***",""],
    }], 
    capability: {
      type: String,
       default: '1010',
     },
     accstage: {
      type: Array,
       default:[],
     }
   },
   pllProgram: {
    group:{
      type: String,
       default: "member",
       enum: ["member","supervisor","official","admin"],
     },
     role:[{
      type: String,
      default: "",
      enum: ["*","***",""],
    }], 
    capability: {
      type: String,
       default: '1010',
     },
     accstage: {
      type: Array,
       default:[],
     }
   },
   fedbProgram: {
    group:{
      type: String,
       default: "member",
       enum: ["member","supervisor","official","admin"],
     },
     role:[{
      type: String,
      default: "",
      enum: ["*","***",""],
    }], 
    capability: {
      type: String,
       default: '1010',
     },
     accstage: {
      type: Array,
       default:[],
     }
   },
}

const _userPermissions = {
  //user_id:{ type:ObjectId, ref: "profiles" }, //acctype_:{ type:ObjectId, ref: "acctypes" },
  //acctype_id:{ type:ObjectId, ref: "acctypes" },
  acctype_group:{ type:String,default:'client'},
}

//-------------USER profileSchema_Variables..
//--profileSchema shema
const profileSchema = {

  profile: { type: String,vtype:'file',default: "/profile/profilejpeg.jpeg" },

  username: {
    type: String,Vtype:"String",

       default: "",
       $ifNull: "",
       //required: true,
       //index: { unique: true, dropDups: true },
     },
  password: {
        type: String,Vtype:"String",
         default: "",
         $ifNull: "",
         //required: true,
         //index: { unique: true, dropDups: true },
       },
    firstname: {
      type: String,Vtype:"String",

       default: "",
       $ifNull: "",
       //required: true,
       //index: { unique: true, dropDups: true },
       //---
       validRuleset:"[ val => val && val.length > 0 || 'Please type something']"
     },
     
   lastname: {
       type: String,Vtype:"String",
       default: "",
       $ifNull: "",
       //required: true,
       //index: { unique: true, dropDups: true },
     },

     //-----------------Grouping (Department)
     department: {
      type: String,Vtype:"String",
         default: "",
         $ifNull: "",
         //required: true,
         //index: { unique: true, dropDups: true },
       },

       position: {
        type: String,Vtype:"String",
    
           default: "",
           $ifNull: "",
           //required: true,
           //index: { unique: true, dropDups: true },
         },

    //--------------------------------
    //acckey:{ type:ObjectId, ref: "acctypes" }, //"acctype"/"_id": ObjectId("62d01d17cdd1b7c8a5f945b9")
    //---------------------------------
    //profileCompute,
    role: {
      type: String,Vtype:"String",
         default: "member",
         $ifNull: "member",
         enum:['member','official','admin','ict']
         //required: true,
         //index: { unique: true, dropDups: true },
       },
  }
  
const audienceSchema = {
  
    phone: {
        type: String,Vtype:"String",
        default: "",
        $ifNull: "",
        //required: true,
        //index: { unique: true, dropDups: true },
      },  
      department: {
        type: String,
        default: '',
        $ifNull: '',
        //required: true,
        //index: { unique: true, dropDups: true },
      },       
      count: {
        type: Number,Vtype:"Number",
        default: 0,
        $ifNull: 0,
        //required: true,
        //index: { unique: true, dropDups: true },
      },     
    }

  export { profileSchema,audienceSchema,_permission}



