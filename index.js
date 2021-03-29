// Modules required
require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

// Middleware
app.use(express.json())
morgan.token('req-body', (req) => {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))
app.use(cors())
app.use(express.static('build'))


// GET requests
app.get('/api/persons', (req, res) => {
    Person.find({})
        .then(people => {
            res.json(people)
        })
        .catch((err) => {
            res.status(500).json({
                error: err.message
            })
        })
})

app.get('/info', (req, res) => {
    Person.find({}).then(result => {
        console.log(result)
        const date = new Date()
        res.send(`Phonebook has info for ${result.length} people <br /><br /> ${date}`)
    })
   
   
    
})

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Person.findById(id).then(result => {
        res.json(result)
    })
        .catch(error => next(error))

})

// DELETE requests
app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Person.findByIdAndRemove(id)
        .then(() => {
            res.status(204)
        })
        .catch(error => next(error))
})

// POST requests
app.post('/api/persons', (req, res, next) => {

    const body = req.body

    const person =  new Person({
        name: body.name,
        number: body.number
    })

    person.save()
        .then(newPerson => {
            res.status(201).json(newPerson)
        })
        .catch(error => next(error))




})

// PUT requests
app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person
        .findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true, context: 'query'})
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
})



// Error Handling
const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
    console.error(err.message)

    if (err.name === 'CastError') {
        return res.status(400).send({
            error: 'malformatted id'
        })
    } else if (err.name === 'ValidationError') {
        res.status(400).json({
            error: err.message
        })
    }
    
    next(err)
}

app.use(errorHandler)




// Event listener
const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})