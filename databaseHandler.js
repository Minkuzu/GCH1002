var mongoClient = require('mongodb').MongoClient
var url = 'mongodb+srv://Minkuzu:7898797799as@cluster0.vwnii7e.mongodb.net/test'
const { ObjectId } = require('bson')

async function insertProduct(newProduct) {
    let client = await mongoClient.connect(url)
    let db = client.db("Mink")
    let id = await db.collection("products").insertOne(newProduct)
    return id
}

async function getAllProducts() {
    let client = await mongoClient.connect(url)
    let db = client.db("Mink")
    let results = await db.collection("products").find({}).sort({ name: 1 }).toArray()
    return results
}

async function deleteProductById(id) {
    let client = await mongoClient.connect(url)
    let db = client.db("Mink")
    await db.collection("products").deleteOne({ _id: ObjectId(id) })
}

async function findProductById(id) {
    let client = await mongoClient.connect(url)
    let db = client.db("Mink")
    let prod = await db.collection("products").findOne({ _id: ObjectId(id) })
    return prod
}

async function updateProduct(id, newProduct) {
    let client = await mongoClient.connect(url)
    let db = client.db("Mink")
    await db.collection("products").updateOne({ _id: ObjectId(id) }, { $set: newProduct })
}
module.exports = { insertProduct, getAllProducts, deleteProductById, findProductById, updateProduct }
