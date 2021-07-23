const { sequelize, User, Section, Post, Comment, Shit } = require('./models');
const fs = require('fs')
var express = require('express');
var session = require('express-session')
const { Op } = require("sequelize");
const SessionStore = require('express-session-sequelize')(session.Store);
var crypto = require('crypto');

const sequelizeSessionStore = new SessionStore({
    db: sequelize,
});

var app = express();
app.set('trust proxy', 1)
app.use([
    express.json(),
    session({
        store: sequelizeSessionStore,
        genid: function(req){
            return crypto.randomUUID()
        },
        secret: crypto.randomBytes(16).toString('hex'),
        resave: false,
        saveUninitialized: true,
        cookie: { secure: 'auto' }
    })
]);

//The following is HTTP requests for User data.
app.post('/users', async(req, res) => {
    const { displayName, email, password } = req.body;

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
            //Generate random salt for user to be stored with the password in the database.
            const salt = crypto.randomBytes(32).toString('hex')
            
            //Generate the key using the password and the salt. For aes-256-gcm it needs to be 32 bytes. 
            crypto.scrypt(password, salt, 32, (err, key) => {
              if (err) throw err;

              //Get the initial vector from the local filesystem.
              fs.readFile('ciphertext.json', 'utf8', async(error, data) => {
                  if(error){
                      console.error(error)
                      return
                  }

                  //Parse the data inside the file to convert it to a JSON object
                  const iv = JSON.parse(data).iv

                  //Create the cipher using the key generated and the iv obtained from the
                  //local file system.
                  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
                  
                  //Use cipher update to update the cipher using utf8 to hex as output.
                  let encrypted = cipher.update(salt, 'utf8', 'hex')
                  //Finalize the cipher object in hex.
                  encrypted += cipher.final('hex')
  
                  const user = await User.create({
                      displayName: displayName,
                      email, 
                      salt: salt, 
                      password: encrypted
                  })
                  req.session.data = user.displayName;
                  return res.json({
                    id: user.id,
                    displayName: req.session.data,
                    session: req.session.id
                    });
                })
            });
        }
        catch(error){
            return res.status(500).json(error);
        }
    }
})

app.post('/users/login', async(req, res) => {
    const { displayName, password } = req.body;

    const nameQuery = await User.findOne({
        where: {
            displayName: displayName
        },
        include: Section
    })

    if(!nameQuery){
        return res.status(400).json("Display name not found.")
    }

    try{
        //Obtain the previously generated and stored salt
        const salt =  nameQuery.salt
            
        //Use the previously stored salt and the password entered by the user to generate key.
        crypto.scrypt(password, salt, 32, (err, key) => {
            if (err) throw err;

            //Obtain the stored iv from the local file system.
            fs.readFile('ciphertext.json', 'utf8', async(error, data) => {
                if(error){
                    console.error(error)
                    return
                }
                //Parse the stored iv into a JSON object.
                const iv = JSON.parse(data).iv
                //Create a cipher using the generated key and the obtained iv.
                const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
                
                //Update cipher using salt with utf8 as input and hex as output.
                let encrypted = cipher.update(salt, 'utf8', 'hex');

                //Finalize the encryption using hex.
                encrypted += cipher.final('hex');

                //If the new encrypted password is not equal to the stored encrypted password
                //the login attempt fails.
                if(encrypted != nameQuery.password){
                    return res.status(401).json('Invalid credentials. Please try again.')
                }
                req.session.data = nameQuery.displayName;
                  return res.json({
                    id: nameQuery.id,
                    displayName: req.session.data,
                    session: req.session.id,
                    memberships: nameQuery.sections
                    });
              })
          });
    }
    catch(error){
        return res.status(500).json(error);
    }
})

app.post('/users/logout', async(req, res) => {
    const { displayName, sessionId } = req.body;
    sequelizeSessionStore.destroy(sessionId, (error) => {
        return res.status(error)
    })

    return res.status(200).json("Successfully logged out")
})

app.get('/users/:displayName', async(req, res) => {
    const { displayName } = req.params;
    const user = await User.findOne({
        where: {
            displayName: displayName
        },
        include: Section
    });
    if(user){
        return res.json({
            displayName: user.displayName,
            memberships: user.sections
        });
    }
    else {
        return res.status(404).json("User not found.")
    }
})

