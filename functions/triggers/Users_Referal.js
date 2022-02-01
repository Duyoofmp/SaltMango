const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();
const NotificationCreate = require('../service/Notification').Create;



exports.OnUsersReferralCreate = functions.firestore
    .document("Users/{UserId}/Referral/{DocId}")
    .onCreate(async (change, context) => {
        const DocId = context.params.DocId;
        const UserId = context.params.UserId;
        const data = change.data();

        const RUserData = (await db.doc(`Users/${data.UserId}`).get()).data();

        const NotificationObj = {
            "Text": `Your referral code was used by ${RUserData.Name}. You Earned ${data.Reward} salt coins`,
            "Image": "https://firebasestorage.googleapis.com/v0/b/salt-mango.appspot.com/o/1642614350829.png?alt=media",

        }

        return NotificationCreate(UserId, NotificationObj);
    })



