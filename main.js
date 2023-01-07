const { ObjectId } = require('bson')
var express = require('express')
const { insertProduct, getAllProducts, deleteProductById, findProductById, updateProduct } = require('./databaseHandler')
var app = express()
var mongo = require('mongodb')
var path = require('path')

var mongoClient = require('mongodb').MongoClient
var url = 'mongodb+srv://Minkuzu:7898797799as@cluster0.vwnii7e.mongodb.net/test'

app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.get('/delete', async(req, res) => {
    const id = req.query.id
    await deleteProductById(id)
    res.redirect('/')
})

app.post('/sort', async(req, res) => {
    let name = req.body.txtName
    let client = await mongoClient.connect(url);
    let db = client.db("Mink");
    //For substring search, case insensitive
    let results = await db.collection("products").
    find().sort({ name: 1 }).toArray()
    console.log(results)
    res.render('home', { results: results })
})

app.post('/search', async(req, res) => {
    let name = req.body.txtSearch
    let client = await mongoClient.connect(url);
    let db = client.db("Mink");
    //For substring search, case insensitive
    let results = await db.collection("products").
    find({ 'name': new RegExp(name, 'i') }).toArray()
    console.log(results)
    res.render('home', { results: results })
})

// app.get('/all', async(req, res) => {
//     let results = await getAllProducts()
//     res.render('allProduct', { results: results })
// })

app.post('/update', async(req, res) => {
    let id = req.body.id
    let objectId = ObjectId(id)
    let name = req.body.txtName
    let price = Number(req.body.txtPrice)
    let desc = req.body.txtDesc
    let picURL = req.body.txtPic
    if (isNaN(name) && name.length < 3) {
        res.render('home')
    } else if (isNaN(price) || price < 0 || price > 999) {
        res.render('home')
    } else {
        let newProduct = {
            name: name,
            price: Number.parseFloat(price),
            desc: desc,
            picture: picURL
        }
        await updateProduct(id, newProduct)
        res.redirect('/')
    }
})

app.get('/edit', async(req, res) => {
    const id = req.query.id
    let objectId = ObjectId(id)
    let prod = await findProductById(id)
    console.log(prod)
    res.render('edit', { prod: prod })
})

app.post('/new', async(req, res) => {
    const name = req.body.txtName
    const price = Number.parseFloat(req.body.txtPrice)
    const desc = req.body.txtDesc
    const picURL = req.body.txtPic
    if (isNaN(name) && name.length < 3) {
        res.render('newProduct')
    } else if (isNaN(price) || price < 0 || price > 999) {
        res.render('newProduct')
    } else {
        const newProduct = {
            name: name,
            price: Number.parseFloat(price),
            desc: desc,
            picture: picURL
        }
        let id = await insertProduct(newProduct)
        console.log(id)
        res.redirect('/')
    }
})

app.get('/new', (req, res) => {
    res.render('newProduct')
})

app.get('/', async(req, res) => {
    let results = await getAllProducts()
    res.render('home', { results: results })
})



const PORT = process.env.PORT || 3000
app.listen(PORT)
console.log("Server is running!")
