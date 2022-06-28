import mongoose from 'mongoose';
import {mongoConnectionString} from '../config';

export default () => {
    mongoose.connect(mongoConnectionString, {  })
        .then(() => {
            return console.info(`Successfully connected to ${mongoConnectionString}`);
        })
        .catch(error => {
            console.error('Error connecting to database: ', error);
            return process.exit(1);
        });
};
