const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Joi = require('@hapi/joi');

// Import the discord tokeen from .env
require('dotenv').config();

// Import the database class
const Database = require('./database/database.js');
const myDatabase = new Database();

// Import the discord bot class
const {DiscordBot, client} = require('./helpers/discord/discordBot.js');
const myDiscordBot = new DiscordBot();

// Import the utilities class
const Utilities = require('./helpers/utilities/utils.js');
const utils = new Utilities();

// Import the rate limiter class
const RateLimiter = require('./helpers/utilities/rateLimiter.js');

// Rate limiter middleware
app.use(RateLimiter.createLimiter());

// Middleware for parsing JSON in POST request body
app.use(express.json());

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

client.on('ready', () => {
    console.log('I am ready!')
});

app.post('/verify', async (req, res) => {
    const schema = Joi.object({
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),

        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

        discordUserID: Joi.string()
            .alphanum()
            .required(),

        hwid: Joi.string()
            .alphanum()
            .required()
    });

    // validate request data against schema1
    const { error, value } = schema.validate(req.body);
    if (error) {
        console.log(req.body);
        const { error, value } = schema.validate(req.body);    }

    const username = value.username;
    const password = value.password;
    const discordUserID = value.discordUserID;
    const hwid = value.hwid;

    // log to console the discordUserId, password, and hwid
    console.log(`discordID: ${discordUserID} username: ${username} Password: ${password} HWID: ${hwid}`);

    const result = await myDatabase.validateUserCredentials(username, password, hwid);
    res.status(result.status).json({ message: result.message });
});

client.on('message', async message => {
    if (message.channel.type !== 'dm') 
        return;

     if (message.content !== '!register') 
        return;

        const messageAuthorId = message.author.id;
    if (await myDatabase.userExists(messageAuthorId) === false) {
        const messageAuthorName = message.author.username;
        console.log(`Message from ${messageAuthorId}: ${message.content}`);
        let username = messageAuthorName;      
        
        // check if the username already exists in the database
        if (await myDatabase.usernameTaken(username) === true) {
            // if it does, add a random number to the end of the username
            username = `${username}${utils.generateRandomNumber()}`;
        }

        const password = utils.generateRandomPassword();
        myDatabase.insertUser(username, password, messageAuthorId);

        myDiscordBot.SendDiscordMessage(messageAuthorId, `Thanks ${username} for registering!`, 'good');
        myDiscordBot.SendDiscordMessage(messageAuthorId, `Username: ${username}\nPassword: ${password}`, 'good');
    }
    else {
        myDiscordBot.SendDiscordMessage(messageAuthorId, `UserID already registered.`, 'bad');
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
app.listen(8000, () => console.log('Server is listening on port 8000'));