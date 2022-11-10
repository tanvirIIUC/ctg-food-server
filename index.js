const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const reviewCollection = client.db('ctgFood').collection('reviews');

       //add food
       app.post('/services', async(req,res) =>{
          const food = req.body;
          const result = await serviceCollection.insertOne(food);
          res.send(result);
       })
       
        

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
           
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        // review
        

        app.post('/review',async(req,res)=>{
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })
        app.get('/review', async(req, res) => {
            const query = {}
            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray();
            res.send(review);
        });
        app.get('/myReview', async(req, res) => {
            let query = {}
            if(req.query.email){
                query ={
                    email : req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const myReview = await cursor.toArray();
            res.send(myReview);
        });
        app.delete('/myReview/:id', async(req,res) =>{
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        });
        
        app.put('/updateReview/:id', async(req,res) =>{
            const id = req.params.id;
            const filter = { _id: ObjectId(id)};
            const user = req.body;
            const option = {upsert: true};
            const updatedUser = {
                $set: {
                    reviewCom: user.reviewCom
                }
            }
            const result = await reviewCollection.updateOne(filter,updatedUser,option); 
            res.send(result);
            // console.log(user);
        });

        //update review

        app.get('/updateReview/:id', async(req,res) =>{
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const user = await reviewCollection.findOne(query);
            res.send(user);
        });

    }
    finally {

    }

}
run().catch(error => console.error(error));





app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})