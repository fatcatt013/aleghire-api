const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const dotenv = require('dotenv').config()

const app = express();
app.use(express.json());
app.use(cors());

const DB_USER = process.env.DB_USER;
const DB_HOST = process.env.DB_HOST;
const DB_PWD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const PORT = process.env.PORT;

const db = mysql.createConnection(
    {
        user: DB_USER,
        host: DB_HOST,
        password: DB_PWD,
        database: DB_NAME
    }
)

app.post("/getId", (req, res) => {
    const username = req.body.username;

    console.log("Attempting to get ID.");
    db.query("SELECT * FROM User WHERE username = ?", [username], (err, result) => {
        if (err) {
            console.log("There was an error");
        }
        if (result.length < 1) {
            console.log("Cant find the ID with this username: " + username);
            res.send({message: "ID with username of " + username + " was not found."});
        } else {
            console.log("Successfully found ID.");
            res.send({result: result});
        }
    });
});

app.post("/check-register", (req, res) => {
    const username = req.body.username;
    const email = req.body.email;

    console.log("Checking the availability of the credentials:\nusername=" + username + "\nemail=" + email);

    db.query("SELECT * FROM User WHERE username = ? OR email = ?",
        [username, email],
        (err, result) => {
            if (err) {
                res.send({err: err});
                console.log("There is a server side error. Please check the client side for more information");
            }
            if (result.length > 0) {
                res.send({message: "User with this credentials already exists."});
                return;
            }
            console.log("The credentials are available.")
            res.send({message: 1});
        })
});

app.post("/register", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    db.query("INSERT INTO User (username, password, email) VALUES (?, ?, ?)",
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

    db.query("SELECT * FROM User WHERE username = ?  AND password = ?",
        [username, password],
        (err, result) => {
            if (err) {
                res.send({err: err})
                console.log("There was a server side error, check the client side for more information.");
            }
            if (result.length > 0) {
                res.send({message: 1});
                console.log("Successfully logged in.");
            } else {
                res.send({message: "No user found"});
                console.log("No user found.");
            }
        }
    );
});

app.post("/init-user", (req, res) => {
    console.log("Initializing user stats.");

    const id = req.id;
    const name = req.body.name;
    const level = req.body.level;
    const exp = req.body.exp;
    const strength = req.body.strength;
    const stamina = req.body.stamina;
    const dexterity = req.body.dexterity;
    const intelligence = req.body.intelligence;
    const luck = req.body.luck;
    const money = req.body.money;

    const class_ = req.body.class;
    const pfp = req.body.pfp;
    const religion = req.body.religion;
    const guild = "None";


    console.log("ID: " + id);
    db.query("INSERT INTO UserStats" +
        " (level, exp, religion, strength, stamina, dexterity, intelligence, luck, User_id, money)" +
        " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [level, exp, religion, strength, stamina, dexterity, intelligence, luck, id, money]),
        (err) => {
            if (err) {
                console.log(err);
                res.send({err: err});
            } else {
                res.send({message: 1})
            }
        }
});

app.listen(PORT, () => console.log("Server started on port: " + PORT));