const admin = require('firebase-admin');
const ServiceAccount = require('./config/serviceAccount.json')

admin.initializeApp({
  credential: admin.credential.cert(ServiceAccount)
});

//=========================Apis==============================

const Category = require('./api/Category');
exports.Category = Category.Category;

const Admin = require('./api/Admin')
exports.Admin = Admin.Admin
exports.LoginForAdmin = Admin.LoginForAdmin

const Questions = require('./api/Questions')
exports.Questions = Questions.Questions

const Users = require('./api/Users')
exports.Users = Users.Users

const Offers = require('./api/Offers')
exports.Offers = Offers.Offers

const Coupons = require('./api/Coupons')
exports.Coupons = Coupons.Coupons

const Country = require('./api/Country')
exports.Countries = Country.Countries

const Profile = require('./api/UserApis/Profile')
exports.Profile = Profile.Profile

const Home = require('./api/UserApis/Home')
exports.Home = Home.Home


const Offer = require('./api/UserApis/Offer')
exports.Offer = Offer.Offer



// // // //=========================Triggers==============================

const CategoryTriggers = require('./triggers/Category')
exports.OnCategoryCreate = CategoryTriggers.OnCategoryCreate
exports.OnCategoryUpdate = CategoryTriggers.OnCategoryUpdate

const QuestionsTriggers = require('./triggers/Questions')
exports.OnQuestionsCreate = QuestionsTriggers.OnQuestionsCreate
exports.OnQuestionsUpdate = QuestionsTriggers.OnQuestionsUpdate


const UsersTriggers = require('./triggers/Users')
exports.OnUsersCreate = UsersTriggers.OnUsersCreate
exports.OnUsersUpdate = UsersTriggers.OnUsersUpdate

const CountryTriggers = require('./triggers/Country')
exports.OnCountryCreate = CountryTriggers.OnCountryCreate
exports.OnCountryUpdate = CountryTriggers.OnCountryUpdate

const CouponTriggers = require('./triggers/Coupon')
exports.OnCouponCreate = CouponTriggers.OnCouponCreate
exports.OnCouponUpdate = CouponTriggers.OnCouponUpdate
exports.OnCouponDelete = CouponTriggers.OnCouponDelete

const OfferTriggers = require('./triggers/Offers')
exports.OnOfferCreate = OfferTriggers.OnOfferCreate
exports.OnOfferUpdate = OfferTriggers.OnOfferUpdate



const DailyDrawTriggers = require('./triggers/DailyDraw')
exports.OnDrawCreate = DailyDrawTriggers.OnDrawCreate
exports.OnEntryCreate = DailyDrawTriggers.OnEntryCreate
exports.scheduledFunctionForDraws = DailyDrawTriggers.scheduledFunctionForDraws


//https://console.firebase.google.com/v1/r/project/salt-mango/firestore/indexes?create_composite=Cktwcm9qZWN0cy9zYWx0LW1hbmdvL2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy9DYXRlZ29yeS9pbmRleGVzL18QARoMCghLZXl3b3JkcxgBGgoKBkFjdGl2ZRABGg0KCUF2YWlsYWJsZRABGgkKBWluZGV4EAIaDAoIX19uYW1lX18QAg
//https://console.firebase.google.com/v1/r/project/salt-mango/firestore/indexes?create_composite=Cktwcm9qZWN0cy9zYWx0LW1hbmdvL2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy9DYXRlZ29yeS9pbmRleGVzL18QARoKCgZBY3RpdmUQARoNCglBdmFpbGFibGUQARoJCgVpbmRleBACGgwKCF9fbmFtZV9fEAI
//https://console.firebase.google.com/v1/r/project/salt-mango/firestore/indexes?create_composite=ClZwcm9qZWN0cy9zYWx0LW1hbmdvL2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy9RdWVzdGlvbnNBbmRBbnN3ZXJzL2luZGV4ZXMvXxABGg4KCkNhdGVnb3J5SWQQARoSCg5RdWVzdGlvbk51bWJlchABGgkKBWluZGV4EAIaDAoIX19uYW1lX18QAg
//https://console.firebase.google.com/v1/r/project/salt-mango/firestore/indexes?create_composite=ClNwcm9qZWN0cy9zYWx0LW1hbmdvL2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy9FbnRyeS9pbmRleGVzL0NJQ0FnTmpwZ1lJSxABGgYKAkFkEAEaCgoGVXNlcklkEAEaCQoFaW5kZXgQAhoMCghfX25hbWVfXxAC