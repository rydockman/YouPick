const express = require('express')
const router = express.Router()
const { userModel } = require('../models/db')
const createError = require('http-errors')
const { authSchema } = require('../helpers/validation_schema')
const { signAccessToken } = require('../helpers/jwt_helper')

/*router.post('/login', async (req, res, next) => {
    try{
      const result = await authSchema.validateAsync(req.body)
      const user = await userModel.findOne({email: result.email})
      if (!user) throw createError.NotFound("User not registered")
      
      const isMatch = await user.isValidPassword(result.password)
      if (!isMatch) throw createError.Unauthorized('Username/password not valid')

      const accessToken = await signAccessToken(user.id)
      res.send({ accessToken })
    } catch (error) {
      if(error.isJoi === true) 
        return next(createError.BadRequest("Invalid Username/Password"))
      next(error)
    }
  });
  
router.post('/register', async (req, res, next) => {
  try{
    const { email, password } = req.body;
    // if(!email || !password) throw createError.BadRequest()
    const result = await authSchema.validateAsync(req.body)

    const doesExist = await userModel.findOne({email: result.email})
    if (doesExist) 
      throw createError.Conflict(`${result.email} is already in use.`)

    const user = new userModel({email: email, password: password})
    const savedUser = await user.save()
    const accessToken = await signAccessToken(savedUser.id)
    res.send({accessToken})
     
  } catch (error) {
    if(error.isJoi === true) error.status = 422
    next(error)
  }
})
*/

//get user info 
router.get('/userinfo', async (req, res, next)=>{
  console.log('user id', req.query.user_id)
  try { 
  if (!req.query.user_id) throw createError.BadRequest()
  await userModel.findById(req.query.user_id, (err, data)=>{
      if (err) throw err
      if (data) res.send(data)
  })
  } catch (err) {
      return next(err)
  }
})

module.exports = router
