const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fgemqio.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
      
        const serviceCollection = client.db('ctgFood').collection('services');
       
       
        

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });


       

    }
    finally {

    }

}
run().catch(error => console.error(error));





app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})