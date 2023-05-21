const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");


// middleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('candy land toys are flying')
})


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.ta7i6kc.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // my code goes from here

    const toysCollection = client.db("candyLand").collection("allToys");
    const sellerToys = client.db("candyLand").collection("sellerToys");
    
    // get all the toys
    app.get("/allToys", async (req, res) => {
      const cursor = toysCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // get single toy
    app.get("/allToys/singleToy/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.findOne(query);
      res.send(result);
    });

    // get data by categories
    app.get("/allToys/categories/:id", async (req, res) => {
      const id = req.params.id;
      const query = { category: id };
      const cursor = toysCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // get data by ascending sorting
    app.get("/allToys/ascendingSort", async (req, res) => {
      const query = {};
      const cursor = toysCollection.find(query).sort({ price: 1 });
      const result = await cursor.toArray();
      res.send(result);
    });
    // get data by descending sorting
    app.get("/allToys/descendingSort", async (req, res) => {
      const query = {};
      const cursor = toysCollection.find(query).sort({ price: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });

    // seller toys
    app.post("/sellerToys", async (req, res) => {
      const body = req.body;
      const result = await sellerToys.insertOne(body)
      res.send(result)
    });

    app.get("/getSellerToys", async (req, res) => {
      const cursor = sellerToys.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    // edit the seller toys
    app.put("/getSellerToys/:id", async(req, res) => {
      const id = req.params.id
      const toy = req.body;
      console.log(id, toy)
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const updatedToy = {
        $set: {
          price: toy.price,
          quantity: toy.quantity,
          description: toy.description
        }
      }

      const result = await sellerToys.updateOne(filter, updatedToy, options)
      res.send(result)
    });

    // get toy data by seller
    app.get('/getSellerToysByEmail', async( req, res) => {
      console.log(req.query.email)
      let query = {}
      if(req.query?.email){
        query = {email: req.query.email}
      }
      const cursor = sellerToys.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })

    // delete data 
    app.delete("/getSellerToys/:id", async (req, res) => {
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await sellerToys.deleteOne(query)
      res.send(result)
    });

    // my code goes from here

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log('candy land toys are running on', port)
})