const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dataHandling=require("../functions");

async function Create(req,res){
    req.body.index=Date.now()
     await  dataHandling.Create("QuestionsAndAnswers",req.body)
     return res.json(true)
  }
 async function  Update(req,res){
    req.body.index=Date.now()
   await dataHandling.Update("QuestionsAndAnswers",req.body,req.body.DocId)
  return res.json(true)
  }
 async function Delete(req,res){ 
   await dataHandling.Delete("QuestionsAndAnswers",req.body.DocId)
    return res.json(true)
  }

  async function Read(req,res){
    if(req.body.CategoryId===undefined){
      const data=await dataHandling.Read("QuestionsAndAnswers",req.body.DocId,req.body.index,req.body.Keyword);
      return res.json(data)
    }else{
      const data=await dataHandling.Read("QuestionsAndAnswers",req.body.DocId,req.body.index,req.body.Keyword,req.body.limit,["CategoryId","==",req.body.CategoryId]);
      return res.json(data)
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