const m = require('mongoose')
const express = require('express')
const router = express.Router()
const createError = require('http-errors')
const { masterProduceModel } = require('../models/db')

router.get('/masterProduce', async (req, res, next) => {
    console.log('/GET masterProduce', req.query)
    try {
        const masterProduceList = await masterProduceModel.find({})
        return res.send(masterProduceList)
    } catch (err) {
        return next(err)
    }
})

module.exports = router