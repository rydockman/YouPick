const { ObjectID } = require('mongodb')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

Schema = mongoose.Schema

thirdPartyProviderSchema = new mongoose.Schema({
    provider_name: {
        type: String,
        default: null
    },
    provider_id: {
        type: String,
        default: null
    }
})

userSchema = new Schema({
    email: {type: String, required: true, lowercase: true, unique: true},
    password: {type: String, required: false},
    f_name: {type: String, required: false, default: null},
    l_name: {type: String, required: false, default: null},
    is_farmer: {type: Boolean, required: false, default: null},
    date: {
        type: Date,
        default: Date.now
    },
    oauth_provider: {type: String, required: true},
    oauth_id: {type: String, required: false},
    farm: {type: Schema.Types.ObjectId, ref: 'Farm', required: false, default: null},
    reservations: [
        {type: Schema.Types.ObjectId, ref: 'Reservation', required: false, default: null}
    ],
    },
    {strict: false}
)

//Cannot use arrow function or else 'this' keyword will not work
/*userSchema.pre('save', async function (next){
    try {
        if(this.password){
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(this.password, salt)
            this.password = hashedPassword
            next()
        } else {
            next()
        }
    } catch (error) {
        next(error)
    }
})

userSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw error
    }
}*/

userModel = mongoose.model('User', userSchema)

module.exports = userModel