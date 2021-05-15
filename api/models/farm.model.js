const mongoose = require('mongoose')

Schema = mongoose.Schema;

farmSchema = new Schema({     
    name: {type: String, required: true},
    address: {type: String, required: true, unique: true},
    description: {type: String, required: true},
    is_organic: { type: Boolean, required: true },
    reservations: [
        {type: Schema.Types.ObjectId, ref: 'Reservation'}
    ],
    events: [
        {type: Schema.Types.ObjectId, ref: 'Event'}
    ],
    produce: [ 
        {type: Schema.Types.ObjectId, ref: 'Produce'}
    ]
}, {collection: "farms"})

farmModel = mongoose.model('Farm', farmSchema)

module.exports = farmModel