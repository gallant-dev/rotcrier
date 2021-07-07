const { sequelize, User, Section, Post, Comment, Shit } = require('./models');
var express = require('express');

var app = express();
app.use(express.json());

//The following is HTTP CRUD requests for User data.
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

app.put('/users', async(req, res) => {
    const { displayName, email, salt, password } = req.body;
    try{
        const user = await User.update({ 
            displayName: displayName,
            email: email,
            salt: salt, 
            password: password
            }, {
            where: {
            displayName: displayName
            }
          });
        return res.json(user);
    }
    catch(error){
        return res.status(500).json(error);
    }
})

app.delete('/users', async(req, res) => {
    const { displayName } = req.body;
    try{
        const user = await User.destroy({
            where: {
              displayName: displayName
            }
          });
        return res.json(user);
    }
    catch(error){
        return res.status(500).json(error);
    }
})
//The above is HTTP requests for User data.

//The below is HTTP requests for Section data.
app.post('/sections', async(req, res) => {
    const { title, description, visits, UserId } = req.body;
    
    const titleQuery = await Section.findAll({
        where: {
            title: title
        }
    });

    if(titleQuery.length > 0) {
        return res.status(400).json("The title of this section is taken, please try another.");
    }
    else{
        try{
            const section = await Section.create({ title, description, visits, UserId});
            return res.json(section);
        }
        catch(error){
            return res.status(500).json(error);
        }

    }
})

app.get('/sections/:title', async(req, res) => {
    const { title } = req.params;
    const section = await Section.findAll({
        where: {
            title: title
        }
    });
    if(title.length > 0){
        return res.json(section);
    }
    else {
        return res.status(404).json("Section not found.")
    }
})

app.put('/sections', async(req, res) => {
    const { title, description, visits, UserId } = req.body;
    try{
        const section = await Section.update({ 
            title: title,
            description: description,
            visits: visits, 
            UserId: UserId
            }, {
            where: {
                title: title
            }
          });
        return res.json(section);
    }
    catch(error){
        return res.status(500).json(error);
    }
})

app.delete('/sections', async(req, res) => {
    const { title } = req.body;
    try{
        const section = await Section.destroy({
            where: {
                title: title
            }
          });
        return res.json(section);
    }
    catch(error){
        return res.status(500).json(error);
    }
})
//The above is HTTP requests for Section data.

//The below is HTTP requests for Posts data.
app.post('/posts', async(req, res) => {
    const { title, body, visits, shit, UserId, SectionId } = req.body;
    
    const titleQuery = await Post.findAll({
        where: {
            title: title
        }
    });

    if(titleQuery.length > 0) {
        return res.status(400).json("The title of this Post is taken, please try another.");
    }
    else{
        try{
            const post = await Post.create({ title, body, visits, shit, UserId, SectionId});
            return res.json(post);
        }
        catch(error){
            return res.status(500).json(error);
        }

    }
})

app.get('/posts/:title', async(req, res) => {
    const { title } = req.params;
    const post = await Post.findAll({
        where: {
            title: title
        }
    });
    if(post.length > 0){
        return res.json(post);
    }
    else {
        return res.status(404).json("Post not found.")
    }
})

app.put('/posts', async(req, res) => {
    const { title, body, visits, shit, UserId } = req.body;
    try{
        const post = await Post.update({ 
            title: title,
            body: body,
            visits: visits,
            shit: shit, 
            UserId: UserId
            }, {
            where: {
                title: title
            }
          });
        return res.json(post);
    }
    catch(error){
        return res.status(500).json(error);
    }
})

app.delete('/posts', async(req, res) => {
    const { title } = req.body;
    try{
        const post = await Post.destroy({
            where: {
                title: title
            }
          });
        return res.json(post);
    }
    catch(error){
        return res.status(500).json(error);
    }
})
//The above is HTTP requests for Section data.

//The below is HTTP requests for Comment data.
app.post('/comments', async(req, res) => {
    const { body, shit, UserId, PostId, CommentId } = req.body;
    
    const commentQuery = await Comment.findAll({
        where: {
            body: body,
            UserId: UserId,
            PostId: PostId,
            CommentId: CommentId
        }
    });

    if(commentQuery.length > 0) {
        return res.status(400).json("Cannot post a duplicate comment.");
    }
    else{
        try{
            const comment = await Comment.create({ body, shit, UserId, PostId, CommentId});
            return res.json(comment);
        }
        catch(error){
            return res.status(500).json(error);
        }

    }
})

