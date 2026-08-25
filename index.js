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

app.get('/info', (request, response) => {
  const date = new Date()
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(note => {
    response.json(note)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(deletedPerson => {
      deletedPerson
        ? response.status(204).end()
        : response.status(404).end()
    })
    .catch(error => {
      response.status(400).json({ error: 'malformatted id' })
    })
})

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body
  const person = new Person({ name, number })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
