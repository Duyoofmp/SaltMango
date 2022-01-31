const admin = require('firebase-admin');
const ServiceAccount = require('./config/ServiceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(ServiceAccount)
});
const functions = require('firebase-functions');

//=========================Apis==============================

const Category = require('./api/Category');
exports.Category = functions.region("asia-south1").https.onRequest(Category.Category);

const Admin = require('./api/Admin');
exports.Admin = functions.region("asia-south1").https.onRequest(Admin.Admin);
exports.LoginForAdmin = functions.region("asia-south1").https.onRequest(Admin.LoginForAdmin);

const Questions = require('./api/Questions');
exports.Questions = functions.region("asia-south1").https.onRequest(Questions.Questions);

const Users = require('./api/Users');
exports.Users = functions.region("asia-south1").https.onRequest(Users.Users);

const Offers = require('./api/Offers');
exports.Offers = functions.region("asia-south1").https.onRequest(Offers.Offers);

const Coupons = require('./api/Coupons');
exports.Coupons = functions.region("asia-south1").https.onRequest(Coupons.Coupons);

const Country = require('./api/Country');
exports.Countries = functions.region("asia-south1").https.onRequest(Country.Countries);

const Profile = require('./api/UserApis/Profile');
exports.Profile = functions.region("asia-south1").https.onRequest(Profile.Profile);

const Home = require('./api/UserApis/Home');
exports.Home = functions.region("asia-south1").https.onRequest(Home.Home);


const Offer = require('./api/UserApis/Offer');
exports.Offer = functions.region("asia-south1").https.onRequest(Offer.Offer);



// // // //=========================Triggers==============================

const CategoryTriggers = require('./triggers/Category');
exports.OnCategoryCreate = CategoryTriggers.OnCategoryCreate;
exports.OnCategoryUpdate = CategoryTriggers.OnCategoryUpdate;

const QuestionsTriggers = require('./triggers/Questions');
exports.OnQuestionsCreate = QuestionsTriggers.OnQuestionsCreate;
exports.OnQuestionsUpdate = QuestionsTriggers.OnQuestionsUpdate;
exports.OnQuestionsDelete = QuestionsTriggers.OnQuestionsDelete;



const UsersTriggers = require('./triggers/Users');
exports.OnUsersCreate = UsersTriggers.OnUsersCreate;
exports.OnUsersUpdate = UsersTriggers.OnUsersUpdate;


const Users_ReferalTriggers = require('./triggers/Users_Referal');
exports.OnUsersReferralCreate = Users_ReferalTriggers.OnUsersReferralCreate;

const CountryTriggers = require('./triggers/Country');
exports.OnCountryCreate = CountryTriggers.OnCountryCreate;
exports.OnCountryUpdate = CountryTriggers.OnCountryUpdate;

const CouponTriggers = require('./triggers/Coupon');
exports.OnCouponCreate = CouponTriggers.OnCouponCreate;
exports.OnCouponUpdate = CouponTriggers.OnCouponUpdate;
exports.OnCouponDelete = CouponTriggers.OnCouponDelete;

const OfferTriggers = require('./triggers/Offers');
exports.OnOfferCreate = OfferTriggers.OnOfferCreate;
exports.OnOfferUpdate = OfferTriggers.OnOfferUpdate;


const WinnersTriggers = require('./triggers/Winners');
exports.OnWinnersCreate = WinnersTriggers.OnWinnersCreate;


const DailyDrawTriggers = require('./triggers/DailyDraw');
exports.OnEntryCreate = DailyDrawTriggers.OnEntryCreate;
exports.scheduledFunctionForDraws = DailyDrawTriggers.scheduledFunctionForDraws;
exports.OnWinnerAddOn = DailyDrawTriggers.OnWinnerAddOn;




//https://console.firebase.google.com/v1/r/project/salt-mango/firestore/indexes?create_composite=Cktwcm9qZWN0cy9zYWx0LW1hbmdvL2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy9DYXRlZ29yeS9pbmRleGVzL18QARoMCghLZXl3b3JkcxgBGgoKBkFjdGl2ZRABGg0KCUF2YWlsYWJsZRABGgkKBWluZGV4EAIaDAoIX19uYW1lX18QAg
//https://console.firebase.google.com/v1/r/project/salt-mango/firestore/indexes?create_composite=Cktwcm9qZWN0cy9zYWx0LW1hbmdvL2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy9DYXRlZ29yeS9pbmRleGVzL18QARoKCgZBY3RpdmUQARoNCglBdmFpbGFibGUQARoJCgVpbmRleBACGgwKCF9fbmFtZV9fEAI
//https://console.firebase.google.com/v1/r/project/salt-mango/firestore/indexes?create_composite=ClZwcm9qZWN0cy9zYWx0LW1hbmdvL2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy9RdWVzdGlvbnNBbmRBbnN3ZXJzL2luZGV4ZXMvXxABGg4KCkNhdGVnb3J5SWQQARoSCg5RdWVzdGlvbk51bWJlchABGgkKBWluZGV4EAIaDAoIX19uYW1lX18QAg
//https://console.firebase.google.com/v1/r/project/salt-mango/firestore/indexes?create_composite=ClNwcm9qZWN0cy9zYWx0LW1hbmdvL2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy9FbnRyeS9pbmRleGVzL0NJQ0FnTmpwZ1lJSxABGgYKAkFkEAEaCgoGVXNlcklkEAEaCQoFaW5kZXgQAhoMCghfX25hbWVfXxAC
//https://console.firebase.google.com/v1/r/project/salt-mango/firestore/indexes?create_composite=Ckhwcm9qZWN0cy9zYWx0LW1hbmdvL2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy9Vc2Vycy9pbmRleGVzL18QARoUChBEaXJlY3RSZWZlcnJhbElkEAEaCQoFaW5kZXgQAhoMCghfX25hbWVfXxAC
//https://console.firebase.google.com/v1/r/project/salt-mango/firestore/indexes?create_composite=Ckpwcm9qZWN0cy9zYWx0LW1hbmdvL2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy9XaW5uZXJzL2luZGV4ZXMvXxABGgsKB1dpbkRhdGUQARoJCgVXb25JbhABGgkKBWluZGV4EAIaDAoIX19uYW1lX18QAg
//https://console.firebase.google.com/v1/r/project/salt-mango/firestore/indexes?create_composite=Ckhwcm9qZWN0cy9zYWx0LW1hbmdvL2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy9EYWlseS9pbmRleGVzL18QARoTCg9XaW5uZXJzU2VsZWN0ZWQQARoJCgVpbmRleBACGgwKCF9fbmFtZV9fEAI
//https://console.firebase.google.com/v1/r/project/salt-mango/firestore/indexes?create_composite=Ckpwcm9qZWN0cy9zYWx0LW1hbmdvL2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy9Nb250aGx5L2luZGV4ZXMvXxABGhMKD1dpbm5lcnNTZWxlY3RlZBABGgkKBWluZGV4EAIaDAoIX19uYW1lX18QAg
//https://console.firebase.google.com/v1/r/project/salt-mango/firestore/indexes?create_composite=Cklwcm9qZWN0cy9zYWx0LW1hbmdvL2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy9XZWVrbHkvaW5kZXhlcy9fEAEaEwoPV2lubmVyc1NlbGVjdGVkEAEaCQoFaW5kZXgQAhoMCghfX25hbWVfXxAC

