const mongoose = require('mongoose')

Schema = mongoose.Schema;

reservationSchema = new Schema({     
    user_id: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    event_id: {type: Schema.Types.ObjectId, ref: 'Event', required: true}, 
    num_people: { type: Number, required: true }
}, {collection: "reservations"})

reservationModel = mongoose.model('Reservation', reservationSchema)

module.exports = reservationModel