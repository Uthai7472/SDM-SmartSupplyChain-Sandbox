require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const port = 5672;

const app = express();
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.static('public'));

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

const pool = mysql.createPool({
    host: process.env.MYSQL_HOSTNAME,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,  
});

const sessionMiddleware = session({
    secret: 'SessionSecretKey',
    resave: false,
    saveUninitialized: true,
});
app.use(sessionMiddleware);
app.use(express.json());
app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: true }));
const isAuthenticated = (req, res, next) => {
    if (req.cookies.isAuthenticated) {
        next();
    }
    else {
        res.redirect('/');
    }
};


// Login Page
app.get('/', (req, res) => {
    const connection = pool.getConnection();
    connection.query(`
        CREATE TABLE IF NOT EXISTS tb_user_e_supp (id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(255), password VARCHAR(255), email VARCHAR(255))
    `);
    connection.release();


    res.render('login');
})  