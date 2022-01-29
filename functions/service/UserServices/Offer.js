
const dataHandling = require("../../functions");



async function ReadCountry(req, res) {
  const data = await dataHandling.Read("Countries", req.body.DocId, req.body.index, req.body.Keyword, 1000, undefined);
  return res.json(data)
}

async function ReadOffers(req, res) {
  let claim;
  const arr = [];
  const data = await dataHandling.Read("Offers", req.body.DocId, req.body.index, req.body.Keyword, req.body.limit, ["CountryId", "==", req.body.CountryId, "Active", "==", true, "CouponsCount", ">", 0]);
  const Userdata = await dataHandling.Read("Users", req.body.UserId);

  data.forEach((Offer) => {
    claim = false;
    if (Offer.SaltCoins <= Userdata.SaltCoins) {
      claim = true;
    }
    arr.push({ ...Offer, ClaimStatus: claim })
  });

  return res.json(arr)
}


async function BuyOffer(req, res) {
  const functions = require('firebase-functions');
  const admin = require('firebase-admin');
  const db = admin.firestore();

  try {
    await db.runTransaction(async (t) => {
      const Userdata = await t.get(db.collection("Users").doc(req.body.UserId));
      const Coupon = await t.get(db.collection("Offers").doc(req.body.OfferId).collection("Coupons").limit(1));
      t.set(db.collection("Users").doc(req.body.UserId).collection("Rewards").doc(Coupon.docs[0].id), { ...Coupon.docs[0].data() })
      t.delete(db.collection("Offers").doc(req.body.OfferId).collection("Coupons").doc(Coupon.docs[0].id))
      t.update(db.collection("Users").doc(req.body.UserId), { SaltCoins: (Userdata.SaltCoins - req.body.OfferSaltCoins) });
    });
    return res.json(true);
  } catch (e) {
    functions.logger.error(e);
    return res.json(false);
  }


}




//   try {
//     const Userdata = await dataHandling.Read("Users", req.body.UserId);
//     console.log(Userdata.SaltCoins)
//     const Coupen =await db.collection("Offers").doc(req.body.OfferId).collection("Coupens").limit(1).get();
//     console.log(Coupen.docs[0].id)
// await db.collection("Users").doc(req.body.UserId).collection("Rewards").doc(Coupen.docs[0].id).set({...Coupen.docs[0].data()},{"merge":true})
// await dataHandling.Delete(`Offers/${req.body.OfferId}/Coupens`,Coupen.docs[0].id)
// return res.json(await dataHandling.Update("Users",{SaltCoins:(Userdata.SaltCoins-req.body.OfferSaltCoins)},req.body.UserId));
//    } catch (error) {
//      console.log(error)
//      return res.json(false)
//    }




module.exports = {
  ReadCountry,
  ReadOffers,
  BuyOffer
}