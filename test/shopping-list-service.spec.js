const ItemsService = require('../src/shopping-list-service')
const knex = require('knex')

describe(`Items service object`, function() {
    let db 
    let testItems = [
        {
            name: 'Cheezypoofs',
            category: 'Snacks'
        },
        {
            name: 'Duff Beer',
            category: 'Main'
        },
        {
            name: 'Death Coffee',
            category: 'Breakfast'
        },
    ]
        before(() => {
            db = knex({
                client: 'pg',
                connection: process.env.TEST_DB_URL,
            })
        })

        before(() => {
            return db
                .into('shopping_list')
                .insert(testItems)
        })

        after(() => db.destroy())

    describe(`getAllItems()`, () => {
        it(`resolves all items from 'knex_practice' table`, () => {
            //test that ItemsService.getAllItems gets data from table
        })
    })
})