require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectToMongoDb = require("./connection");
const {loginRouter} = require("");

const PORT = process.env.PORT || 8001;
const MONGO_URL = process.env.MONGO_URL;

const app = express();
connectToMongoDb(MONGO_URL)
  .then(() => console.log("MongoDB Connected !"))
  .catch((e) => {
    console.log(`MONGODB ERROR ${e}`);
  });

// ^ Middle Wares
app.use(
  cors({
    origin: "",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ^ Routes :
app.use("/", loginRouter);

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
