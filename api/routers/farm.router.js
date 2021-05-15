const m = require('mongoose')
const express = require('express')
const router = express.Router()
const createError = require('http-errors')
const { testModel, farmModel } = require('../models/db')

router.get('/farm', async (req, res, next) => {
    try {
      if (!req.query.farm_id) throw createError.BadRequest()
      await farmModel.find({_id: req.query.farm_id}, function(err, data) {
        if (err) throw err
        if(data) res.send(data)
      })
    } catch (error) { 
      return next(error)
    }
  });
  
router.post('/farm', async (req, res, next) => {
  // console.log(req.body);
  try { 
    if (!req.body.name || !req.body.description || !req.body.address || !req.body.is_organic) throw createError.BadRequest()
    test_instance = new farmModel({ name: req.body.name, description: req.body.description, address: req.body.address, is_organic: req.body.is_organic })
    savedFarm = await test_instance.save()
    return res.send(savedFarm._id)
  } catch (error) { 
    return next(error)
  }
})

router.put('/farm', async (req, res, next) => {
  try {
    if (!req.body.farm_id) throw createError.badRequest()
    farmModel.findOneAndUpdate({ _id: req.body.farm_id }, { $set: req.body }, { new: true }, (err, farm) =>{
      if (err) throw err
      if (farm) return res.send(farm)
    })
  } catch (error) {
    return next(error)
  }
})

router.put('/farmAddProduce', async (req, res, next) => {
  console.log(req.body)
  try {
    if (!req.body.farm_id) throw createError.badRequest()
    farmModel.updateOne({ _id: req.body.farm_id }, { $addToSet: {produce: req.body.produce} }, (err, farm) =>{
      if (err) throw err
      if (farm) return res.send(farm)
    })
  } catch (error) {
    return next(error)
  }
})

router.delete('/farm', (req, res, next)=>{
  console.log('farm?', req.body.farm_id)
  try {
    if (!req.body.farm_id) throw createError.BadRequest()
    farmModel.findByIdAndDelete(req.body.farm_id, (err, data)=>{
      if (err) throw err
      if (data) res.send(data)
    })
  } catch (error) { 
    return next(error)
  }
})

module.exports = router

