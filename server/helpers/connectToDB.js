const mongoose = require('mongoose');

const { DATABASE_CONNECTION_STRING, DATABASE_NAME } = process.env;

function connectToDB() {
    return mongoose
        .connect(DATABASE_CONNECTION_STRING, {
            dbName: DATABASE_NAME,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
}

module.exports = connectToDB;