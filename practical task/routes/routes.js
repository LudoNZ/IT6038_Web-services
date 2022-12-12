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
        
    //send request with the postData form
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

//GET User Profile
router.get('/spotify/user', async (req, res) => {
    console.info(`fetching Spotify user ${req.body.user_id}`);
    var response = await fetch('https://api.spotify.com/v1/users/' + req.body.user_id,
    {
        method: 'GET',
        headers: {
            "Authorization": req.headers["authorization"],
            "Content-Type": "application/json"
        }
    });
    
    res.send(await response.json())
});

//GET User Playlists
router.get('/spotify/user/playlists', async (req, res) => {
    console.info(`fetching Spotify user ${req.body.user_id} Playlists`);
    var response = await fetch('https://api.spotify.com/v1/users/' + req.body.user_id + '/playlists',
    {
        method: 'GET',
        headers: {
            "Authorization": req.headers["authorization"],
            "Content-Type": "application/json"
        }
    });
    
    res.send(await response.json())
});

//GET Artist
router.get('/spotify/Artist', async (req, res) => {
    console.info(`fetching artist ${req.body.artist_id}`);
    artistID = req.body.artist_id
    var response = await fetch('https://api.spotify.com/v1/artists/' + artistID,
    {
        method: 'GET',
        headers: {
            "Authorization": req.headers["authorization"],
            "Content-Type": "application/json"
        }
    });
    
    res.send(await response.json())
});

//GET Artist Albums
router.get('/spotify/Artist/albums', async (req, res) => {
    console.info(`fetching Artist ${req.body.user_id}`);
    artistID = '0k17h0D3J5VfsdmQ1iZtE9' //PinkFloyd
    var response = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums/',
    {
        method: 'GET',
        headers: {
            "Authorization": req.headers["authorization"],
            "Content-Type": "application/json"
        }
    });
    
    res.send(await response.json())
});

//GET Several Artists
router.get('/spotify/Artists', async (req, res) => {
    artistIDs = req.body.ids
    console.info(`fetching Artists ${artistIDs}`);
    var response = await fetch('https://api.spotify.com/v1/artists/?ids=' + artistIDs,
    {
        method: 'GET',
        headers: {
            "Authorization": req.headers["authorization"],
            "Content-Type": "application/json"
        }
    });
    
    res.send(await response.json())
});

//GET Artist Top-Tracks
router.get('/spotify/Artist/top-tracks', async (req, res) => {
    artistID = req.body.artist_id
    console.info(`fetching Top-Track from Artist ${artistID}`);
    var response = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/top-tracks?market=NZ',
    {
        method: 'GET',
        headers: {
            "Authorization": req.headers["authorization"],
            "Content-Type": "application/json"
        }
    });
    
    res.send(await response.json())
});

//GET Album
router.get('/spotify/Album', async (req, res) => {
    albumID = req.body.album_id
    console.info(`fetching album ${albumID}`);
    var response = await fetch('https://api.spotify.com/v1/albums/' + albumID,
    {
        method: 'GET',
        headers: {
            "Authorization": req.headers["authorization"],
            "Content-Type": "application/json"
        }
    });
    
    res.send(await response.json())
});

//GET Albums
router.get('/spotify/Albums', async (req, res) => {
    albumIDs = req.body.album_ids
    console.info(`fetching albums ${albumIDs}`);
    var response = await fetch('https://api.spotify.com/v1/albums?ids=' + albumIDs,
    {
        method: 'GET',
        headers: {
            "Authorization": req.headers["authorization"],
            "Content-Type": "application/json"
        }
    });
    
    res.send(await response.json())
});

//GET Track
router.get('/spotify/Track', async (req, res) => {
    trackID = req.body.track_id
    console.info(`fetching album ${trackID}`);
    var response = await fetch('https://api.spotify.com/v1/tracks/' + trackID,
    {
        method: 'GET',
        headers: {
            "Authorization": req.headers["authorization"],
            "Content-Type": "application/json"
        }
    });
    
    res.send(await response.json())
});


//PUT Playlist Update
router.put('/spotify/Playlist-update', async (req, res) => {
    playlistID = req.body.playlist_id
    console.info(`updating playlist ${playlistID}`);
    console.log(req.body)
    console.log(JSON.stringify(req.body))
    var response = await fetch('https://api.spotify.com/v1/playlists/' + playlistID + '/tracks',
    {
        method: 'POST',
        headers: {
            "Authorization": req.headers["authorization"],
            "Content-Type": "application/json"
        },
        body: JSON.stringify(req.body)
    });
    
    res.send(await response.json())
});



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