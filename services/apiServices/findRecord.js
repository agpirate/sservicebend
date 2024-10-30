

export async function _findRecord(_model,findBy,returnWhat={}){
    try {
      return await _model
        .findOne(findBy,returnWhat) //findeOne returns :--- Object or null values (while find returns [],[values,....])
        .then(async(modelQA) => {
          // console.log(modelQA,findBy,'Recode Finding')
          if(modelQA ?? false){  //check if existed(findOne result)
            return { status:200, data:modelQA}
          }else{  //create new if not
            return { status:201, data:null}
              }
            //-------------------------Saving Model_END
          }).catch((modelQAR)=>{return { status:404, data:modelQAR}
          }) //------------
    } catch { return { status: 303, data: 'Fatal DATABASE ERROR'};}
    }
