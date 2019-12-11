require('dotenv').config()
const knex = require('knex')
const ItemsService = require ('./shopping-list-service')

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
})

ItemsService.getAllItems(knexInstance)
    .then(items => console.log(items))
    .then(() =>
        ItemsService.insertItem(knexInstance, {
            product_name: 'New Name',
            product_price: '0.00',
            date_added: new Date(),
        })
        )
        .then(newItem => {
            console.log(newItem)
            return ItemsService.updateItem(
                knexInstance,
                newItem.product_id,
                { product_name: 'Updated Name' }
            ).then(() => ItemsService.getById(knexInstance, newItem.product_id))           
        })
        .then(item => {
            console.log(item)
            return ItemsService.deleteItem(knexInstance, item.product_id)
        })

console.log(ItemsService.getAllItems())