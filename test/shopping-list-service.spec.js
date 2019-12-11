const ItemsService = require('../src/shopping-list-service')
const knex = require('knex')

describe(`Items service object`, function() {
    let db 
    let testItems = [
        {
            product_id: 1,
            product_name: 'Cheezypoofs',
            product_price: '15.28',
            category: 'Snack',
            checked: true,
            date_added: new Date('2021-01-01T00:00:00.000Z')
        },
        {
            product_id: 5,
            product_name: 'Duff Beer',
            product_price: '10.28',
            category: 'Main',
            checked: false,
            date_added: new Date('2020-01-01T00:00:00.000Z')
        },
        {
            product_id: 3,
            product_name: 'Death Coffee',
            product_price: '18.28',
            category: 'Breakfast',
            checked: true,
            date_added: new Date('2019-01-01T00:00:00.000Z')
        },
    ]
        before(() => {
            db = knex({
                client: 'pg',
                connection: process.env.TEST_DB_URL,
            })
        })
        
        after(() => db.destroy())

        before(() => db('shopping_list').truncate())

        before(() => {
            return db
                .into('shopping_list')
                .insert(testItems)
        })


    describe(`getAllItems()`, () => {
        it(`resolves all items from 'knex_practice' table`, () => {
            //test that ItemsService.getAllItems gets data from table
            return ItemsService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql(testItems)
                })
        })
    })
})