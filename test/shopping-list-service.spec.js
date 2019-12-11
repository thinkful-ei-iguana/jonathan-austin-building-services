const ItemsService = require('../src/shopping-list-service')
const knex = require('knex')

describe(`Items service object`, function() {
    let db 
    let testItems = [
        {
            product_id: 4,
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
        
        before(() => db('shopping_list').truncate())

        afterEach(() => db('shopping_list').truncate())

        after(() => db.destroy())


    context(`Given 'shopping_list' has data`, () => {
        beforeEach(() => {
            return db
            .into('shopping_list')
            .insert(testItems)
        })

        it(`getAllItems() resolves all items from 'shopping_list' table`, () => {
            //test that ItemsService.getAllItems gets data from table
            return ItemsService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql(testItems)
                })
        })

        it(`getById() resolves an Item by id from 'shopping_list' table`, () => {
            const thirdId = 3
            const thirdTestItem = testItems[thirdId - 1]
            return ItemsService.getById(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql({
                        product_id: thirdId,
                        product_name: thirdTestItem.product_name,
                        product_price: thirdTestItem.product_price,
                        category: thirdTestItem.category,
                        checked: thirdTestItem.checked,
                        date_added: thirdTestItem.date_added,  
            })
        })
    })

    it(`deleteitem() removes an item by id from 'shopping_list' table`, () => {
        const itemId = 3
        return ItemsService.deleteItem(db, itemId)
        .then(() => ItemsService.getAllItems(db))
        .then(allItems => {
            const expected = testItems.filter(item => item.product_id !== itemId)
            expect(allItems).to.eql(expected)
        })
    })

    it(`updateItem() updates an item from the 'shopping_list' table`, () => {
        const idOfItemToUpdate = 3
        const newItemData = {
            product_name: 'updated name',
            product_price: '0.00',
            category: 'Main',
            checked: false,
            date_added: new Date(),
        }
        return ItemsService.updateItem(db, idOfItemToUpdate, newItemData)
            .then(()=> ItemsService.getById(db, idOfItemToUpdate))
            .then(item => {
                expect(item).to.eql({
                    product_id: idOfItemToUpdate,
                    ...newItemData,
                })
            })
    })
})

    context(`Given 'shopping_list' has no data`, () => {
        it(`getAllItems() resolves an empty array`, () => {
            return ItemsService.getAllItems(db)
            .then(actual => {
                expect(actual).to.eql([])
            })
        })

        it(`insertItem() inserts a new item and resolves the new item with an 'id'`, () => {
            const newItem = {
                product_id: 1,
                product_name: 'Test new name',
                product_price: '0.00',
                category: 'Main',
                checked: false,
                date_added: new Date('2020-01-01T00:00:00.000Z'),
            }
            return ItemsService.insertItem(db,newItem)
                .then(actual => {
                    expect(actual).to.eql({
                        product_id: newItem.product_id,
                        product_name: newItem.product_name,
                        product_price: newItem.product_price,
                        category: newItem.category,
                        checked: newItem.checked,
                        date_added: newItem.date_added,
                    })
                })
        })
    })
})
