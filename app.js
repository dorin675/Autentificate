const controler=require("./controlers/controler");
const express = require("express");

const app = express();

app.use(express.json());

app.post("/register", controler.register);
app.post("/verify", controler.verify);
app.post("/login", controler.login);
app.post("/admin", controler.admin);


module.exports = app;