app.get('/users/:displayName/memberships/posts/:start/:limit', async(req, res) => {    
    const { displayName, start, limit } = req.params;

    try {
        const user = await User.findOne({
            where: {
                displayName: displayName
            },
            include: {
                model: Section,
                include: {
                    model: Post,
                    order: [
                        ['id', 'DESC']
                    ],
                    include: Shit,
                    offset: start,
                    limit: limit
                }
            },
            attributes: ['id', 'displayName']
        });

        if(!user){
            return res.sendStatus(400).json("User not found.")
        }
        return res.json(user)
    }
    catch(error) {
        return res.json(error)
    }

})

app.put('/users', async(req, res) => {
    const { displayName, email, password, sessionId } = req.body;
    sequelizeSessionStore.get(sessionId, async(error) => {
        if(error){
            return res.status(400).json("Request denied: invalid session information");
        }
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
            return res.json({displayName: user.displayName, email: user.email});
        }
        catch(error){
            return res.status(500).json(error);
        }
    })
})

app.delete('/users', async(req, res) => {
    const { displayName, sessionId } = req.body;
    sequelizeSessionStore.get(sessionId, async(error) => {
        if(error){
            return res.status(400).json("Request denied: invalid session information")
        }
        try{
            const user = await User.destroy({
                where: {
                    displayName: displayName
                }
                });
            return res.json(displayName+" was successfully deleted!");
        }
        catch(error){
            return res.status(500).json(error);
        }

    })
})
//The above is HTTP requests for User data.

//The below is HTTP requests for Section data.
app.post('/sections', async(req, res) => {
    const { title, description, sessionId } = req.body;

    sequelizeSessionStore.get(sessionId, async(error, session) => {
        if(error){
            return res.status(error).json("Request denied: invalid session information")
        }

        const titleQuery = await Section.findAll({
            where: {
                title: title
            }
        });


        const userQuery = await User.findOne({
            where: {
                displayName: req.session.data
            }
        });
    
        if(titleQuery.length > 0) {
            return res.status(400).json("The title of this section is taken, please try another.")
        }
        else{
            try{
                const UserId = userQuery.id
                const section = await Section.create({ title, description, UserId })
                userQuery.addSection(section)
                return res.json(section)
            }
            catch(error){
                return res.status(500).json(error)
            }
    
        }
    })
})

app.get('/sections/:title', async(req, res) => {
    const { title } = req.params;
    const section = await Section.findOne({
        where: {
            title: title
        },
        include: [Post, {
            model: User,
            attributes:  ['displayName']
        }]
    });
    if(section){
        return res.json(section);
    }
    else {
        return res.status(404).json("Section not found.")
    }
})

app.get('/sections/:displayName/memberships', async(req, res) => {    
    const { displayName } = req.params;
    
    try {
        const user = await User.findOne({
            where: {
                displayName: displayName
            }
        });
        if(!user){
            return res.sendStatus(400).json("User not found.")
        }
        const sections = await user.getSections()
        return res.json(sections)
    }
    catch(error) {
        return res.json(error)
    }

})

app.get('/users/:displayName/memberships/posts/:start/:limit', async(req, res) => {    
    const { displayName, start, end } = req.params;
    
    try {
        const user = await User.findOne({
            where: {
                displayName: displayName
            },
            include: {
                model: Section,
                include: {
                    model: Post,
                    order: 'DESC',
                    offset: start,
                    limit: end
                }
            },
            attributes: ['id', 'displayName']
        });

        if(!user){
            return res.sendStatus(400).json("User not found.")
        }
        return res.json(user)
    }
    catch(error) {
        return res.json(error)
    }

})

app.put('/sections', async(req, res) => {
    const { title, description, UserId, sessionId } = req.body;  
    sequelizeSessionStore.get(sessionId, async(error, session) => {
        if(error){
            return res.status(error).json("Request denied: invalid session information")
        }

        const sectionQuery = await Section.findOne({
            where: {
                title: title
            }
        });

        if(!sectionQuery) {
            return res.status(404).json("Section not found!")
        }

        const userQuery = await User.findOne({
            where: {
                id: sectionQuery.UserId
            }
        });
        console.log(userQuery.displayName+' '+req.session.data)
        if(!userQuery || (userQuery.displayName != req.session.data)){
            return res.status(401).json("Unauthorized!")
        }
        
        try{
            const section = await Section.update({ 
                id: sectionQuery.id,
                title: sectionQuery.title, 
                description: description, 
                UserId: sectionQuery.UserId, 
                }, {
                where: {
                    id: sectionQuery.id
                }
            });
            const updatedSection = await Section.findOne({
                where: {
                    id: sectionQuery.id,
                },
                include: [ Post, {
                    model: User,
                    attributes:  ['displayName']
                }]
            });

            return res.json(updatedSection)
        }
        catch(error){
            return res.status(500).json(error)
        }
    })
})

