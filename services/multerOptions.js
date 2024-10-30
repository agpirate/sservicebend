

import multer from "multer";

//import path from "path";
import fs from "fs";

///////-----------Headers modelData
const supportedMimes = {
    "application/pdf": "pdf",
    "application/zip": "zip",
  
    "text/csv": "csv",
    "text/pdf": "pdf",
    "text/json": "json",
  
    "image/jpeg": "jpeg",
    "image/png": "png",
    "image/svg+xml": "svg+xml",
    "image/webp": "webp",
  
    "video/mp4": "mp4",
    "video/mkv": "mkv",
  };
  
 export async function getFileOptions ()  {
    //////////////////////////////console.log('request with UploadFile_Detected - FileUptions -Multer Happening')
    var _fileName =  ""
    var _originalName=  ""
    var _fieldName = ""
    return {
      storage: multer.diskStorage({
        //set fileName
        filename: (req, file, cb) => {
                _originalName = file.originalname.split(".")[0];
                _fileName =_originalName.split(" ")[0] + "-" + new Date().getTime() + "." + supportedMimes[file.mimetype];
                _fieldName =file.fieldname
                cb(null, _fileName);
                },
        destination: (req, file, cb) => {cb(null, "./public/"+ file.fieldname)},
        path:        (req, file, cb) => {cb(null, "/"+file.fieldname +"/"+_fileName)},  
      }),
      //set file_size
      limits: { fileSize: 1000000 * 5 },
      //set file extensions supports
      fileFilter: (req, file, cb) => {
        let extension = supportedMimes[file.mimetype];
        if (!extension) { return cb(null, false);
        } else { cb(null, true);   }

      },

    };

  };
  
 export async function _filesMeta(files){
    let filesMeta ={}
     for(let filelabel in files){   
       filesMeta[filelabel]=[]
       filesMeta[filelabel+"Meta"]=[]   
       var filelist = files[filelabel]
       for(let fileIndex in filelist)
       {   
       try{
         var file = filelist[fileIndex]
         var _thefilePath = "/"+file.fieldname+"/"+file.filename
         var fileMeta = {
            //-----------------------take this only for file(single type)
           //mimetype:file.mimetype,
           //originalname:file.originalname,
           //destination:file.destination,
           //fieldname:file.fieldname,
           //filename:file.filename,
           //path:file.path,
           //----------
           thefilePath:_thefilePath,
           //localPath: encode_localPath,
           geoLocation:"0000000000xyz"
         };
         
         filesMeta[filelabel][fileIndex]=fileMeta.thefilePath
         filesMeta[filelabel+"Meta"][fileIndex]=fileMeta

       }catch{ return false      }
     } }
     return filesMeta
   }


  //-----------Single file Handler
  const getFileOption = (file) => {
    //////////////////////////////console.log('request with UploadFile_Detected - FileUptions -Multer Happening')
    var _originalName= file.originalname.split(".")[0];
    let extension = supportedMimes[file.mimetype];
    var _fieldName = file.fieldname
    var _fileName =  _originalName.split(" ")[0]+ "-" + new Date().getTime() + "." + extension
   ////////////////////////////console.log('calling get file options')
    return {
      storage: multer.diskStorage({
        //Handling Arrayed_graphics
        filename: _fileName,
        destination:"./public/"+ file.fieldname,
        path:   "/"+file.fieldname +"/"+_fileName,
  
      }),
      limits: { fileSize: 1000000 * 5 },
    };
  };