const mongoose = require('mongoose')

Schema = mongoose.Schema;

testSchema = new Schema({
    test_string: String
})
testModel = mongoose.model('TestModel', testSchema)

module.exports = testModel