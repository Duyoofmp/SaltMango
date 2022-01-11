const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dataHandling=require("../functions");
const { database } = require('firebase-functions/v1/firestore');

async function Create(req,res){
    req.body.index=Date.now()
    query = await admin.firestore().collection("QuestionsAndAnswers").get()
    const size = query.size
    req.body.number=size+1
     await  dataHandling.Create("QuestionsAndAnswers",req.body.questions)
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

  async function Check(req,res){
   let msg= await dataHandling.Check("QuestionsAndAnswers",req.body.DocId,req.body.Answer)
    return res.json(msg)
  }

 
  
  
  // async function  CreateTeam(obj){
  //     await dataHandling.Create("Category",obj)
  //   return true;
  // }
  
  module.exports={
      Create,
      Update,
      Delete,
      Read,
      Check
  }