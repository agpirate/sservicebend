//import user3A from "src/hooks/user3A";
import { mongoose } from "mongoose";
var Schema = mongoose.Schema
var ObjectId = Schema.ObjectId;
//var todday = () => Math.floor(Date.now() / 1000);
var todday = () => new Date().toLocaleString();//.split("T")[0];
//-------------USER PROFILE_Variables..
const queSchema = {
  status: { // will hold User_ID/phone as ref_value
    type: String,vtype:"String",
    default: "",
    $ifNull: "",
  },
  //-------------item_staus(stage)
  summary: { // will hold User_ID/phone as ref_value
    type: String,vtype:"String",
    default: "",
    $ifNull: "",
  }, //-------
  creator_id:{
    type: String,vtype:"String",
    default: "",
    $ifNull: "",
  },
  department: { //department
    type: String,Vtype:"String",
       default: "",
       $ifNull: "",
       //required: true,
       //index: { unique: true, dropDups: true },
     },
  answer: { // will hold User_ID/phone as ref_value ( answere - answereMeta )
    type: String,vtype:"String",
    default: "",
    $ifNull: "",
  },
  qcode: { // will hold User_ID/phone as ref_value
    type: String,vtype:"String",
    default: "",
    $ifNull: "", //
  },  
  schedule: { // will hold User_ID/phone as ref_value
    start: { // will hold User_ID/phone as ref_value
      type: Date,vtype:"Date",
      default: "",
      $ifNull: "",
    },  
    end: { // will hold User_ID/phone as ref_value
      type: Date,vtype:"Date",
      default: "",
      $ifNull: "",
    },  
  },  
    //---------------------------------
  }
const _queaudienceSchema = {
    //-------------item_staus(stage)
    qid: { // will hold User_ID/phone as ref_value
      type: String,vtype:"String",
      default: "",
      $ifNull: "",
    },
    cid: { type:ObjectId, ref: "audiences" },

    answer: { // will hold User_ID/phone as ref_value
      type: String,vtype:"String",
      default: "",
      $ifNull: "",
    },
    correct: { // will hold User_ID/phone as ref_value
      type: Boolean,vtype:"Boolean",
      default: false,
      $ifNull:true,
    },
  }

const _pllSchema = {
    //-------------item_staus(stage)
    status: { // will hold User_ID/phone as ref_value
      type: String,vtype:"String",
      default: "",
      $ifNull: "",
    },
    //-------
    creator_id: {
      type: String,vtype:"String",
      default: "",
      $ifNull: "",
    },
    department: {
      type: String,Vtype:"String",
         default: "",
         $ifNull: "",
         //required: true,
         //index: { unique: true, dropDups: true },
       },
    summary: { // will hold User_ID/phone as ref_value
      type: String,vtype:"String",
      default: "",
      $ifNull: "",
    },
    programId: { // will hold User_ID/phone as ref_value
      type: String,vtype:"String",
      default: "",
      $ifNull: "",
    },
    message: { // will hold User_ID/phone as ref_value
      type: String,vtype:"String",
      default: "",
      $ifNull: "",
    },
    schedule: { // will hold User_ID/phone as ref_value
      start: { // will hold User_ID/phone as ref_value
        type: Date,vtype:"Date",
        default: new Date(),
        $ifNull: new Date(),
      },  
      end: { // will hold User_ID/phone as ref_value
        type: Date,vtype:"Date",
        default: new Date(),
        $ifNull: new Date(),
      },  
    },  
      //---------------------------------
    }

const _pllcontentastSchema = {
      //-------------item_staus(stage)
      creator_id:{
        type: String,vtype:"String",
        default: "",
        $ifNull: "",
      },
       //-------
      //pid: { type:ObjectId, ref: "prograprogrampolls" },
      pid:{
        type: String,vtype:"String",
        default: "",
        $ifNull: "",
      },
      code: { // will hold User_ID/phone as ref_value
        type: String,vtype:"String",
        default: "",
        $ifNull: "",
      },
      name: { // will hold User_ID/phone as ref_value
        type: String,vtype:"String",
        default: "",
        $ifNull: "",
      },
      photo: { // will hold User_ID/phone as ref_value
        type: String,vtype:"String",
        default: "",
        $ifNull: "",
      },
      score: { // will hold User_ID/phone as ref_value
        type: Number,vtype:"Number",
        default: 0,
        $ifNull: 0,
      },
      age: { // will hold User_ID/phone as ref_value
        type: Number,vtype:"Number",
        default: 0,
        $ifNull: 0,
      },
    }

const __pllaudienceSchema = {
      //-------------item_staus(stage)
      pid: { // will hold User_ID/phone as ref_value
        type: String,vtype:"String",
        default: "",
        $ifNull: "",
      },
      c_code: { // will hold User_ID/phone as ref_value
        type: String,vtype:"String",
        default: "",
        $ifNull: "",
      },
      cid: { type:ObjectId, ref: "audiences" },
    }

const fedbSchema = {//-------------item_staus(stage)
      status: { // will hold User_ID/phone as ref_value
        type: String,vtype:"String",
        default: "",
        $ifNull: "",
      },
      //-------
      creator_id: {
        type: String,vtype:"String",
        default: "",
        $ifNull: "",
      },
      department: {
        type: String,Vtype:"String",
           default: "",
           $ifNull: "",
         },
      summary: { // will hold User_ID/phone as ref_value
        type: String,vtype:"String",
        default: "",
        $ifNull: "",
      },
      fcode: { // will hold User_ID/phone as ref_value
        type: String,vtype:"String",
        default: "",
        $ifNull: "",
      },
      schedule: { // will hold User_ID/phone as ref_value
        start: { // will hold User_ID/phone as ref_value
          type: Date,vtype:"Date",
          default: "",
          $ifNull: "",
        },  
        end: { // will hold User_ID/phone as ref_value
          type: Date,vtype:"Date",
          default: "",
          $ifNull: "",
        },  
      },  
        //---------------------------------
      }

const _fedbaudienceSchema = {
        //-------------item_staus(stage)
        fcode: { // will hold User_ID/phone as ref_value
          type: String,vtype:"String",
          default: "",
          $ifNull: "",
        },
        //-------
        fid:  { // will hold User_ID/phone as ref_value
          type: String,vtype:"String",
          default: "",
          $ifNull: "",
        },
        //---
        cid: { type:ObjectId, ref: "audiences" },
        content: { // will hold User_ID/phone as ref_value
          type: String,vtype:"String",
          default: "",
          $ifNull: "",
        },
      }

export { queSchema,_queaudienceSchema,_pllSchema,_pllcontentastSchema,__pllaudienceSchema,fedbSchema,_fedbaudienceSchema}