const express = require('express')
const router = express.Router()
const { testModel } = require('../models/db')
const { verifyAccessToken } = require ('../helpers/jwt_helper')

router.get('/hello', verifyAccessToken, (req, res) => {
    res.send({ express: 'hello'})
  });
  
router.post('/world', (req, res) => {
  console.log(req.body);
  test_instance = new testModel({test_string: req.body.post})
  test_instance.save(err => {
      if (err) console.log(err);
    })
  res.send(
    `POST received. Contents: ${req.body.post}`
  )
})

module.exports = router

