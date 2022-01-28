const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();
const common = require('../common')


exports.OnUsersCreate = functions.firestore
    .document("Users/{docid}")
    .onCreate(async (change, context) => {
        const docid = context.params.docid;
        const data = change.data()
        const arr = [];
        common.createKeywords(data.Name, arr)
        Keygenerator()
        async function Keygenerator() {
            let generator = '';
            let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyskiouhjnmbhj'

            for (let i = 0; i < 4; i++) {
                generator += characters.charAt(Math.floor(Math.random() * characters.length))
            }
            let array = generator;
            const code = await admin.firestore().collection("Users").where("MyCode", "==", array).limit(1).get();
            if (code.size === 0) {
                let ref = docid.substring(0, 3);
                let refcode = array + ref;
                await admin.firestore().collection("Users").doc(docid).update({
                    MyCode: refcode
                })
            }
            else {
                Keygenerator()
            }
        }

        const UserData = { DocId: docid, Keywords: arr, SaltCoin: 0, Diamonds: 0 };
        if (data.ReferralCode === "" || data.ReferralCode === null || data.ReferralCode === undefined) {
            return db.collection("Users").doc(docid).update(UserData)
        };


        // ReferralCode
        const CheckReferalUser = await db.collection("Users").where("ReferralCode", "==", data.ReferralCode).limit(1).get()
        if (CheckReferalUser.size === 0) return 0;
        const ReferalUser = CheckReferalUser.docs[0];
        // ReferalReward
        const ReferalReward = (await db.doc("Admin/Settings").get()).data().ReferalReward;

        await db.doc("Users/" + ReferalUser.id + "/Referal/" + docid).set({ "index": Date.now(), "UserId": docid, "Referal": ReferalUser.id, "Reward": ReferalReward })

        await db.collection("Users").doc(ReferalUser.id).update({ "SaltCoin": admin.firestore.FieldValue.increment(ReferalReward), "FriendsList": admin.firestore.FieldValue.arrayUnion(docid) })
        return db.collection("Users").doc(docid).update({ ...UserData, "FriendsList": admin.firestore.FieldValue.arrayUnion(ReferalUser.id) })


    })


exports.OnUsersUpdate = functions.firestore
    .document("Users/{docid}")
    .onUpdate(async (change, context) => {
        const docid = context.params.docid;
        const data = change.after.data();
        const prevData = change.after.data()
        const Date = moment().tz('Asia/Kolkata').subtract(30, "d").format("YYYY-MM-DD")
        const arr = [];
        common.createKeywords(data.Name, arr)
        const UserData = { Keywords: arr };
        if (!common.arrayEquals(data.FriendsList, prevData.FriendsList)) {
            const response = await db.collection("Winners").where("WinDate", ">=", Date).where("UserId", "==", docid).get()
            let batch = firebase.firestore().batch()
            response.docs.forEach((doc) => {
                const docRef = firebase.firestore().collection("Winners").doc(doc.id)
                batch.update(docRef, { FriendsList: data.FriendsList })
            })
            batch.commit().then(() => {
                console.log(`updated all documents inside winners`)
            })
        }
        if (data.ReferralCode === prevData.ReferralCode) {
            return db.collection("Users").doc(docid).update(UserData)
        };

        // ReferralCode
        const CheckReferalUser = await db.collection("Users").where("ReferralCode", "==", data.ReferralCode).limit(1).get()
        if (CheckReferalUser.size === 0) return 0;
        const ReferalUser = CheckReferalUser.docs[0];

        // ReferalReward
        const ReferalReward = (await db.doc("Admin/Settings").get()).data().ReferalReward;

        await db.doc("Users/" + ReferalUser.id + "/Referal/" + docid).set({ "index": Date.now(), "UserId": docid, "Referal": ReferalUser.id, "Reward": ReferalReward });

        await db.collection("Users").doc(ReferalUser.id).update({ "SaltCoin": admin.firestore.FieldValue.increment(ReferalReward), "FriendsList": admin.firestore.FieldValue.arrayUnion(docid) });
        return db.collection("Users").doc(docid).update({ ...UserData, "FriendsList": admin.firestore.FieldValue.arrayUnion(ReferalUser.id) });
    })