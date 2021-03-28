const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2];

const url = `mongodb+srv://testing:${password}@cluster0.nrqsm.mongodb.net/persons-app?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 4) {

    Person
    .find({})
    .then(res => {
        console.log('phonebook:')
        res.forEach(person => {
            let name = person.name
            let number = person.number
            console.log(name, number)
        })

        mongoose.connection.close();
    })
} else {

const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
})

person
    .save()
    .then(res => {
        console.log(`added ${res.name} number ${res.number}`)
        mongoose.connection.close();
    })

}

