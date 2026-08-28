const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

if (!url) {
  throw new Error('MONGODB_URI is not defined')
}

mongoose.set('strictQuery',false)
mongoose.connect(url, { family: 4 })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: value => /^\d{2,3}-\d+$/.test(value),
      message: 'Number must have a 2- or 3-digit prefix, a hyphen, and numeric digits'
    },
    required: true
  }
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
