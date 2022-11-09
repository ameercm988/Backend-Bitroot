const express = require("express");
const cookieParser = require("cookie-parser");
const env = require("dotenv").config();
const path = require("path");

const db = require("./Config/dbConfig");
const clientRoute = require("./Routes/clientRoute");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "contactImage")));

db.connect((err) => {
  if (err) {
    console.log("Database not connected" + err);
  } else {
    console.log(`Database connected succesfully to ${port}`);
  }
});

app.get('/', (req, res, next) => {
    res.send('herookuuuuuuuuuu')
})
app.use("/api/client", clientRoute);

const port = process.env.PORT || 7000;

app.listen(port, () => {
  `listening to port ${port}`;
});