app.delete('/sections', async(req, res) => {
    const { title, sessionId } = req.body;
    sequelizeSessionStore.get(sessionId, async(error, session) => {
        if(error){
            return res.status(error).json("Request denied: invalid session information")
        }

        const sectionQuery = await Section.findOne({
            where: {
                title: title
            }
        });

        if(!sectionQuery) {
            return res.status(404).json("Section not found!")
        }

        const userQuery = await User.findOne({
            where: {
                id: sectionQuery.UserId
            }
        });
        console.log(userQuery.displayName+' '+req.session.data)
        if(!userQuery || (userQuery.displayName != req.session.data)){
            return res.status(401).json("Unauthorized!")
        }
        
        try{
            const section = await Section.destroy({
                where: {
                    title: sectionQuery.title
                }
            });
            return res.json(title+" was succesfully deleted!");
        }
        catch(error){
            return res.status(500).json(error);
        }
    })
})
//The above is HTTP requests for Section data.

//The below is HTTP requests for Posts data.
app.post('/posts', async(req, res) => {
    const { title, body, UserId, sectionTitle, sessionId } = req.body;
    sequelizeSessionStore.get(sessionId, async(error, session) => {
        if(error){
            return res.status(error).json("Invalid session credentials. Please try relogging in.")
        }
        const titleQuery = await Post.findAll({
            where: {
                title: title
            }
        });
        const sectionQuery = await Section.findOne({
            where: {
                title: sectionTitle
            }
        });

        if(titleQuery.length > 0) {
            return res.status(400).json("The title of this Post is taken, please try another.");
        }
        if(!sectionQuery) {
            return res.status(400).json("The section could not be found, please try another.");
        }
        try{
            const post = await Post.create({ 
                title: title, 
                body: body, 
                UserId: UserId, 
                SectionId: sectionQuery.id });
            return res.json(post);
        }
        catch(error){
            return res.status(500).json(error);
        }

    })
})



app.get('/posts/:title', async(req, res) => {
    const { title } = req.params;
    const decodedTitle = decodeURIComponent(title)
    try {
        const post = await Post.findOne({
            where: {
                title: decodedTitle
            },
            include: [Section, {
                model: Comment,
                include: {
                    model: User,
                    attributes:  ['displayName']
                }
            }]
        });
        if(!post){
            return res.status(404).json("Post not found.")
        }
        return res.json(post);
    }
    catch(error){
        return res.status(500).json(error)
    }
})

app.get('/posts/unauth/:start/:limit', async(req, res) => {    
    const { start, limit } = req.params;

    try {
        const date = new Date()
        const currentTime = date.getTime()

        const posts = await Post.findAll({
            where: {
                updatedAt: {
                    [Op.between]: [currentTime-(86400000*3), currentTime]
                }
            },
            offset: start,
            limit: limit,
            include: Shit
        });
    
        if(posts.length < limit){
            const post = await Post.findAll({
                where: {
                    updatedAt: {
                        [Op.between]: [currentTime-(86400000*7), currentTime]
                    }
                },
                offset: start,
                limit: limit,
                include: Shit
            });
            if(posts.length < limit){
                const post = await Post.findAll({
                    where: {
                        updatedAt: {
                            [Op.between]: [currentTime-(86400000*30), currentTime]
                        }
                    },
                    offset: start,
                    limit: limit,
                    include: Shit
                });
                if(!post){
                    const post = await Post.findAll({
                        offset: start,
                        limit: limit,
                        include: Shit
                    });

                    return res.json(post)
                }

                return res.json(post)
            }
            
            return res.json(post)
        }

        return res.json(post)
    }
    catch(error) {
        return res.json(error)
    }

})


app.put('/posts', async(req, res) => {
    const { id, body, sessionId } = req.body;
    sequelizeSessionStore.get(sessionId, async(error, session) => {
        if(error){
            return res.status(error).json("Request denied: invalid session information")
        }

        const postQuery = await Post.findOne({
            where: {
                id: id
            },
            include: Section
        });
        if(!postQuery){
            return res.status(400).json("Unable to find post!")
        }

        try{

            const post = await Post.update({ 
                id: postQuery.id,
                title: postQuery.title, 
                body: body, 
                UserId: postQuery.UserId, 
                SectionId: postQuery.SectionId 
                }, {
                where: {
                    id: id
                }
            });
            const updatedPost = await Post.findOne({
                where: {
                    id: postQuery.id,
                },
                include: [Section, {
                    model: Comment,
                    include: {
                        model: User,
                        attributes:  ['displayName']
                    }
                }]
            });
            return res.json(updatedPost);
        }
        catch(error){
            return res.status(500).json("Server Error!")
        }
    })
})

