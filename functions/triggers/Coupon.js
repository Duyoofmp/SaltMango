const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();
const Counter = require("../distributed_counter");
const common = require('../common')



exports.OnCouponCreate = functions.firestore
    .document("Offers/{OfferId}/Coupons/{docid}")
    .onCreate(async (change, context) => {
        const docid = context.params.docid;
        const OfferId = context.params.OfferId;

        const data = change.data()
        const arr = [];
        common.createKeywords(data.Coupon, arr)
        const counterOperation = new Counter(db.collection("Offers").doc(OfferId), "CouponsCount")
      await counterOperation.incrementBy(1);
        return db.doc(`Offers/${OfferId}/Coupons/${docid}`).update({ DocId: docid, Keywords: arr });

    })


exports.OnCouponUpdate = functions.firestore
    .document("Offers/{OfferId}/Coupons/{docid}")
    .onUpdate(async (change, context) => {
        const docid = context.params.docid;
        const OfferId = context.params.OfferId;

        const data = change.after.data()
        const arr = [];
        common.createKeywords(data.Coupon, arr)
        return db.doc(`Offers/${OfferId}/Coupons/${docid}`).update({ DocId: docid, Keywords: arr });

    })

exports.OnCouponDelete = functions.firestore
    .document("Offers/{OfferId}/Coupons/{docid}")
    .onDelete(async (change, context) => {
        const docid = context.params.docid;
        const OfferId = context.params.OfferId;
        const counterOperation = new Counter(db.collection("Offers").doc(OfferId), "CouponsCount")
     return   await counterOperation.incrementBy(-1);
     

    })



