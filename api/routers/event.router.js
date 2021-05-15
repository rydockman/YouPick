const m = require('mongoose')
const express = require('express')
const createError = require('http-errors')
const router = express.Router()
const { eventModel } = require('../models/db')

//retrieve 
router.get('/event', async (req, res, next)=>{
    console.log('event /POST body: ', req.query)
    try {
        await eventModel.find({ farm_id: req.query.farm_id }, (err, events) => {
            if (err) throw err
            if (events) res.send(events)
        }) 
    } catch (err) { 
        console.log('Error at /event /GET', err)
        return next(err)
    }
})

//create
router.post('/event', async (req, res, next)=>{
    console.log('event /POST body: ', req.body)
    try {
        if (!req.body.farm_id || !req.body.event_time || !req.body.produce 
            || !req.body.name || !req.body.description || !req.body.max_people 
            || !req.body.max_people_per_group) throw createError.BadRequest()
        var event = new eventModel({    farm_id: req.body.farm_id, event_time: req.body.event_time, produce: req.body.produce, 
                                        name: req.body.name, description: req.body.description, max_people: req.body.max_people, 
                                        max_people_per_group: req.body.max_people_per_group })
        var savedEvent = await event.save() 
        res.send(savedEvent)
    } catch (err) { 
        console.log('Error at /event /POST', err)
        return next(err)
    }
})

//update existing
router.put('/event', async (req, res, next)=>{
    console.log('event /PUT body: ', req.body)
    try { 
        var updateEvent = await eventModel.findOneAndUpdate({ _id: req.body.event_id }, 
            { $set: req.body }, 
            { new: true }, 
            (err, data) => { 
                if (err) throw err
                if (data) return res.send(data)
        })
    } catch (err) { 
        console.error('Error at /event /PUT: ', err)
        return next(err)
    }
})

// permanently delete/warehouse
router.delete('/event', async (req, res, next)=>{
    console.log('event /DELETE body: ', req.body)
    try { 
        var deleteResult = await eventModel.findOneAndDelete({ _id: req.body.event_id }, (err, data) => {
            if (err) throw err
            if (data) res.send(data)
        })
    } catch (err) { 
        console.log('Error at /event /DELETE: ', err)
        return next(err)
    }
})

module.exports = router 