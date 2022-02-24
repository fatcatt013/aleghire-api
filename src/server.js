const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const dotenv = require('dotenv').config({path: "../.env"})

const app = express();
app.use(express.json());
app.use(cors());

const DB_USER = process.env.DB_USER;
const DB_HOST = process.env.DB_HOST;
const DB_PWD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

const db = mysql.createConnection(
    {
        user: DB_USER,
        host: DB_HOST,
        password: DB_PWD,
        database: DB_NAME
    }
)

app.post("/check-register", (req, res) => {
    const username = req.body.username;
    const email = req.body.email;

    console.log("Checking the availability of the credentials:\nusername=" + username + "\nemail=" + email);

    db.query("SELECT * FROM users WHERE username = ? OR email = ?",
        [username, email],
        (err, result) => {
            if (err) {
                res.send({err: err});
                console.log("There is a server side error. Please check the client side for more information");
            }
            if (result.length > 0) {
                res.send({message: "User with this credentials already exists."});
                console.log("User with this credentials already exists.");
            }
            console.log("The credentials are available.")
            res.send({message: 1});
        })
});

app.post("/register", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    db.query("INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
    [username, password, email],
    (err) => {
        if (err) {
            console.log(err);
        } else {
            res.send({message: 1})
        }
    });
});

app.post('/login', (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    console.log("Attempting to log in with: \nusername=" + username + "\npassword" + password);

    db.query("SELECT * FROM users WHERE username = ?  AND password = ?",
        [username, password],
        (err, result) => {
            if (err) {
                res.send({err: err})
                console.log("There was a server side error, check the client side for more information.");
            }
            if (result.length > 0) {
                res.send({message: 1});
                console.log("Successfuly logged in.");
            } else {
                res.send({message: "No user found"});
                console.log("No user found.");
            }
        }
    );
});

app.listen(3001, () => console.log("Server started on port: " + 3001));