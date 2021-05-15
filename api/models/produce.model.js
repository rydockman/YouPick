const mongoose = require('mongoose')

Schema = mongoose.Schema;

produceSchema = new Schema({
    farm_id: {type: Schema.Types.ObjectId, ref: 'Farm', required: true},
    name: {type: String, required: true},
    description: {type: String, required: true}
}, {collection: 'produce'})

produceModel = mongoose.model('Produce', produceSchema)

module.exports = produceModel