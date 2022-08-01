require('express-async-errors');
const express = require('express');
const config = require("config");
const cors = require("cors");
const app = new express();

require("./startup/logging")();
app.use(cors());
require("./startup/routes")(app);
require("./startup/db")();

const port = process.env.PORT || config.get("port");
app.listen(port, ()=> `Listening on port ${port}`);