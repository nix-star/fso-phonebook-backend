require('dotenv').config()

//let persons = require('./persons-mock.js')
const morgan = require('morgan')
const express = require('express')

const app = express()

app.use(express.json())
app.use(express.static('dist'))
//app.use(morgan('tiny'))

const Person = require("./models/person")

morgan.token('body', (request) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.get('/info', (request, response) => {
  const date = new Date()
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(note => {
    response.json(note)
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(deletedPerson => {
      deletedPerson
        ? response.status(204).end()
        : response.status(404).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body
  const person = new Person({ name, number })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndUpdate(
    request.params.id,
    request.body,
    { new: true, runValidators: true }
  )
    .then(updatedPerson => {
      updatedPerson
        ? response.json(updatedPerson)
        : response.status(404).end()
    })
    .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
