const { sequelize, User } = require('./models');
var express = require('express');

var app = express();
app.use(express.json());

app.post('/users', async(req, res) => {
    const { displayName, email, salt, password } = req.body;
    
    const nameQuery = await User.findAll({
        where: {
            displayName: displayName
        }
    });

    const emailQuery = await User.findAll({
        where: {
            email: email
        }
    });

    if(nameQuery.length > 0) {
        if(emailQuery.length > 0){
            return res.status(400).json("Display name and email are in use, please try another.");
        }  
        return res.status(400).json("Display name is taken, please try another.");
    }
    else if(emailQuery.length > 0){
        return res.status(400).json("Email is already registered, please log in with that account");
    }
    else{
        try{
            const user = await User.create({ displayName, email, salt, password });
            return res.json(user);
        }
        catch(error){
            return res.status(500).json(error);
        }

    }
})

app.get('/users/:displayName', async(req, res) => {
    const { displayName } = req.params;
    const user = await User.findAll({
        where: {
            displayName: displayName
        }
    });
    if(user.length > 0){
        return res.json(user);
    }
    else {
        return res.status(404).json("User not found.")
    }
})

const port = process.env.PORT || 3000;
app.listen(port, async () =>{
    console.log(`Listening on port ${port}!`)
    await sequelize.sync({ force: true}); // Use force: true if table needs to modified.
    console.log(`Database synced.`)
})