app.delete('/posts', async(req, res) => {
    const { id, sessionId } = req.body;
    sequelizeSessionStore.get(sessionId, async(error, session) => {
        if(error){
            return res.status(error).json("Request denied: invalid session information")
        }

        const post = await Post.findOne({
            where: {
                id: id
            },
            include: Section
        });

        if(!post) {
            return res.status(400).json("Post not found.")
        }
        const user = await User.findOne({
            where: {
                displayName: req.session.data
            }
        })

        if(!user) {
            return res.status(400).json("User not found.")
        }

        if(user.id != post.UserId || user.id != post.Section.UserId){
            return res.status(401).json("Request denied: unauthorized")
        }

        try{
            const post = await Post.destroy({
                where: {
                    id: id
                }
            });
            return res.json("Post was successfully deleted!");
        }
        catch(error){
            return res.status(500);
        }
    })
})
//The above is HTTP requests for Post data.

//The below is HTTP requests for Comment data.
app.post('/comments', async(req, res) => {
    const { body, UserId, PostId, CommentId, sessionId } = req.body;
    sequelizeSessionStore.get(sessionId, async(error, session) => {
        if(error){
            return res.status(error).json("Unable to validate session")
        }
    })

    const commentQuery = await Comment.findAll({
        where: {
            body: body,
            UserId: UserId,
            PostId: PostId,
            CommentId: CommentId
        }
    })

    if(commentQuery.length > 0) {
        return res.status(400).json("Cannot post a duplicate comment.")
    }

    try{
        const comment = await Comment.create({ body, UserId, PostId, CommentId});
        return res.json(comment);
    }
    catch(error){
        return res.status(error)
    }
})

app.get('/comments/:commentId', async(req, res) => {
    const { commentId } = req.params;
    const comment = await Comment.findOne({
        where: {
            id: commentId
        },
        include: [{
            model: User,
            attributes: ['id', 'displayName']
        }, {
            model: Comment,
            as: 'Comments',
            include: {
                model: User,
                attributes: ['displayName']
            }
        }]
    });

    if(!comment){
        return res.status(404).json("Comment not found.")
    }
    return res.json(comment);
})

app.get('/comments/post/:postId', async(req, res) => {
    const { postId } = req.params;
    const comments = await Comment.findAll({
        where: {
            PostId: postId
        },
        include: Comment
    });
    if(comment.length == 0){
        return res.status(404).json("Comment not found.")
    }
    return res.json(comments);
})

app.put('/comments/', async(req, res) => {
    const { id, body, UserId, PostId, CommentId, sessionId } = req.body;
    sequelizeSessionStore.get(sessionId, async(error, session) => {
        if(error){
            return res.status(error).json("Request denied: invalid session information")
        }
        const commentQuery = await Comment.findOne({
            where: {
                id: id
            },
            include: [User, {
                model: Comment,
                as: 'Comments',
                include: {
                    model: User,
                    attributes: ['displayName']
                }
            }]
        });

        if(!commentQuery){
            return res.status(400).json("Comment not found")
        }
    
        try{

            const comment = await Comment.update({ 
                id: commentQuery.id,
                body: body,
                UserId: commentQuery.UserId,
                PostId: commentQuery.PostId, 
                CommentId: commentQuery.CommentId
                }, {
                where: {
                    id: id
                }
            });

            const updatedComment = await Comment.findOne({
                where: {
                    id: id
                },
                include: [User, {
                    model: Comment,
                    as: 'Comments',
                    include: {
                        model: User,
                        attributes: ['displayName']
                    }
                }]
            });
            return res.json(updatedComment);
        }
        catch(error){
            return res.status(500).json(error);
        }
    })
})

app.delete('/comments', async(req, res) => {
    const { id, sessionId } = req.body;
    sequelizeSessionStore.get(sessionId, async(error, session) => {
        if(error){
            return res.status(error).json("Request denied: invalid session information")
        }
        try{
            const comment = await Comment.destroy({
                where: {
                    id: id
                }
            });
            return res.json("Your comment was successfully deleted!");
        }
        catch(error){
            return res.status(500).json(error);
        }
    })
})
//The above is HTTP requests for Comment data.

