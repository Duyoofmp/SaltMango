const functions = require("firebase-functions");    
const admin = require('firebase-admin');
const db = admin.firestore();
const NotificationCreate = require('../service/Notification').Create;
const Counter = require("../distributed_counter");


exports.OnWinnersCreate = functions.firestore
  .document("Winners/{docid}")
  .onCreate(async (change, context) => {
    const docid = context.params.docid;
    const data=change.data()
    const counterOperation = new Counter(db.collection("Users").doc(data.UserId), "SaltCoin")
    await counterOperation.incrementBy(data.RewardCoins);
    const NotificationObj = {
        "Text": `🎊Congratulations🎊  You have won ${data.WonIn} Draw held on ${data.WinDate}. You Earned ${data.RewardCoins} salt coins 🥳`,
        "Heading": `${data.WonIn} Darw Winner`,
    }
     return NotificationCreate(data.UserId, NotificationObj);
  });


  