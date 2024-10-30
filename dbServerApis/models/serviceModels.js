import { mongoose } from "mongoose";
import { smssDBs } from "../dbConns.js";
import { queSchema } from "../schemas/serviceSchema.js";
import { _queaudienceSchema } from "../schemas/serviceSchema.js";
import { _pllSchema } from "../schemas/serviceSchema.js";
import { _pllcontentastSchema } from "../schemas/serviceSchema.js";
import { __pllaudienceSchema } from "../schemas/serviceSchema.js";
import { fedbSchema } from "../schemas/serviceSchema.js";
import { _fedbaudienceSchema } from "../schemas/serviceSchema.js";
//import { accComputing } from "../../services/accessComputing"
// initialize the connections on boots...
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

mongoose.set("strictQuery", true);

//-------
var todday = () => new Date().toLocaleDateString();

//-------
const _dateConv = 1000 * 60 * 60 * 24

function _eldate(startDate) {
  var elapsedTime = new Date() - new Date(startDate)
  // Calculate days and hours from milliseconds
  var days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));
  var hours = Math.floor(elapsedTime / (1000 * 60 * 60));
  var minutes = Math.floor(elapsedTime / (1000 * 60));
    hours %= 24;
    minutes %= 60;

  return { days: days, hours: hours,minutes:minutes};
}

//------------------------------ques Schema ..model

let _que = new Schema(
  queSchema,
  { timestamps: todday }
);
_que.method("toJSON",  function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;

  //object.updatedAt= object.updatedAt
  //object.updatedAt= _eldate(object.updatedAt)
  //---------------
  return object;
});

let __que = new Schema(
  _queaudienceSchema,
  { timestamps: todday }
);
__que.method("toJSON",  function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;

  //object.updatedAt= object.updatedAt
  //object.updatedAt= _eldate(object.updatedAt)
  //---------------
  return object;
});


//////////////////////////////////---feedback..schema ...model
let _pll = new Schema(
  _pllSchema,
  { timestamps: todday }
);
_pll.method("toJSON",  function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;

  //object.updatedAt= object.updatedAt
  //object.updatedAt= _eldate(object.updatedAt)
  //---------------
  return object;
});

let __pll = new Schema(
  _pllcontentastSchema,
  { timestamps: todday }
);
__pll.method("toJSON",  function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;

  //object.updatedAt= object.updatedAt
  //object.updatedAt= _eldate(object.updatedAt)
  //---------------
  return object;
});

let ___pll = new Schema(
  __pllaudienceSchema,
  { timestamps: todday }
);
___pll.method("toJSON",  function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;

  //object.updatedAt= object.updatedAt
  //object.updatedAt= _eldate(object.updatedAt)
  //---------------
  return object;
});

//////////////////////////////----poolls
let _fedb = new Schema(
  fedbSchema,
  { timestamps: todday }
);
_fedb.method("toJSON",  function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;

  //object.updatedAt= object.updatedAt
  //object.updatedAt= _eldate(object.updatedAt)
  //---------------
  return object;
});

let __fedb = new Schema(
  _fedbaudienceSchema,
  { timestamps: todday }
);
__fedb.method("toJSON",  function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;

  //object.updatedAt= object.updatedAt
  //object.updatedAt= _eldate(object.updatedAt)
  //---------------
  return object;
});
////////////////////////////---------client

//------------------------------comment Schema

//----------------------modeling Schemass  // it would check if model/Document exists or create new Docs.
var queModel;
//console.log('is empyModel Exist',Object.keys(procDBs.model.empy))
if (smssDBs.model.queModel) {
  console.log("sale it Collections already existed on questionaries content");
} else {
  queModel = smssDBs.model("questionaries", _que);
}
var _queModel;
//console.log('is empyModel Exist',Object.keys(procDBs.model.empy))
if (smssDBs.model._queModel) {
  console.log("sale it Collections already existed on questionaries content");
} else {
  _queModel = smssDBs.model("audiencequestionaries", __que);
}
//-----
var pollProgramModel;
//console.log('is empyModel Exist',Object.keys(procDBs.model.empy))
if (smssDBs.model.pollProgramModel) {
  console.log("sale it Collections already existed on poll content");
} else {
  pollProgramModel = smssDBs.model("programpolls", _pll);
}

var pollContenstantModel;
//console.log('is empyModel Exist',Object.keys(procDBs.model.empy))
if (smssDBs.model.pollContenstantModel) {
  console.log("sale it Collections already existed on poll content");
} else {
  pollContenstantModel = smssDBs.model("polls", __pll);
}

var pollVotesModel;
//console.log('is empyModel Exist',Object.keys(procDBs.model.empy))
if (smssDBs.model.pollVotesModel ?? false) {
  console.log("sale it Collections already existed on poll content");
} else {
  pollVotesModel = smssDBs.model("audiencepolls", ___pll);
}
//-----
var fedbModel;
//console.log('is empyModel Exist',Object.keys(procDBs.model.empy))
if (smssDBs.model.fedbModel ?? false) {
  console.log("sale it Collections already existed on feedback content");
} else {
  fedbModel = smssDBs.model("programfeedbacks", _fedb);
}

var _fedbModel;
//console.log('is empyModel Exist',Object.keys(procDBs.model.empy))
if (smssDBs.model._fedbModel ?? false) {
  console.log("sale it Collections already existed on feedback content");
} else {
  _fedbModel = smssDBs.model("audiencefeedbacks", __fedb);
}
//-----
//-------------------- exporting schemas


let _fresp = [  
  {   
fcode:'admin',
summary:'cHello',
profileMeta:'admin',
saleit:{ group:'admin',role:['***'],capability:'1111',accstage:[1,2,3,4,5]},
saleitcli:{ group:'admin',role:["***"],capability:'1111',accstage:[1,3,4,5]},
},
];  

//acctypeModel.create(_acc).then((createdProducts) => {console.log('Products created:', createdProducts); })
 // .catch((error) => {console.error('Error creating products:', error); })

export {
  queModel,
  _queModel,
  pollProgramModel,
  pollContenstantModel,
  pollVotesModel,
  fedbModel,
  _fedbModel,

}; //,rawModel,supplierModel };
