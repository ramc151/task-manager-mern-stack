const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/comcrud2')
    .then(() => console.log('db conn'))
    .catch((err) => console.log('db err', err))

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('User', schema)