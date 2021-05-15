const m = require('mongoose')
const express = require('express')
const router = express.Router()
const createError = require('http-errors')
const { produceModel } = require('../models/db')

//retrieve 
router.get('/produce', async (req, res, next)=>{
    console.log('farm id', req.query.farm_id)
    try { 
    if (!req.query.farm_id) throw createError.BadRequest()
    await produceModel.find({ farm_id: req.query.farm_id }, (err, prod) => {
        if (err) throw err
        if (prod) res.send(prod)
    })
    } catch (err) {
        return next(err)
    }
})

//create
router.post('/produce', async (req, res, next)=>{
    console.log(req.body)
    try { 
        const { name, description, farm_id } = req.body
        if (!name || !description || !farm_id) throw createError.BadRequest()
        var newFarm = new produceModel({ farm_id: farm_id, name: name, description: description})
        await newFarm.save((err, data)=>{ 
            if (err) throw err
            if (data) res.send(data._id)
        })
    } catch (error) {
        return next(error)
    }
})

//update existing
router.put('/produce', async (req, res, next)=>{
    try {
        if (!req.body.produce_id) throw createError.BadRequest()

        var updateProduce = await produceModel.findOneAndUpdate({ _id: req.body.produce_id }, { $set: req.body }, { new: true }, (err, prod) =>{
            if (err) throw err
            if (prod) return res.send(prod)
        })
    } catch (err) {
        return next(err)
    }
})

// permanently delete/warehouse
router.delete('/produce', async (req, res, next)=>{
    try {
        if (!req.body.produce_id) throw createError.BadRequest()
        produceModel.findByIdAndDelete(req.body.produce_id, (err, data)=>{
            if (err) throw err
            if (data) res.send(data)
          })
    } catch (error) { 
        return next(error)
    }
})

module.exports = router