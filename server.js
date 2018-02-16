const express = require('express');
const logger = require('morgan');
const errorhandler = require('errorhandler');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// database connection
const url = 'mongodb://localhost:27017/edx-course-db';
mongoose.connect('mongodb://localhost:27017/edx-course-db');

let app = express();

// logger and body-parser
app.use(logger('dev'));
app.use(bodyParser.json());

// Define Schema
const AccountSchema = {
    name: String,
    balance: Number
} 

// Mongoose Model
const Account = mongoose.model('Account', AccountSchema);

// Requests
app.get('/accounts', (req, res, next) => {
    Account.find({}, null, {sort: {_id: -1}}, function(err, accounts) {
        if (err) return next(err);
        res.send(accounts);
    })
});

app.post('/accounts', (req, res, next) => {
    let name = req.body.name;
    let balance = req.body.balance;

    let account = new Account ({name:name, balance:balance});

    account.save(function (err, account) {
        if (err) return next(err);
        res.send(account);
    })
});

app.put('/accounts/:id', (req, res, next) => {
    Account.findById(req.params.id, function (err, account) {
        if (err) return next(err);
        if(req.body.name) account.name = req.body.name;
        if(req.body.balance) account.balance = req.body.balance;
        account.save(function (err, result) {
            if (err) return next(err);
            res.send(result);
        })
    })
});

app.delete('/accounts/:id', (req, res, next) => {
    Account.findById(req.params.id, function (err, account) {
        if (err) return next(err);
        Account.remove(function (err, result) {
            if (err) return next(err);
            res.send(result);
        })
    })
});

// Error handling
app.use(errorhandler);

// Listening to port 3000
app.listen(3000, () => console.log('Server running...'));