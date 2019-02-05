// https://blog.syntonic.io/2017/07/07/reddit-bot-nodejs-example/
// https://ssl.reddit.com/prefs/apps/

require('dotenv').config();

const Snoowrap = require('snoowrap');
const Snoostorm = require('snoostorm');

const r = new Snoowrap({
    userAgent: 'reddit-bot-example-node',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    username: process.env.REDDIT_USER,
    password: process.env.REDDIT_PASSWORD
});

const client = new Snoostorm(r);