app.get('/comments/:commentId', async(req, res) => {
    const { commentId } = req.params;
    const comment = await Comment.findAll({
        where: {
            id: commentId
        }
    });
    if(comment.length > 0){
        return res.json(comment);
    }
    else {
        return res.status(404).json("Comment not found.")
    }
})

app.put('/comments/:id', async(req, res) => {
    const { id } = req.params;
    const { body, shit, UserId, PostId, CommentId } = req.body;
    try{
        const comment = await Comment.update({ 
            body: body,
            shit: shit,
            UserId: UserId,
            PostId: PostId, 
            CommentId: CommentId
            }, {
            where: {
                id: id
            }
          });
        return res.json(comment);
    }
    catch(error){
        return res.status(500).json(error);
    }
})

app.delete('/comments', async(req, res) => {
    const { id } = req.body;
    try{
        const comment = await Comment.destroy({
            where: {
                id: id
            }
          });
        return res.json(comment);
    }
    catch(error){
        return res.status(500).json(error);
    }
})
//The above is HTTP requests for Comment data.

//The below is HTTP requests for Shit data.
app.post('/shits', async(req, res) => {
    const { UserId, PostId, CommentId } = req.body;

    if(PostId && CommentId){
        return res.status(400).json("Can only give a shit about a Post or Comment, not both.");
    }
    if(!PostId && !CommentId){
        return res.status(400).json("Must give a shit about either a Post or Comment.");
    }
    
    const shitQuery = await Shit.findAll({
        where: {
            UserId: UserId,
            PostId: PostId,
            CommentId: CommentId
        }
    });

    if(shitQuery.length > 0) {
        return res.status(400).json("Cannot give two shits.");
    }
    else{
        try{
            const shit = await Shit.create({UserId, PostId, CommentId});
            return res.json(shit);
        }
        catch(error){
            return res.status(500).json(error);
        }

    }
})

app.get('/shits/post/:PostId', async(req, res) => {
    const {  PostId } = req.params;
    const shit = await Shit.findAll({
        where: {
            PostId: PostId
        }
    });

    if(shit.length > 0){
        return res.json(shit);
    }
    else {
        return res.status(404).json("No shits given.")
    }
})

app.get('/shits/comment/:CommentId', async(req, res) => {
    const {  CommentId } = req.params;
    const shit = await Shit.findAll({
        where: {
            CommentId: CommentId
        }
    });

    if(shit.length > 0){
        return res.json(shit);
    }
    else {
        return res.status(404).json("No shits given.")
    }
})

app.get('/shits/user/:UserId/given', async(req, res) => {
    const { UserId } = req.params;
    const shit = await Shit.findAll({
        where: {
            UserId: UserId
        }
    });

    if(shit.length > 0){
        return res.json(shit);
    }
    else {
        return res.status(404).json("No shits given.")
    }
})

app.get('/shits/user/:UserId/comments/recieved', async(req, res) => {
    const { UserId } = req.params;
    const shit = await Shit.findAll({
        include: [{
            model: Comment,
            where: {
                UserId: UserId
            }
        }]
    })

    if(shit.length > 0){
        return res.json(shit);
    }
    else {
        return res.status(404).json("No shits given.")
    }
})

app.get('/shits/user/:UserId/posts/recieved', async(req, res) => {
    const { UserId } = req.params;
    const shit = await Shit.findAll({
        include: [{
            model: Post,
            where: {
                UserId: UserId
            }
        }]
    })

    if(shit.length > 0){
        return res.json(shit);
    }
    else {
        return res.status(404).json("No shits given.")
    }
})

app.delete('/shits', async(req, res) => {
    const { id } = req.body;
    try{
        const shit = await Shit.destroy({
            where: {
                id: id
            }
          });
        return res.json(shit);
    }
    catch(error){
        return res.status(500).json(error);
    }
})
//The above is HTTP requests for Shit data.

const port = process.env.PORT || 3000;
app.listen(port, async () =>{
    console.log(`Listening on port ${port}!`)
    await sequelize.sync({ force: true}); // Use force: true if table needs to modified.
    console.log(`Database synced.`)
})