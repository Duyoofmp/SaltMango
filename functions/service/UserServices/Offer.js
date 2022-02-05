
const dataHandling = require("../../functions");



async function ReadCountry(req, res) {
  const data = await dataHandling.Read("Countries", req.body.DocId, req.body.index, req.body.Keyword, 1000, undefined);
  return res.json(data)
}

async function ReadOffers(req, res) {
  const arr = [];
  if (req.body.CountryId === undefined) {
    const RewardDat = await dataHandling.Read(`Users/${req.body.UserId}/Rewards`, req.body.DocId, req.body.Index, req.body.Keyword);
    return res.json(RewardDat);
  }
  if (req.body.CountryId === "") {
    const IndiaData = await dataHandling.Read("Countries", "", "", "", 1, ["CountryName", "==", "India"], [false]);
    req.body.CountryId = IndiaData[0].DocId;
  }

  const data = await dataHandling.Read("Offers", req.body.DocId, req.body.Index, req.body.Keyword, 10, ["CountryId", "==", req.body.CountryId, "Active", "==", true, "CouponsCount", ">", 0], [false]);
  const Userdata = (await dataHandling.Read("Users", req.body.UserId)) || { SaltCoin: 0 };

  data.forEach((Offer) => {
    arr.push({ ...Offer, ClaimStatus: Offer.SaltCoin >= Userdata.SaltCoin })
  });

  return res.json(arr)
}


async function BuyOffer(req, res) {
  const functions = require('firebase-functions');
  const admin = require('firebase-admin');
  const db = admin.firestore();
  try {
    const OfferData = await db.collection("Offers").doc(req.body.CountryId).get();
    const Userdata = await db.collection("Users").doc(req.body.UserId).get();
    if (Userdata.data().SaltCoin < OfferData.data().SaltCoin) {
      return res.status(403).json("Cannont Access this api");
    }

    await db.runTransaction(async (t) => {
      const Coupon = await t.get(db.collection("Offers").doc(req.body.CountryId).collection("Coupons").limit(1));

      t.set(db.collection("Users").doc(req.body.UserId).collection("Rewards").doc(Coupon.docs[0].id), { ...Coupon.docs[0].data(), ...OfferData.data() })
      t.delete(db.collection("Offers").doc(req.body.CountryId).collection("Coupons").doc(Coupon.docs[0].id))
      t.update(db.collection("Users").doc(req.body.UserId), { SaltCoin: Number(Userdata.data().SaltCoin) - Number(OfferData.data().SaltCoin) });
    });
    return res.json(true);
  } catch (e) {
    functions.logger.error(e);
    return res.json(false);
  }
}

async function ReadReward(req, res) {
  const RewardDat = await dataHandling.Read(`Users/${req.body.UserId}/Rewards`, req.body.DocId, req.body.index, req.body.Keyword);
  return res.json(RewardDat)
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
  BuyOffer,
  ReadReward
}