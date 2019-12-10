require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
})

function searchByItemName(searchTerm) {
knexInstance('shopping_list').select('name', 'price', 'category')
    .where(knexInstance.raw('LOWER(name) = ?', searchTerm.toLowerCase()))
    .then(result => {
        console.log(result)
    })
}
searchByItemName('not dogs');

function paginateProducts(pageNumber){
    const productsPerPage = 6
    const offset = productsPerPage * (pageNumber -1)
    knexInstance   
        .select('product_id', 'name', 'price', 'category')
        .from('shopping_list')
        .limit(productsPerPage)
        .offset(offset)
        .then(result => {
            console.log(result)
        })
}

paginateProducts(1);

function productAge(daysAgo) {
    knexInstance
        .select('*')
        .count('date_added AS days')
        .where(
            'date_added', '<',
            knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
        )
        .from('shopping_list')
        .groupBy('product_id', 'name', 'price', 'category')
        .orderBy([
            { column: 'name', order: 'ASC' },
        ])
        .then(result => {
            console.log(result)
        })
}

productAge(5)


function costPerCategory(){
    knexInstance    
        .select('category')
        .sum('price as total')
        .from('shopping_list')
        .groupBy('category')
        .then(result =>{
            console.log('COST PER CATEGORY');
            console.log(result);
        })
}

costPerCategory();