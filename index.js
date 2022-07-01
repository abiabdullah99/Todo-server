const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://AbiAbdullah:FRfTLHbUxTu8goQK@cluster0.p7yehdu.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const TaskCollection = client.db("task").collection("items");
    const completeTask = client.db("task").collection("complete");

    // Get All Task
    app.get("/tasks", async (req, res) => {
      const query = req.body;
      const task = await TaskCollection.find(query).toArray();
      res.send(task);
    });

    app.get("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const productId = await TaskCollection.findOne(query);
      res.send(productId);
    });
    app.put("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          task: updatedUser.task,
        },
      };
      const result = await TaskCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    // Submit Task From tasks Collection
    app.post("/tasks", async (req, res) => {
      const query = req.body;
      const tasks = await TaskCollection.insertOne(query);
      res.send(tasks);
    })
    app.get("/complete", async (req, res) => {
      const query = req.body;
      const task = await completeTask.find(query).toArray();
      res.send(task);
    });

    // Submit Task From tasks Collection
    app.post("/complete", async (req, res) => {
      const query = req.body;
      const tasks = await completeTask.insertOne(query);
      res.send(tasks);
    })
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
