const express = require("express");
const mongoose = require("mongoose");
const mongojs = require("mongojs");
const path = require("path");
const Workout = require("./models/workout.js");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/budget", {
  useNewUrlParser: true,
  useFindAndModify: false
});

// htmlRoutes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/stats', (req, res) => {
  res.sendFile(path.join(__dirname, './public/stats.html'));
});

app.get('/exercise', (req, res) => {
  res.sendFile(path.join(__dirname, './public/exercise.html'));
});

// apiRoutes
app.get("/api/workouts", (req, res) => {
  Workout.aggregate([
    {
      $set: {
        totalDuration: {$sum: "$exercises.duration"} 
      }
    }])
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

app.get("/api/workouts/range", (req, res) => {
  Workout.aggregate([
    {
      $set: {
        totalDuration: {$sum: "$exercises.duration"} 
      }
    }])
    .sort({ day: -1 })
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

app.put("/api/workouts/:id", (req, res) => {
  Workout.updateOne(
    {
      _id: req.params.id
    },
    {
      $set: {
        exercises: req.body
      }
    })
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

app.post("/api/workouts", (req, res) => {
  Workout.create(req.body)
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});


app.listen(PORT, () => {
  console.log(`App running on port localhost://${PORT}`);
});