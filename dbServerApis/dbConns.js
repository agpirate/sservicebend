//import { mongoose } from "mongoose";
//const mongoose=require('mongoose')
import {mongoose} from "mongoose"
import dotenv from "dotenv"
dotenv.config();

const smssMongodApi = process.env.mongodAPI_URL + "/smss";
const profileMongodApi = process.env.mongodAPI_URL + "/profiles";
const MONGO_adminURI = process.env.mongodAPI_URL + "/admin";

// defing the database instance as variable mean as this js_module is imported the get excuted..
try {
  // create mongoose instance of named profileDBs with DB_name of finance
  var profileDBs = mongoose.createConnection(profileMongodApi, {});
  console.log("Connecting to Profile_User DataBases....");

  const profileConnection = profileDBs.connection; // check if the Mongood Server has Already created_DBS and return connection status
  profileDBs.once("open", (_) => {
    console.log(`Profile_User Database connected: ${profileMongodApi}`);
    console.group(`Profile_User connected at: ${profileDBs.host}:${profileDBs.port}`)
  });
  profileDBs.on("error", (err) => {
    console.error(`Profile_User DB connection error: ${err}`);
  });

} catch (err) {
  console.log("Error Connecting to Profile_User DB_"+err);
  process.exit(1);
}

try {
  // create mongoose instance of named smssDBs with DB_name of humanResource
  var smssDBs = mongoose.createConnection(smssMongodApi, {});
  console.log("Connecting to smss DataBases....");

  const smssConnection = smssDBs.connection; // check if the Mongood Server has Already created_DBS and return connection status
  smssDBs.once("open", (_) => {
    console.log(`smss Database connected: ${smssMongodApi}`);
  });

  smssDBs.on("error", (err) => {
    console.error(`smss DB connection error: ${err}`);
  });

} catch (err) {
  console.log("Error Connecting to Finance DB_"+err);
  process.exit(1);
}

var adminDBs = async () => {
  try {
    // create mongoose instance of named adminDBS in here the admin_DBs is holding the original mongoose_instance
    // mongodb connection string
    var adminDBs = mongoose.createConnection(MONGO_adminURI, {});

    const adminConnection = smssDBs.connection;
    adminDBs.once("open", (_) => {
      console.log(`Admin Database connected: ${MONGO_adminURI}`);
      console.log(`MongoDB connected at: ${adminDBs.host}:${adminDBs.port}`);
    });

    adminDBs.on("error", (err) => {
      console.log("Error Connecting to Finance DB_"+err);
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
console.log('DBS==============')

//}
export { profileDBs, smssDBs, adminDBs };
