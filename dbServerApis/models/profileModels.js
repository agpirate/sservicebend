
import { profileDBs } from ".././dbConns.js";
import { profileSchema,audienceSchema,_permission } from "../schemas/profileSchemas.js";

import { mongoose } from "mongoose";
var Schema = mongoose.Schema;

//ObjectId = Schema.ObjectId;


var todday = () => new Date().toLocaleDateString();//.split("T");
//------------------------------------------------------------------
let acctypeSchema = new Schema(
  _permission,
  {
    timestamps: todday,
    //{currentTime: () => Math.floor(Date.now() / 1000) }
  }
);
acctypeSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

//----------------------------------------------------------------
let _profileSchema = new Schema(
  profileSchema,
  {
    timestamps: todday,
    //{currentTime: () => Math.floor(Date.now() / 1000) }
  }
);
_profileSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});
//---------------------------------------------------------------------

let _audienceSchema = new Schema(
  audienceSchema,
  {
    timestamps: todday,
    //{currentTime: () => Math.floor(Date.now() / 1000) }
  }
);
_audienceSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  ////object.updatedAt=//object.updatedAt.toLocaleDateString()
  return object;
});
//-----------------------------------------------------------------------
//----------------------modeling Schemass
//----------------------------------------------------------------------

var acctypeModel;
if (profileDBs.model.acctypeModel ?? false) {
  console.log("acctype Collections already existed on ");
} else {
  acctypeModel = profileDBs.model("acctypes", acctypeSchema);
}

var profileModel;
if (profileDBs.model.profileModel ?? false) {
  console.log("profile Collections already existed on ");
} else {
  console.log("profile Collections not existed on ");
  profileModel = profileDBs.model("profiles", _profileSchema);
}

/**/
var audienceModel;
if (profileDBs.model.audienceModel ?? false) {
  console.log("audience Collections already existed on ");
} else {
  audienceModel = profileDBs.model("audiences", _audienceSchema);
}

//--------------------Initializing Databasess (and Create permissions)
const _acc = [
  {   group:'creator',
     profile:{ group:'creator',role:['*'],capability:'1110'},
     profileMeta:'creator',
     saleit:{ group:'creator',role:[""],capability:'1000',accstage:[1,3,4,5]},
     saleitcli:{ group:'creator',role:["***"],capability:'1110',accstage:[1,3,4,5]},
  },
  {    group:'supervisor',
    profile:{ group:'supervisor',role:['*'],capability:'1110'},
    profileMeta:'supervisor',
    saleit:{ group:'supervisor',role:["",],capability:'1110',accstage:[1,3,4,5]},
    saleitcli:{ group:'supervisor',role:["***"],capability:'1110',accstage:[1,3,4,5]},
 },
 {   group:'official',
 profile:{ group:'official',role:['*'],capability:'1110'},//can do all @HisContent
 profileMeta:'official',
 saleit:{ group:'official',role:['*'],capability:'1110',accstage:[1,2,3,4,5]}, //can do all @HisContent
 saleitcli:{ group:'official',role:["***"],capability:'1110',accstage:[1,3,4,5]},

},
  {   group:'admin',
    profile:{ group:'admin',role:['***'],capability:'1111'},
    profileMeta:'admin',
    saleit:{ group:'admin',role:['***'],capability:'1111',accstage:[1,2,3,4,5]},
    saleitcli:{ group:'admin',role:["***"],capability:'1111',accstage:[1,3,4,5]},

 },
];  

//Once Permission Rules Created ---Cooment both_Below Lines....

//acctypeModel.create(_acc).then((createdProducts) => {console.log('Products created:', createdProducts); })
 // .catch((error) => {console.error('Error creating products:', error); });

console.log('profileModel==============')

//-------------------- exporting schemas
export { profileModel,audienceModel,acctypeModel }; //,rawmatterialModel,supplierModel };
