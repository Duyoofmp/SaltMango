const functions = require("firebase-functions");

const admin = require("firebase-admin");
const db = admin.firestore();

async function Create(collectionName, data, docName) {
    return new Promise(async (resolve, reject) => {
        try {
            if (docName !== undefined) {
                await db.collection(collectionName).doc(docName).set(data);
                resolve(true);
            } else {
                const done = await db.collection(collectionName).add(data);
                resolve(done.id);
            }
        } catch (error) {
            functions.logger.error(error);
            reject(false);
        }
    });
}

async function Update(collectionName, data, docName) {
    return new Promise(async (resolve, reject) => {
        try {
            await db.collection(collectionName).doc(docName).update(data);
            resolve(true);
        } catch (error) {
            functions.logger.error(error);
            reject(false);
        }
    });
}

async function Delete(collectionName, docName) {
    return new Promise(async (resolve, reject) => {
        try {
            await db.collection(collectionName).doc(docName).delete();
            resolve(true);
        } catch (error) {
            functions.logger.error(error);
            reject(false);
        }
    });
}

async function Read(collectionName, docName, index, Keyword, limit = 10, where) {

    let query;
    if (docName === undefined) {
        query = db.collection(collectionName)
        if (Keyword !== "" && Keyword !== undefined) {
            query = query.where("Keywords", "array-contains", Keyword.toLowerCase());
        }
        if (where !== undefined) {
            query = query.where(where[0], where[1], where[2])
        }
       
            query = query.orderBy("index","desc");
        
        if (index !== undefined && index!==null && index!==0 && index!=="") {
            console.log(index)
                const snapshot = await db.collection(collectionName).doc(index).get();
                query = query.startAfter(snapshot)
        }
    } else {
        query = db.collection(collectionName).doc(docName)

    }
    return new Promise(async (resolve, reject) => {
        try {
            if (docName !== undefined) {
                const dat = await query.get();
                resolve({ ...dat.data(), DocId: dat.id });
            } else {
                const temp = [];
                const data = await query.limit(limit).get();
                data.forEach((docs) => {
                    if (docs.exists) {
                        temp.push({ ...docs.data(), DocId: docs.id });
                    }
                });
                resolve(temp);
            }
        } catch (error) {
            functions.logger.error(error);
            reject(false);
        }
    });
}

async function Check(collectionName,docName,Answer){
    let query
    return new Promise(async(resolve, reject)=> {
        query = db.collection(collectionName).doc(docName)
        if(query.Answer==Answer){
            resolve(true);
        }
        else{
            resolve(false);
        }
    })
   

}




module.exports = {
    Create,
    Update,
    Delete,
    Read,
    Check
};
