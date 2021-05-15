const bcrypt = require("bcryptjs")
const User = require("../models/user.model")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const GoogleStrategy = require("passport-google-oauth20").Strategy

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    })
})

passport.use(new GoogleStrategy({
        clientID: "757738754102-og1cv6a480f7cravjie1oh0oa72qolvk.apps.googleusercontent.com",
        clientSecret: "Q208xNsszczchZv5-JMmihot",
        callbackURL: "http://localhost:8000/api/google/redirect"
    }, (accessToken, refreshToken, profile, done) => {
        User.findOne({email: profile.emails[0].value}).then((currentUser) => {
            if(currentUser){
                done(null, currentUser)
            } else {
                new User({
                    email: profile.emails[0].value,
                    password: null,
                    oauth_provider: 'Google',
                    oauth_id: profile.id
                }).save().then((newUser)=>{
                    console.log('new user created: ' + newUser)
                    done(null, newUser)
                })
            }
        })
        
    }
))

passport.use(
    new LocalStrategy({ usernameField: "email"}, (email, password, done) => {
        User.findOne({ email: email })
            .then(user => {
                if (!user) {
                    const newUser = new User({email,password})
                    newUser.oauth_provider = 'Local',
                    newUser.oauth_id = null,
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err
                            newUser.password = hash;
                            newUser
                                .save()
                                .then(user => {
                                    return done(null, user)
                                })
                                .catch(err => {
                                    return done(null, false, { message: err})
                                })
                        })
                    })
                } else {
                    if(user.oauth_provider == 'Local'){
                        bcrypt.compare(password, user.password, (err, isMatch) => {
                            if (err) throw err
                            if (isMatch) {
                                return done(null, user)
                            } else {
                                return done(null, false, { message: "Wrong password" });
                            }
                        })
                    } else {
                        return done(null, false, {message: `Account registered through ${user.oauth_provider}`})
                    }
                }
            })
            .catch(err => {
                return done(null, false, { message: err})
            })
    })
)

module.exports = passport