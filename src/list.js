require('dotenv').config()
const knex = require('knex')
const ItemsService = require ('./shopping-list-service')

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
})

console.log(ItemsService.getAllItems())