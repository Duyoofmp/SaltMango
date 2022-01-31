const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();
const common = require("../common");
const moment = require("moment-timezone")
const dataHandling = require("../functions");
const NotificationCreate = require('../service/Notification').Create;


exports.OnWinnersCreate = functions.firestore
  .document("Winners/{docid}")
  .onCreate(async (change, context) => {
    const docid = context.params.docid;
    const data=change.data()
    const NotificationObj = {
        "Text": `🎊Congratulations🎊  Your have won ${data.WonIn} Draw held on ${data.WinDate}. You Earned ${data.RewardCoins} salt coins 🥳`,
        "Image": "https://firebasestorage.googleapis.com/v0/b/salt-mango.appspot.com/o/1642614350829.png?alt=media",
    }
     return NotificationCreate(data.UserId, NotificationObj);
  });


