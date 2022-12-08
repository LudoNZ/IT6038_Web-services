const express = require('express');
require('dotenv').config();
const router = express.Router()

module.exports = router;

const Model = require('../model/model');


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
    const spotifyLogin = await fetch("https://accounts.spotify.com/authorize?client_id=" +
        process.env.CLIENT_ID +
        "&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Faccount&scope=user-top-read");
    if (spotifyLogin.ok) {
        const body = await spotifyLogin.text();
        res.location("https://accounts.spotify.com/authorize")
        res.send(body);
    }
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