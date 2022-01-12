const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dataHandling=require("../functions");
const db=admin.firestore()

async function Create(req,res){
  const temp=[];
    
      req.body.Countries.forEach(element => {
        console.log(element)
        element.index=Date.now();
        temp.push(dataHandling.Create("Countries",element))
      });   
      await Promise.all(temp);
      return res.json(true)
  }


  async function  Update(req,res){
    req.body.index=Date.now()
    await dataHandling.Update("Countries",req.body,req.body.DocId)
  return res.json(true)
  }
  async function Delete(req,res){ 
    await dataHandling.Delete("Countries",req.body.DocId)
    return res.json(true)
  }
  
  async function Read(req,res){
    try {
      const data=await dataHandling.Read("Countries",req.body.DocId,req.body.index,req.body.Keyword);
      return res.json(data)
    } catch (error) {
      functions.logger.error(error)
    }
   
  }

 
  
  // async function  CreateTeam(obj){
  //     await dataHandling.Create("Category",obj)
  //   return true;
  // }
  
  module.exports={
      Create,
      Update,
      Delete,
      Read
  }
  

