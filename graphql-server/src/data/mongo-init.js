import config  from '../config'
import mongoose from 'mongoose'

let connection = null

const init = () => {
    mongoose.set('debug', true)
    mongoose.connect('mongodb://testing:testing@ds157571.mlab.com:57571/testing')
    connection = mongoose.connection
    connection.on('error', () => {
        throw new Error('Error on connect data base')
    })
    .once('open', () => {
        console.log('Connected to database Success!')
    })
    return connection
}

export default {
    init: init,
    connection
}