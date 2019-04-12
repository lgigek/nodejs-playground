const mongoose = require('mongoose');

function connect() {
    let connection_string = `${process.env.MONGO_CONNECTION}/${process.env.MONGO_DATABASE}`;

    mongoose.connect(connection_string, {
        useNewUrlParser: true,
        useCreateIndex: true
    })
        .then(() => {
            console.log('Successfully connected to database');

            // see: https://github.com/Automattic/mongoose/issues/6880
            mongoose.set('useFindAndModify', false);
        })
        .catch(err => console.log(`It was not possible to connect to database. Error: ${err.message}`))
}

module.exports.connect = connect;