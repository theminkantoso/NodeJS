const MongoClient = require('mongodb').MongoClient;
//MongoClient: connect to the mongoDB server

const assert = require('assert');

const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion'; //created conFusion db

MongoClient.connect(url, (err, client) => {

    assert.equal(err, null); //1st check: check error not null
    console.log('Connected correctly to server');

    const db = client.db(dbname); //connect to db
    const collection = db.collection('dishes');

    collection.insertOne({"name": "Uthapizza", "description": "test"}, (err, result) => {
        assert.equal(err, null);
        console.log('After Insert:\n');
        console.log(result.ops); //how many succesful operation have been done
        collection.find({}).toArray((err, docs) => {
            //print all documents 
            assert.equal(err, null);
            console.log('Found:\n');
            console.log(docs); //print all documents that match the criteria

            db.dropCollection('dishes', (err, result) => {
                //clean up the database
                assert.equal(err, null);
                client.close(); //close the connection to the database
            });
        });
    });
});
//1st do the insert operation
//then we do the 2nd operation in the callback function
//2nd call is enclose in the 1st operation => nesting => ensure completion of the 1st one