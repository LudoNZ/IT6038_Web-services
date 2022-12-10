const express = require('express');
require('dotenv').config();
const querystring = require('node:querystring');
const { URLSearchParams } = require('node:url');
const router = express.Router();
const https = require('https');

module.exports = router;

const Model = require('../models/model');


//this page contains the link to the spotify authorization page
//contains custom url queries that pertain to my specific app
router.get("/", (req, res) => {
    res.send(
        "<a href='/api/login'>Sign in</a>"
    );
  });
  
  //this is the page user is redirected to after accepting data use on spotify's website
  //it does not have to be /account, it can be whatever page you want it to be
router.get("/account", async (req, res) => {
    console.log("spotify response code is " + req.query.code);
    res.send("account page");
});

router.get("/login", async (req, res) => {
    console.info('Redirecting to Spotify login')
    res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.CLIENT_ID,
      scope: "user-top-read playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-library-read",
      redirect_uri: "http://localhost:3000/api/account"
    }));
});

router.post("/accesstoken", async (req, res) => {
    console.info('Requesting Spotify Access Token');

    const buff = Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET, 'utf-8');
    const auth = buff.toString('base64');

    var postData = querystring.stringify({
        grant_type: 'authorization_code',
        code: req.body.code,
        redirect_uri: 'http://localhost:3000/api/account'
    });

        // request option
    var options = {
        host: 'accounts.spotify.com',
        port: 443,
        method: 'POST',
        path: '/api/token',
        headers: {
            'Authorization': 'Basic ' + auth,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
        }
    };
        
    // request object
    var result = '';
    var request = https.request(options, function (response) {
        response.on('data', function (chunk) {
            result += chunk;
        });
        response.on('end', function () {
            console.log(result);
            res.send(result);
        });
        response.on('error', function (err) {
            console.log(err);
        })
    });
        
    // req error
    request.on('error', function (err) {
        console.log(err);
    });
        
    //send request witht the postData form
    request.write(postData);
    request.end();
})

router.post("/refreshtoken", async (req, res) => {
    console.info('Refreshing Spotify Access Token');

    const buff = Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET, 'utf-8');
    const auth = buff.toString('base64');

    var postData = querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: req.body.code
    });

        // request option
    var options = {
        host: 'accounts.spotify.com',
        port: 443,
        method: 'POST',
        path: '/api/token',
        headers: {
            'Authorization': 'Basic ' + auth,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
        }
    };
        
    // request object
    var result = '';
    var request = https.request(options, function (response) {
        response.on('data', function (chunk) {
            result += chunk;
        });
        response.on('end', function () {
            console.log(result);
            res.send(result);
        });
        response.on('error', function (err) {
            console.log(err);
        })
    });
        
    // req error
    request.on('error', function (err) {
        console.log(err);
    });
        
    //send request witht the postData form
    request.write(postData);
    request.end();
})



//Post Method
router.post('/post', async (req, res) => {
    const data = new Model({
        name: req.body.name,
        age: req.body.age
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

//Get all Method
router.get('/getAll', async (req, res) => {
    try{
        const data = await Model.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get by ID Method
router.get('/getOne/:id', async (req, res) => {
    try{
        const data = await Model.findById(req.params.id);
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Update by ID Method
router.patch('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Model.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Delete by ID Method
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})