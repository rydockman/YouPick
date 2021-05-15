const express = require('express')
const app = express.Router()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(require('./routers/test.router.js'))
app.use(require('./routers/farm.router.js'))
app.use(require('./routers/user.router.js'))
app.use(require('./routers/produce.router.js'))
app.use(require('./routers/reservation.router.js'))
app.use(require('./routers/auth.router.js'))
app.use(require('./routers/profile.router.js'))
app.use(require('./routers/event.router.js'))
app.use(require('./routers/masterProduce.router.js'))

module.exports = app 

  
  