//The below is HTTP requests for Shit data.
app.post('/shits', async(req, res) => {
    const { UserId, PostId, CommentId, sessionId } = req.body;
    sequelizeSessionStore.get(sessionId, async(error, session) => {
        if(error){
            return res.status(error).json("Request denied: invalid session information")
        }
        if(PostId && CommentId){
            return res.status(400).json("Can only give a shit about a Post or Comment, not both.");
        }
        if(!PostId && !CommentId){
            return res.status(400).json("Must give a shit about either a Post or Comment.");
        }
        if(!UserId){
            return res.status(400).json("Must provide a UserId.");
        }
        const userQuery = await User.findOne({
            where: {
                id: UserId
            }
        });

        if(!userQuery){
            return res.status(404).json("User not found.");
        }
        
        const shitQuery = await Shit.findOne({
            where: {
                UserId: UserId,
                PostId: PostId,
                CommentId: CommentId
            }
        });

        if(shitQuery) {
            return res.status(409).json("Cannot give two shits.");
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
})

app.get('/shits/post/:PostId', async(req, res) => {
    const {  PostId } = req.params;
    const shits = await Shit.findAll({
        where: {
            PostId: PostId
        }
    });
    return res.json(shits);
})

app.get('/shits/comment/:CommentId', async(req, res) => {
    const {  CommentId } = req.params;
    const shits = await Shit.findAll({
        where: {
            CommentId: CommentId
        }
    });
    return res.json(shits);
})

app.get('/shits/user/:UserId/given', async(req, res) => {
    const { UserId } = req.params;
    const shit = await Shit.findAll({
        where: {
            UserId: UserId
        }
    });
    return res.json(shits);
})

app.get('/shits/user/:UserId/comments/recieved', async(req, res) => {
    const { UserId } = req.params;
    const shits = await Shit.findAll({
        include: [{
            model: Comment,
            where: {
                UserId: UserId
            }
        }]
    })
    return res.json(shits);
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
    return res.json(shits);
})

app.delete('/shits', async(req, res) => {
    const { UserId, PostId, CommentId, sessionId } = req.body;
    sequelizeSessionStore.get(sessionId, async(error, session) => {
        if(error){
            return res.status(error).json("Request denied: invalid session information")
        }
        const user = await User.findOne({
            where: {
                id: UserId
            }
        })
        if(!user){
            return res.status(404).json("User not found!")
        }
        if(req.session.data != user.displayName){
            return res.status(401).json("Please try logging in again!")
        }

        try{
            const shit = await Shit.destroy({
                where: {
                    UserId: UserId,
                    PostId: PostId,
                    CommentId: CommentId
                }
            });
            return res.json("Shit succesfully ungiven!");
        }
        catch(error){
            return res.status(500).json(error);
        }
    })
})
//The above is HTTP requests for Shit data.

//The below is HTTP requests for search.
app.get('/search/:paramaters', async(req, res) => {
    const { paramaters } = req.params;
    const decodedParams = '%'+decodeURIComponent(paramaters)+'%'
    try {
        const posts = await Post.findAll({
            where: {
                [Op.or]: [{
                    title: {
                        [Op.iLike]: decodedParams
                    } 
                },  {
                    body: {
                        [Op.iLike]: decodedParams
                    }
                }]

            },
            include: [Section, Shit, {
                model: User,
                attributes:  ['displayName']
            }]
        });
        const sections = await Section.findAll({
            where: {
                [Op.or]: [{
                    title: {
                        [Op.iLike]: decodedParams
                    } 
                },  {
                    description: {
                        [Op.iLike]: decodedParams
                    }
                }]

            },
            include: {
                model: User,
                attributes:  ['displayName']
            }
        });
        const users = await User.findAll({
            where: {
                displayName: {
                    [Op.iLike]: decodedParams
                }
            },
            attributes: ['displayName']
        })
        const searchResults = {
            Posts: posts,
            Sections: sections,
            Users: users
        }

        return res.json(searchResults);
    }
    catch(error){
        console.log(error)
        return res.status(500).json(error)
    }
})
//The above is HTTP requests for search.

const port = 3000
app.listen(port, async () =>{
    console.log(`Listening on port ${port}!`)
    await sequelize.sync({ force: true}); // Use force: true if table needs to modified.
    console.log(`Database synced.`)
})