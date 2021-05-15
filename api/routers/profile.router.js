const router = require('express').Router()

const authCheck = (req, res, next) => {
     if(!req.user){
         res.redirect('http://localhost:3000/login')
     } else {
         next()
     }
}

router.get('/profile', authCheck, (req, res) => {
    res.send('Logged in. Profile page for ' + req.user.email)
})

module.exports = router