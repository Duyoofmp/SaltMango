const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dataHandling = require("../../functions");
const { Point } = require('../../common');
const common = require('../../common');
const db = admin.firestore();



function randomNo(no){
    return Math.floor((Math.random() * no) + 1);
 }


async function Read(req,res){
    let checkAnswer=false
    let arr;
    let data;
    let size=0;
    all={"message":"No Questions!"}
    const catData=await dataHandling.Read("Category",req.body.CategoryId);
    if(req.body.Answer===undefined){   
        if(catData.NoOfQuestions!==0) {
        while (size===0) {
            const qstn=randomNo(catData.NoOfQuestions)
            console.log(qstn)
           data=await db.collection("QuestionsAndAnswers").where("CategoryName","==",catData.CategoryName).where("QuestionNumber","==",qstn).limit(1).get();
           console.log(data.size) 
          console.log(data.docs[0].data())
        size=data.size 
        };  
   arr= data.docs[0].data().Options
    arr.push(data.docs[0].data().Answer);
    console.log(arr)
     arr=common.shuffleArray(arr);
     data.docs[0].data().Options=arr
     all=data.docs[0].data()
    }
    
    return res.json({...all,Options:arr,Answer:""});
        
    }else{
        if(catData.NoOfQuestions!==0) {
        while (size===0) {
           data=await db.collection("QuestionsAndAnswers").where("CategoryName","==",catData.CategoryName).where("QuestionNumber","==",randomNo(catData.NoOfQuestions)).limit(1).get()
        size=data.size 
        };
        const dat=await dataHandling.Read("QuestionsAndAnswers",req.body.QuestionId);
        User= db.collection("Users").doc(req.body.UserId);
            user=await User.get();
            let Diamond= (user.data().Diamond) +Point;
           await  User.update({Diamond: Diamond});
             arr= data.docs[0].data().Options
            arr.push(data.docs[0].data().Answer);
            arr=common.shuffleArray(arr);
            data.docs[0].data().Options=arr;

           if(dat.Answer===req.body.Answer){
              checkAnswer=true
           }
     all=data.docs[0].data()
        }
           return res.json({...all,Options:arr,Answer:"",CheckAnswer : checkAnswer})
    
}
}

module.exports = {
    Read
}