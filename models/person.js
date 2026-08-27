const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

if (!url) {
  throw new Error('MONGODB_URI is not defined')
}

mongoose.set('strictQuery',false)
mongoose.connect(url, { family: 4 })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 5,
    required: true
  },
  number: String
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// const Person = mongoose.model('Person', personSchema, 'persons')
// const person = new Person({ name, number })

module.exports = mongoose.model('Person', personSchema)
