require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')

const POKEDEX = require('./pokedex.json')

const app = express()

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))
app.use(helmet())
app.use(cors())



app.use(function validateBearerToken(req, res, next) {

    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({error: 'Unauthorized request'})
    }
    next()
})

const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`]

function handleGetTypes(req, res) {
    res.json(validTypes)
}

app.get('/types', handleGetTypes)

function handleGetPokemon(req, res) {

    let response = POKEDEX.pokemon

    const { name, type } = req.query

    if (name) {
        response = response.filter(item => item.name.toLowerCase().includes(name.toLowerCase()))
    }

    if (type) {
        response = response.filter(item => item.type.includes(type))

    }

    res.json(response)
}

app.get('/pokemon', handleGetPokemon)

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})