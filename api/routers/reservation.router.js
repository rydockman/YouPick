const m = require('mongoose')
const express = require('express')
const router = express.Router()
const { reservationModel } = require('../models/db')
const { eventModel } = require('../models/db')

//retrieve 
router.get('/reservation', async (req, res, next)=>{
    console.log('reservation /GET query', req.query)
    try {
        await reservationModel.find({ user_id: req.query.user_id }, (err, events) => {
            if (err) throw err
            if (events) res.send(events)
        }) 
    } catch (err) { 
        return next(err)
    }
})

//create
router.post('/reservation', async (req, res, next)=>{
    console.log('reservation /POST body', req.body)
    try {
        var reservation = new reservationModel({ user_id: req.body.user_id, event_id: req.body.event_id, num_people: req.body.num_people })
        var savedReservation = await reservation.save()
        var updateEventCount = await eventModel.findOneAndUpdate({_id: req.body.event_id}, { $inc: { attendance_count: req.body.num_people }})
        res.send(savedReservation)
    } catch (err) { 
        return next(err)
    }
})

//update existing
// router.put('/reservation', async (req, res, next)=>{
//     console.log('reservation /PUT body', req.body)
//     try {
//         var updateReservation = await reservationModel.findOneAndUpdate({ _id: req.body.reservationId }, 
//             { eventTime: req.body.eventTime }, 
//             { new: true }, 
//             (err, data) => { 
//                 if (err) throw err
//                 if (data) res.send(data)
//         })
//     } catch (err) { 
//         return next(err)
//     }
// })

// permanently delete/warehouse
router.delete('/reservation', async (req, res, next)=>{
    console.log('reservation /DELETE body', req.body)
    try {
        var deleteResult = await reservationModel.findOneAndDelete({ _id: req.body.reservation_id })
        const decrementCount = -deleteResult.num_people
        var updateEventCount = await eventModel.findOneAndUpdate({_id: deleteResult.event_id}, { $inc: { attendance_count: decrementCount }})
        res.send(deleteResult)
    } catch (err) { 
        return next(err)
    }
})

module.exports = router 