/**
 * More info about this file:
 * https://v2.quasar.dev/quasar-cli-vite/developing-ssr/ssr-webserver
 *
 * Runs in Node context.
 */

import express from "express"
import compression from "compression"
import cookieParser from "cookie-parser"
import bodyParser  from "body-parser"
import cors from "cors"
import iconv from 'iconv-lite'

import path from "path";
import dirname from "path"

import fs from "fs";

import dotenv from "dotenv"
dotenv.config();

const app = express()

//---------global Variables
const PROD ='false'
const DEV ='false'

const PORT = process.env.PORT || 3000 ;

app.listen(PORT, () => {
      console.log(PORT,'pro')
      if (PROD) {
        console.log('Server listening at port ' + PORT)
      }
    })

  //   app.use((req, res, next) => {
  //     if (req.headers['content-type'] === 'application/octet-stream' &&
  //         req.headers['content-transfer-encoding'] === '2') {
  //         let buffer = [];
  //         req.on('data', chunk => {
  //             buffer.push(chunk);
  //         });
  //         req.on('end', () => {
  //             let data = Buffer.concat(buffer);
  //             req.body = iconv.decode(data, 'utf-16be');
  //             next();
  //         });
  //     } else {
  //         next();
  //     }

  // });

  app.use(cors())
  app.disable('x-powered-by')

  // Middleware to parse cookies
  app.use(cookieParser());
  app.set("view engine", "ejs");
  app.use(bodyParser.json());
  //-------------------------serving statics

  if (PROD) {
    app.use(compression())
  }

  app.use('/photos',express.static('public/photo')); 

  app.use((req, res, next) => { //every request goes through here
    // Set common headers for all responses
    res.setHeader('X-Powered-By', 'smsService');
    res.setHeader('Content-Type', 'application/json');
    
    // Set security headers
    //res.setHeader('X-Content-Type-Options', 'nosniff');
    //res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    //res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Prevent browser caching
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '4d');
    // Call the next middleware
    next();
  });
  


  //1) Home & token authentication
  import tokenApi from './serverApis/profileApis/tokenApi.js'

  //2) Login (Authentications Users)
  import profileApi from './serverApis/profileApis/profileApi.js'

  //[[[[[3]]]]] ----Client_User content(Modeling)
  import _questionprogram from './serverApis/modalApis/_questionprogramApi.js'
  import _answeres from './serverApis/modalApis/_answeresApi.js'
  
 //[[[[[3]]]]] ----Client_User content(Modeling)
  import _pollprogramAPI from './serverApis/modalApis/_pollprogramAPI.js'
  import _contestantAPI from './serverApis/modalApis/_contestantAPI.js'
  import _votesAPI from './serverApis/modalApis/_votesAPI.js'

  //[[[[[3]]]]] ----Client_User content(Modeling)
  import _feedbackprogramAPI from './serverApis/modalApis/_feedbackprogramAPI.js'
  import _feedbacksAPI from './serverApis/modalApis/_feedbacksAPI.js'
    
  //[[[[[3]]]]] ----Client_User content(Modeling)
  import canalService from './serverApis/serviceApis/canalService.js'
  import smsService from './serverApis/serviceApis/smsService.js'
  import pieService from './serverApis/serviceApis/pieService.js'

  import audienceApi from './serverApis/profileApis/audienceApi.js'

  //-------------------------------------------Custome Routes

    //APIs
    
  //1) Home & token authentication
  app.use('/api', tokenApi); 

  //2) Login (Authentications Users)
  app.use('/user', profileApi); 
  app.use('/client', audienceApi); 
  app.use('/pie', pieService); 

  //[[[[[1]]]]] ----Client_User profile(Modeling)
  app.use('/question',_questionprogram); 
  app.use('/answer',_answeres); 
  
  app.use('/pollprogram', _pollprogramAPI); 
  app.use('/contestant',_contestantAPI); 
  app.use('/vote',_votesAPI); 
  
  app.use('/feedback', _feedbackprogramAPI); 
  app.use('/response', _feedbacksAPI); 

  //-------------CanalService
  app.use('/canalfeed',canalService)
  app.use('/send',smsService)

  app.get( '/' , (req,res) => {
    res.json({'a':'homepage'}) //sendFile(path.join('./pages/index.html' ));
    });
    


export default app;

const maxAge = DEV
  ? 0
  : 1000 * 60 * 60 * 24 * 30

/**
 * Should return middleware that serves the indicated path
 * with static content.
 */


const jsRE = /\.js$/
const cssRE = /\.css$/
const woffRE = /\.woff$/
const woff2RE = /\.woff2$/
const gifRE = /\.gif$/
const jpgRE = /\.jpe?g$/
const pngRE = /\.png$/

/**
 * Should return a String with HTML output
 * (if any) for preloading indicated file
 */

