import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import exp from "constants";

const app = express();

const myPort = process.env.PORT;
const dataBase = process.env.DATABASE;

app.get("/", (req, res) => {
  res.send("hey puting more effort here");
});

mongoose
  .connect(dataBase)
  .then(() => {
    console.log("Database Connected");
    app.listen(myPort, () => {
      console.log(`server is running on ${myPort}`);
    });
  })
  .catch(() => {
    console.log("Database Not Connected");
  });
