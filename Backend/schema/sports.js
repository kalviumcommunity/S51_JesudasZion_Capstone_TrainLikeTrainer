const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true
    }
});

const characteristicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    content: [contentSchema]
});

const positionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    characteristics: [characteristicSchema]
});

const sportSchema = new mongoose.Schema({
    _id: {
        $oid: {
            type: String,
            required: true
        }
    },
    name: {
        type: String,
        required: true
    },
    positions: [positionSchema]
});

const Sport = mongoose.model('sports_datas', sportSchema);

module.exports = Sport;
