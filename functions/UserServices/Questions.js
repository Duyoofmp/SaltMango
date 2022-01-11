const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dataHandling=require("../functions");
const { Point } = require('../common');
const db = admin.firestore();

async function Read(req,res){
    let arr =[]
    if(req.body.Answer===undefined){
    const data=await dataHandling.Read("QuestionsAndAnswers",req,body.QuestionId,req.body.index,undefined,1);
    return res.json(data);
    }else{
        const data=await dataHandling.Read("QuestionsAndAnswers",req,body.DocId,req.body.index,undefined,1);
        const dat=await dataHandling.Read("QuestionsAndAnswers",req,body.QuestionId,req.body.index,undefined,1);
        User= db.collection("Users").doc(req.body.UserId);
        if(dat.Answer===req.body.Answer){
            user=User.get();
            let score= user.score+Point
            User.update({
                Score: score
            })
            query = await db.collection("QuestionsAndAnswers").doc(QuestionId).get()
            arr=query.options
            arr.push(query.Answer)
           await db.collection("QuestionsAndAnswers").doc(QuestionId).update({
               options : arr,
               Answer : FieldValue.delete()
           })
           const tmp = []
           tmp.push({...dat.data(),Answer : true,NextQuestion: data.data()})
           return res.json(tmp)
            }else{
                query = await db.collection("QuestionsAndAnswers").doc(QuestionId).get()
            arr=query.options
            arr.push(query.Answer)
           await db.collection("QuestionsAndAnswers").doc(QuestionId).update({
               options : arr,
               Answer : FieldValue.delete()
           })
           const tmp = []
           tmp.push({...dat.data(),Answer : false,NextQuestion: data.data()})
           return res.json(tmp)
           
        }


    }

    

}

module.exports={
    Read
}