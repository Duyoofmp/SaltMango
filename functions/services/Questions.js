const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dataHandling=require("../functions");

function Create(req,res){
    req.body.index=Date.now()
       dataHandling.Create("QuestionsAndAnswers",req.body)
     return res.json(true)
  }
  function  Update(req,res){
    req.body.index=Date.now()
    dataHandling.Update("QuestionsAndAnswers",req.body,req.body.DocId)
  return res.json(true)
  }
  function Delete(req,res){ 
    dataHandling.Delete("QuestionsAndAnswers",req.body.DocId)
    return res.json(true)
  }
  
  async function Read(req,res){
    const data=await dataHandling.Read("QuestionsAndAnswers",req.body.DocId,req.body.index,req.body.Keyword);
    return res.json(data)
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