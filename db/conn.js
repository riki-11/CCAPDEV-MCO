import {MongoClient} from 'mongodb';

const mongoURI = 'mongodb+srv://apdev:apdevdb123@cluster0.vjiwwp8.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(mongoURI);

export function connectToMongo (callback) {
    client.connect().then((err, client) => {
        if(err || !client) {
            // error during connection
            return callback(err);
        }
        return callback();
    }).catch(err => {
        callback(err);
    })
}

export function getDb(dbName = cluster0) {
    return client.db(dbName);
}

function signalHandler() {
    console.log("Closing MongoDB connection");
    client.close();
    process.exit();
}

process.on('SIGINT', signalHandler);
process.on('SIGTERM', signalHandler);
process.on('SIGQUIT', signalHandler);
