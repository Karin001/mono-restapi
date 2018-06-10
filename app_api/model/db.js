const mongoose = require('mongoose');
const dbURI = 'mongodb://yukarin:414514614@ds153978.mlab.com:53978/yumlab';
mongoose.connect(dbURI, {useMongoClient:true});

mongoose.connection.on('connected', () => { 
    console.log(`Mongoose connected to ${dbURI}`); 
    }); 
    mongoose.connection.on('error', err => { 
    console.log('Mongoose connection error:', err); 
    }); 
    mongoose.connection.on('disconnected', () => { 
    console.log('Mongoose disconnected'); 
    });
const gracefulShutdown = (msg, callback) => {
    mongoose.connection.close( () => {
        console.log(`Mongoose disconnected through ${msg}`);
        callback();
    });
    };
process.once('SIGUSR2', () => {
    gracefulShutdown('nodemon restart', () => {
        process.kill(process.pid, 'SIGUSR2');
        });
    });   
process.on('SIGINT', () => {
    gracefulShutdown('app termination', () => {
        process.exit(0);
        });
    });
process.on('SIGTERM', () => {
    gracefulShutdown('Heroku app shutdown', () => {
        process.exit(0);
        });
    });
require('./itemlist');
require('./userid');
