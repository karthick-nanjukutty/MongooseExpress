const express =require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
var methodOverride = require('method-override');
app.use(methodOverride('_method'));
const mongoose = require('mongoose');

const FarmProduct = require ('./models/product') 

const categories = ['fruit','vegetable', 'dairy', 'baked']

// Connect to Db

main().catch(err => console.log('OH NO ERROR', err));
async function main () {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/farmersproduct');
    console.log("Mongo connection Open")

    }

    catch (err) {
        console.log  ("Oh No Error!!! ", err)
    }
    
}

// Step 1 : To get All Products 
app.get ('/products' , async (req,res) =>{
    const {category} = req.query;

    if (category) {
        const products = await FarmProduct.find({category : category});
        res.render('products/index', {products,category})
    }

    else {
        const products = await FarmProduct.find();
        res.render ('products/index', {products, category: 'All Category'})
    }
    // //db.collections.find()
    // const products = await FarmProduct.find();
    // //console.log('The products are ', products )
    // res.render('products/index', {products,category})
})

// Step 2: Add a New Product
// Step 2a : Render a page to add new Product

app.get ('/products/new' , async (req,res) =>{
    res.render ('products/new', {categories})
})

//Step 2b: Add the new product and back to main page
app.post('/products', async(req,res) =>{

    console.log ('the request body is ', req.body)
    const {name,price,category} = req.body;
    const addedProduct = await new FarmProduct({name,price,category}).save();
    console.log ('Added product is ',addedProduct)
    res.redirect('/products')
})

// Step 4: Update the product
// Step 4a. Render the page to update 

app.get ('/products/:id/edit' , async (req,res)=>{
    const {id} = req.params;
    //find the product using the id 
    // db.collection.findbyId()
    const foundProductToUpdate = await FarmProduct.findById(id);
    console.log ('foundProduct to update', foundProductToUpdate)
    res.render ('products/edit' , {foundProductToUpdate,categories})
})


app.put ('/products/:id' , async(req,res) =>{
    const {id} = req.params;
    const {name,price,category} = req.body;
    const updateProduct = await FarmProduct.findByIdAndUpdate(id,{name,price,category}, {new: true, runValidators: true})
    res.redirect(`/products/${id}`)
})
// Step 3 : Show details of single product

app.get ('/products/:id', async (req,res) =>{
    //console.log ('the parameter is' , req.params)
    const {id} = req.params
    //db.collections.findbyId()
    const foundProduct = await FarmProduct.findById(id)
    console.log ('the found product is ', foundProduct)
    
    res.render('products/show', {foundProduct})
})

// Step 5: Deleting the product

app.delete ('/products/:id', async (req,res) =>{
    const {id} = req.params;
    const foundProductToDelete = await FarmProduct.findByIdAndDelete(id);
    res.redirect ('/products')

})

//Step 6 Filter by category 

// /products? category=dairy


app.listen(3006,()=>{
    console.log("Listening on port 3006");

})
