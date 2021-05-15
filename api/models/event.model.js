const mongoose = require('mongoose')

Schema = mongoose.Schema;

eventSchema = new Schema({     
    farm_id: { type: Schema.Types.ObjectId, ref: 'Farm', required: true },
    event_time: { type: Date, required: true }, 
    max_people: { type: Number, required: true }, 
    max_people_per_group: { type: Number, required: true }, 
    attendance_count: { type: Number, required: true, default: 0 },
    name: {type: String, required: true},
    description: {type: String, required: true},
    produce: [
        { type: Schema.Types.ObjectId, ref: 'Produce' }
    ]
}, {collection: "events"})

eventModel = mongoose.model('Event', eventSchema)

module.exports = eventModel