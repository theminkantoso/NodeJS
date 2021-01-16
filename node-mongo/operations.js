const assert = require('assert');

exports.insertDocument = (db, document, collection, callback) => {
    const coll = db.collection(collection); //look for collection
    // coll.insert(document, (err, result) => {
    //     assert.equal(err, null); //if an error occur then print and exit
    //     console.log("Inserted " + result.result.n 
    //         + " documents into the collection " + collection);
    //         //result.n: number of results
    //     callback(result); //implement in the index.js file
    // });
    return coll.insert(document);
};

exports.findDocuments = (db, collection, callback) => {
    //find all documents
    const coll = db.collection(collection);
    // coll.find({}).toArray((err, docs) => {
    //     assert.equal(err, null);
    //     callback(docs);
    // });
    return coll.find({}).toArray();
};

exports.removeDocument = (db, document, collection, callback) => {
    //callback when operations complete
    const coll = db.collection(collection);
    // coll.deleteOne(document, (err, result) => {
    //     assert.equal(err, null);
    //     console.log("Removed the document ", document);
    //     callback(result);
    // });
    return coll.deleteOne(document);
};

exports.updateDocument = (db, document, update, collection, callback) => {
    const coll = db.collection(collection);
    // coll.updateOne(document, { $set: update }, null, (err, result) => {
    //     assert.equal(err, null);
    //     console.log("Updated the document with ", update);
    //     callback(result);
    // });
    return coll.updateOne(document, {$set: update}, null);
};