const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dataHandling=require("../functions");
const db = admin.firestore();
//const { database } = require('firebase-functions/v1/firestore');


async function Create(req,res){
    req.body.index=Date.now()
    const temp=[]
  
      query =await db.collection("QuestionsAndAnswers").get()
      let size = query.size
      req.body.Questions.forEach(element => {
        element.QuestionNumber=size+1
         temp.push(dataHandling.Create("QuestionsAndAnswers",element))
      });
      await Promise.all(temp)
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
      const data=await dataHandling.Read("QuestionsAndAnswers",req.body.DocId,req.body.index,req.body.Keyword,req.body.limit,["CategoryName","==",req.body.CategoryName]);
      // (data.Options).push(data.Answer);
      // delete data.Answer
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