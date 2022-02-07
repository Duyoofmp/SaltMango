const functions = require("firebase-functions");    
const admin = require('firebase-admin');
const db = admin.firestore();
const NotificationCreate = require('../service/Notification').Create;
const Counter = require("../distributed_counter");
const dataHandling=require("../functions")

exports.OnWinnersCreate = functions.firestore
  .document("Winners/{docid}")
  .onCreate(async (change, context) => {
    const docid = context.params.docid;
    const data=change.data()
    let NotificationObj;
    const counterOperation = new Counter(db.collection("Users").doc(data.UserId), "SaltCoin")
    await counterOperation.incrementBy(data.RewardCoins);
    if(data.ReferralWin===""){
     NotificationObj = {
        "Text": `🎊Congratulations🎊 You have won the ${data.WonIn}Draw and earned ${data.RewardCoins} salt coins!🥳`,
        "Heading": `${data.WonIn} Darw Winner`,
        "Image":"https://firebasestorage.googleapis.com/v0/b/salt-mango.appspot.com/o/Assets%2Fsalt.png?alt=media"
    }
    if(data.ReferralCode!==undefined || data.ReferralCode!==""){
      const checkentry=await db.collection(data.WonIn).doc(data.WinDate).collection("Entry").where("UserId","==",data.DirectReferralId).get()
      if(checkentry.size===0){
        NotificationCreate(data.DirectReferralId, {
          "Text": `Your Friend ${data.Username} won ${data.WonIn} Draw..but you missed 50% from the reward...bcz you not entered in slot on ${data.WinDate} `,
          "Heading": `:( You Missed Direct Referral Reward Of ${data.WonIn}Draw`,
          "Image":"https://firebasestorage.googleapis.com/v0/b/salt-mango.appspot.com/o/Assets%2Fref.png?alt=media"
      })
      }else{
        const refData=await dataHandling.Read("Users",data.DirectReferralId)
        await dataHandling.Create("Winners",{ ...refData,index: Date.now(), WonIn: data.WonIn, UserId: data.DirectReferralId, WinDate: data.WinDate,ReferralWin:data.Username ,RewardCoins:data.RewardCoins*0.5})
      }
    }
  }else{
    NotificationObj = {
      "Text": ` 🎊 Congratulations 🎊! Your direct referral, ${data.Username} has won the Daily Draw held on ${data.WinDate}. You have received ${data.RewardCoins} salt coins.🥳`,
      "Heading": `Reward For Direct Referral`,
      "Image":"https://firebasestorage.googleapis.com/v0/b/salt-mango.appspot.com/o/Assets%2Fsalt.png?alt=media"
  }

  }
  return NotificationCreate(data.UserId, NotificationObj);

  });


  