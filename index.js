const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

const app = express();



//Middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8w4ie.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        client.connect();
        const serviceCollection = client.db('dressUp').collection('inventoryItems');

        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })


        // data post

        app.post('/service', async (req, res) => {
            const product = req.body;
            // console.log('add new user', product);
            if (!product.name || !product.price || !product.quantity || !product.suppler || !product.image || !product.description) {
                return res.send({ success: false, error: "Please Provide all information" })
            }
            const result = await serviceCollection.insertOne(product);
            res.send({ success: true, message: `Successfully inserted ${product.name}!` });
        });

        // data get

        app.get('/service', async (req, res) => {
            const limit = Number(req.query.limit);
            // console.log(limit);
            const cursor = serviceCollection.find();
            const products = await cursor.limit(limit).toArray();
            if (!products?.length) {
                return res.send({ success: false, error: "No product found" })
            }
            res.send({ success: true, data: products });

        });

        //update data
        app.put('/service/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const product = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: product.name,
                    price: product.price,
                    quantity: product.quantity,
                    suppler: product.suppler,
                    image: product.image,
                    description: product.description,
                }
            };
            const result = await serviceCollection.updateOne(filter, updateDoc, options);
            res.send(result);

        });
        //Quantity decrement
        app.put('/service/:id', async (req, res) => {
            const id = req.params.id;
            const items = req.body;
            //   console.log(items );
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const decrement = {
                $set: {
                    quantity: items.quantity - 1,
                }


            };
            const result = await serviceCollection.updateOne(filter, decrement, options);
            res.send(result);
        })

        //Stock add 
        app.put('/service/:id', async (req, res) => {
            const id = req.params.id;
            const items = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const decrement = {
                $set: {
                    quantity: items.quantity,
                }
            };
            const result = await serviceCollection.updateOne(filter, decrement, options);
            res.send(result);
        })

        //delete
        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id)
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        })


    }
    finally {


    }

}
run().catch(console.dir);

//check heroko
app.get('/hero', (req, res) => {
    res.send('Heroku is running');

})
app.get('/', (req, res) => {
    res.send('Running Server')
});
app.listen(port, () => {
    console.log('Listening to port', port);
})

module.exports = app;