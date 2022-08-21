const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    start_date:{
        type:Date,
        default:Date.now()
    }

});

const teamSchema = mongoose.Schema({
    country: {
        type:String,
        required:true
    },
    year:{
        type:Number,
        required:true
    },
    coordinates:{
        type:[Number],
        index:"2dsphere"
    },
    players : [playerSchema]

});

mongoose.model(process.env.DB_NAME_TEAM, teamSchema, process.env.DB_COLLECTION_NAME);