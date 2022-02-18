const functions = require('firebase-functions');
const axios = require('axios');



exports.ColdStart = functions.region("asia-south1").runWith({ "memory": "128MB" }).pubsub.schedule('every 1 minutes').onRun(async (context) => {
  console.log('This will be run every 1 minutes!');

  try {
    callAPIs(1);

    await delay(12000);
    callAPIs(2);

    await delay(12000);
    callAPIs(3);

    await delay(12000);
    callAPIs(4);

    await delay(12000);
    return callAPIs(5);

    // await delay(6000);
    // callAPIs(6);

    // await delay(6000);
    // callAPIs(7);

    // await delay(6000);
    // callAPIs(8);

    // await delay(6000);
    // return callAPIs(9);
  }
  catch (error) {
    functions.logger.error(error);
  }

});

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

function callAPIs(num) {

  return axios.all([
    axios.post("https://asia-south1-salt-mango.cloudfunctions.net/Users/ReadUsers", { blahblah: "blahblah" }),
    axios.post("https://asia-south1-salt-mango.cloudfunctions.net/Questions/ReadQuestions", { blahblah: "blahblah" }),
    axios.post("https://asia-south1-salt-mango.cloudfunctions.net/Offers/ReadOffers", { blahblah: "blahblah" }),
    axios.post("https://asia-south1-salt-mango.cloudfunctions.net/Coupons/ReadCoupon", { blahblah: "blahblah" }),
    axios.post("https://asia-south1-salt-mango.cloudfunctions.net/Countries/ReadCountry", { blahblah: "blahblah" }),
    axios.post("https://asia-south1-salt-mango.cloudfunctions.net/Category/ReadCategory", { blahblah: "blahblah" }),
    axios.post("https://asia-south1-salt-mango.cloudfunctions.net/Banners/ReadBanner", { blahblah: "blahblah" }),
    axios.post("https://asia-south1-salt-mango.cloudfunctions.net/Admin/ReadSettings", { blahblah: "blahblah" }),
    axios.post("https://asia-south1-salt-mango.cloudfunctions.net/Profile/ReadProfile", { blahblah: "blahblah" }),
    axios.post("https://asia-south1-salt-mango.cloudfunctions.net/Home/ReadCategories ", { blahblah: "blahblah" }),
    axios.post("https://asia-south1-salt-mango.cloudfunctions.net/Offer/ReadOffers ", { blahblah: "blahblah" }),


    

  ]).then(responseArry => {

    if (num === 5) {
      functions.logger.log("Finished = " + num)
      return functions.logger.log("All API's Finished");
    }
    return functions.logger.log("Finished = " + num)
  }).catch(error => {
    return functions.logger.error({ ...error.response, num });
  });


}

















// Your spend-based committed use discount is applied to the eligible usage each hour.

// If you use more in the hour than you committed to, the overage is charged at your regular on-demand rate. If you use less in the hour than you committed to, you do not fully utilize your commitment or realize your full discount.
// Google Cloud Support, Pauline6:52 PM
// Here is how you can access the dashboard: https://cloud.google.com/billing/docs/how-to/cud-analysis-spend-based#accessing_dashboard_or_analysis
// Google Cloud Support, Pauline6:53 PM
// Then here is how you can analyze the report: https://cloud.google.com/billing/docs/how-to/cud-analysis-spend-based#understanding_analysis for th utilization and coverage: https://cloud.google.com/billing/docs/how-to/cud-analysis-spend-based#understanding_analysis

// and here is an example of how you were charged: https://cloud.google.com/billing/docs/how-to/cud-analysis-spend-based#understanding_cud_bill