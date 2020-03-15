/*
    Author: Advait Ambeskar

    Currently using PostgreSQL pg and pg-promise

    Issues with 
 */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const { Pool, Client } = require('pg');

// Database connection functions and objects.

const config = {
    user: "postgres",
    host: "localhost",
    database: "racenergy",
    password: "postgres",
    port: "5432"
}
const pool = new Pool(config);


// Express app
const app = express();
const PORT = 3001; // I am running the CS on 3001 and Front-end on 3000.

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

var sourceAuthor = '';

app.post('/inserts/', async (req, res) => {
    // [TODO]: Check header for authentication. Not using Passport.js right now.
    // Might include it if my flight isn't cancelled/ delayed.

    // [TODO]: Can use passport to maintain session authentication cookies and then using those.

    // Right now, I am using standard hash-based authentication. 
    // It occurs through use of a sourcekey and the hash from the headers are the same way as passport works
    // Think of source key as a username, and the hash as a password hashed and sent over the network.
    // Instead of allowing a single-time authentication, I am essentially, checking the key and hash each time an
    // insert occurs. This is an important distinction from general passport structure where you return a token
    // and that token is verified across sessions. Using each authentication is not processor intensive,
    // Think of this step as an extra linear step instead of overall computation being O(n + m), it is now O(n + 2m)
    // where n = `insert` transaction cost; and m = cost of authorization
    // Since linear costs don't matter asymptotically, there will not be any extra penalty for this implementation
    //
    // Instead of getting authentication credentials from the client (RPS) and then checking it on
    // a different route and then re-routing it, I have used it directly through comparisions.
    // It has reduced the need of a separate schema and also of maintaining different routes.
    // This is obviously not a safe solution. This solution is intended to be purely on prototype basis
    // For an acutal solution, we will have a separate schema for user-data, where we will "SELECT" the user
    // trying to connect and then we will check the hash that is stored on the schema row.
    // I have circumvented that by directly maintaining a single-user interface (this is not how to do this, obviously,
    // but it works for a sample problem to show functionality.)
    //
    if (req.headers.sourcekey == 'kXCHFdgTSBem9nyEfKxJsOS85s48fuZQ9qjp4I2t') {
        // use trusted source
        if (bcrypt.compareSync("T0SJR9EQVxjuFnYXm8QBcwas4gKZQcYrbboPH3Cb", req.headers.hash)) {
            // The client (RPS) sends one extra field - author,
            // which is the identification number/ tag for the RPi.
            // The client is expected to have one, and it is stored in its configuration.
            // Think of it as a 'name' column in your profile data.
            let author = req.body.author;
            let data = req.body.data;

            let name = data['Student Name'];
            let id = data['ID'];
            let yob = data['YoB'];
            let gender = data['Gender'];
            let height = data['Height (cm)'];
            let weight = data['Weight (kg)'];
            let nationality = data['Nationality'];
            let course = data['Course'];
            let score = data['Last Score(%)'];
            let ailments = data['Ailments (if any)'];

            // once credentials are authorized, we can accept the data,
            // check if it is in the required format and then add it.

            if (name != undefined
                && id != undefined
                && yob != undefined
                && gender != undefined
                && height != undefined
                && weight != undefined
                && nationality != undefined
                && course != undefined
                && score != undefined
                && ailments != undefined) {

                const queryString = `INSERT INTO 
            student("AUTHOR", "ID", "NAME", "GENDER", "HEIGHT", "WEIGHT", "NATIONALITY", "COURSE", "SCORE", "AILMENTS", "YOB")
            VALUES(
                '${author}',
                '${id}',
                '${name}',
                '${gender}',
                ${height},
                ${weight},
                '${nationality}',
                '${course}',
                ${score},
                '${ailments}',
                ${yob}
            )`;

                await pool.query(queryString);

            }
            res.json({
                response: 'Yes. Added to Database.'
            });

        } else {
            // untrusted source
            res.json({
                response: 'No. Wrong Credentials. Please update your headers.'
            });
        }
    } else {
        res.json({
            response: 'No. Wrong Credentials. Please update your headers.'
        });
    }


});

app.get('/sendAll', async (req, res) => {
    var params = req.query;
    // console.log(params);
    // var gender = "GENDER"
    // var reqGender = 'M'
    console.log('username', params.username);
    console.log('password', params.password);
    if (params.username == 'advait') {
        if (bcrypt.compareSync('advait', params.password)) {
            console.log("here");
            const queryString = `
            SELECT "HEIGHT", "WEIGHT", "SCORE", "YOB"            
            FROM student
            `
            var result = [];

            await pool.query(queryString, (error, result) => {
                if (error) {
                    console.log({ error: 'error in reading table' });
                } else {
                    console.log(result.rows);
                    res.send({
                        authentication: true,
                        results: result.rows
                    });
                }
            });
            // console.log(res);
        } else {
            res.json({ error: 'error in connecting to the database due to wrong password' });
        }
    } else {
        res.json({ error: 'wrong username' });
    }
})

app.get('/frontendpoint', async (req, res) => {
    var params = req.query;
    console.log(params);
    if (params.username == 'advait') {
        if (bcrypt.compareSync('advait', params.password)) {
            res.send({ authentication: true })
        } else {
            res.send({ authentication: false })
        }
    } else {
        res.send({ authentication: false })
    }
})

app.listen(PORT, () => {
    console.log('App has started on AWS');
    pool.connect();
});

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}