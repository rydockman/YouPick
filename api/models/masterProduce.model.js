const mongoose = require('mongoose')

Schema = mongoose.Schema;

masterProduceSchema = new Schema({
    name: {type: String, required: true},
    description: { type: String }
}, {collection: 'masterProduce'})

masterProduceModel = mongoose.model('MasterProduce', masterProduceSchema)

module.exports = masterProduceModel