const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();
const common = require('../common')
const NotificationCreate = require('../service/Notification').Create;



exports.OnOfferCreate = functions.firestore
    .document("Offers/{docid}")
    .onCreate(async (change, context) => {
        const docid = context.params.docid;
        const data = change.data()
        const arr = [];
        common.createKeywords(data.OfferName, arr)
        return db.collection("Offers").doc(docid).update({ DocId: docid, Keywords: arr, CouponsCount: 0 })
    })


exports.OnOfferUpdate = functions.firestore
    .document("Offers/{docid}")
    .onUpdate(async (change, context) => {
        const docid = context.params.docid;
        const data = change.after.data()
        const arr = [];
        if(data.CouponsCount===0){
            await db.collection("Offers").doc(docid).update({Active:false})
        }
        common.createKeywords(data.OfferName, arr)
        return db.collection("Offers").doc(docid).update({ Keywords: arr })

    })

    exports.OnRewardsCreate = functions.firestore
    .document("Users/{UserId}/Rewards/{DocId}")
    .onCreate(async (change, context) => {
      const userid=context.params.UserId
      const data=change.data()
      const NotificationObj = {
          "Text": `🎊Congratulaions🎊 You achieved new reward of ${data.OfferName}🥳`,
          "Heading": "Reward Achieved",
          "Image":"https://firebasestorage.googleapis.com/v0/b/salt-mango.appspot.com/o/Assets%2Foffer.png?alt=media"
      }
       return NotificationCreate(userid, NotificationObj);
    });

