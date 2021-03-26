// Modules required
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors')

// Middleware
app.use(express.json())
morgan.token('req-body', (req, res) => {
    return JSON.stringify(req.body);
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))
app.use(cors())
app.use(express.static('build'))

// Hardcoded data
let persons =
    [
        { 
          "name": "Arto Hellas", 
          "number": "040-123456",
          "id": 1
        },
        { 
          "name": "Ada Lovelace", 
          "number": "39-44-5323523",
          "id": 2
        },
        { 
          "name": "Dan Abramov", 
          "number": "12-43-234345",
          "id": 3
        },
        { 
          "name": "Mary Poppendieck", 
          "number": "39-23-6423122",
          "id": 4
        },
        { 
          "name": "Delete Me", 
          "number": "123456789",
          "id": 7
        }
];


// GET requests
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const total = persons.length;
    const date = new Date();

    res.send(`Phonebook has info for ${total} people <br /><br /> ${date}`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }

})

// DELETE requests
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id)

    if (person) {
        persons = persons.filter(person => person.id !== id)
        res.status(204).end()
    } else {
        res.status(404).end()
    }
})

// POST requests
app.post('/api/persons', (req, res) => {
    const body = req.body;
    const generateId = () => {
        return Math.floor(Math.random() * 1001)
    }

    if(!body.name || !body.number) {
        res.status(400).json({
            error: 'name and number are both required'
        })
    } else {
        const check = persons.find(person => person.name === body.name)
        if (check) {
            res.status(409).json({
                error: 'Name already exists. Name must be unique'
            })
        } else {
            const person = {
                name: body.name,
                number: body.number,
                id: generateId()
            }

            persons = persons.concat(person)

            res.status(201).json(person)
        }

    }
})






// Event listener
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})