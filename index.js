// Create a REST API with db connection!!
// It can be about anything you want
// You need 4(5) route handlers
// GET /{things} - get all records
// GET /{things}/:id? - get one record
// POST: /{things} - add new
// PUT: /{things}/:id - update a thing
// DELETE /{things}/:id - delete a thing

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();

const { PORT = 3333, MONGODB_URI = "mongodb://localhost:27017/dogs" } =
  process.env;

// for parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

(async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    mongoose.connection.on("error", (err) => {
      console.log(err);
    });
  } catch (err) {
    console.log(`Connection error`, err);
  }
})();

app.use((req, res, next) => {
  console.log(req.hostname);
  next();
});

const { Schema } = mongoose;
const dogSchema = new Schema({
  breed: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  avatar_url: {
    type: String,
    default:
      "https://freepikpsd.com/file/2019/10/dog-logo-png-2-Transparent-Images.png",
  },
});

const Dog = mongoose.model("Dog", dogSchema);

// app.get()
app.get("/api/v1/dogs", (req, res) => {
  Dog.find({}).exec((err, dogs) => {
    if (err) return res.status(500).send(err);

    res.status(200).json(dogs);
  });
});

//  app.getOne()
app.get("/api/v1/dogs/:id", (req, res, next) => {
  const dogId = req.params.id;

  Dog.findOne({ _id: dogId }).exec((err, dogs) => {
    if (err) return res.status(500).send(err);

    res.status(200).json(dogs);
  });
});

// app.post()
app.post("/api/v1/dogs", (req, res, next) => {
  console.log(req.body);
  const newDog = new Dog(req.body);

  newDog.save((err, dog) => {
    if (err) return res.status(500).send(err);
    res.status(201).json(dog);
  });
});

// app.put()
app.put("/api/v1/dogs/:id", (req, res, next) => {
  const dogId = req.params.id;
  const updates = req.body;

  Dog.updateOne({ _id: dogId }, updates, (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

// app.delete()
app.delete("/api/v1/dogs/:id?", (req, res, next) => {
  console.log(req.params.id);
  const dogId = req.params.id;
  Dog.remove({ _id: dogId }, (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
