const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

const app = express();


// userName: dressUser
// password: voTjL2LJdSe4kSWr
//Middleware
app.use(cors());
app.use(express.json());

// DB_USER=dressUser
// DB_PASS=voTjL2LJdSe4kSWr

// DB_USER=geniusUser
// DB_PASS=iFiqL19LoUguOKS7

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8w4ie.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
           await client.connect();
           const serviceCollection = client.db('dressUp').collection('inventoryItems');
          app.get('/service', async(req, res) =>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
          });
    }
    finally{

    }

}
run().catch(console.dir);



app.get('/',(req, res)=>{
    res.send('Running Server')
});
app.listen(port, () =>{
    console.log('Listening to port', port);
})