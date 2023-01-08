const express = require('express');
const server = express();


server.listen(5045, () => {
    console.log("Online on port 5045"); 
});

require('dotenv').config();

const hostDatabase =  process.env.HOST_DATABASE; 
const nameDatabese = process.env.NAME_DATABASE;
const userDatabase = process.env.USER_DATABASE; 
const passwordDatabase = process.env.PASSWORD_DATABASE;

const Sequelize = require('sequelize');
const sequelize = new Sequelize(nameDatabese,userDatabase, passwordDatabase,{
    host: hostDatabase,
    dialect: 'mysql',
});

sequelize.authenticate().then(function(){
    console.log("Succeful");
}).catch(function(erro){
    console.log("Fail! erro: " + erro);
});

server.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
server.use(express.json());


server.get('/players', (req,res) => {
    return sequelize.query(
        'SELECT id, nickname, score, timesPlayed FROM Player ORDER BY score DESC',
        {
          type: sequelize.QueryTypes.SELECT

        }).then(result => {
            return res.json(result);
        }).catch((error) => {
            console.error('Error', error);
        });
});

server.get('/players/id/:id', (req,res) => {
    return sequelize.query(
        'SELECT id, nickname, score, timesPlayed FROM Player WHERE id = '+req.params.id,
        {
          type: sequelize.QueryTypes.SELECT

        }).then(result => {
            return res.json(result[0]);
        }).catch((error) => {
            console.error('Error', error);
        });
});

server.get('/players/nickname/:nickname', (req,res) => {
    return sequelize.query(
        'SELECT id, nickname, score, timesPlayed FROM Player WHERE nickname = "'+req.params.nickname+'"',
        {
          type: sequelize.QueryTypes.SELECT

        }).then(result => {
            return res.json(result[0]);
        }).catch((error) => {
            console.error('Error', error);
        });
});

server.post('/login', (req,res) => {
    return sequelize.query( 'SELECT * FROM Player WHERE nickname = "'+req.body.nickname+'"', {
              
            type: sequelize.QueryTypes.SELECT

        }).then(result => {

            if(result[0] == undefined){
                return res.json({message: 'Nickname not find'});
            }else if(result[0].password !== req.body.password){
                return res.json({message: 'Wrong nickname or password'});    
            }

            return res.json(result[0].id);
            

        }).catch((error) => {

            console.log(res.json({message: "ERROR: "+error}));
        });
});

server.post('/register', (req,res) => {
    
    return sequelize.query( 'SELECT * FROM Player WHERE nickname = "'+req.body.nickname+'"', {
              
            type: sequelize.QueryTypes.SELECT

        }).then(result => {
            // sequelize.release();
            if(result[0] != undefined){
                return res.json({message: 'Nickname exists'});
            }

            sequelize.query( 'INSERT INTO Player VALUE (0, "'+req.body.nickname+'", "'+req.body.password+'", 0, 0)', {
              
                type: sequelize.QueryTypes.INSERT
    
            }).catch((error) => {
    
                console.log(res.json({message: "ERROR: "+error}));
            });

            return res.json({message: 'Player was created'});
        }).catch((error) => {

            console.log("ERROR: "+error);
        });
});


server.post('/score', (req,res) => {
    return sequelize.query( 'UPDATE Player SET score = '+req.body.score+' WHERE id = '+req.body.id, {
              
            type: sequelize.QueryTypes.UPDATE

        }).catch((error) => {
            
            console.log(res.json({message: "ERROR: "+error}));
        });
});

server.post('/timesPlayed', (req,res) => {
    return sequelize.query( 'UPDATE Player SET timesPlayed = '+req.body.timesPlayed+' WHERE id = '+req.body.id, {
              
            type: sequelize.QueryTypes.UPDATE

        }).catch((error) => {

            console.log(res.json({message: "ERROR: "+error}));
        });
});
     
