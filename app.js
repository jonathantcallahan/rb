// https://blog.syntonic.io/2017/07/07/reddit-bot-nodejs-example/
// https://ssl.reddit.com/prefs/apps/
// https://developer.ebay.com/DevZone/finding/CallRef/types/ItemFilterType.html

require('dotenv').config();

const Snoowrap = require('snoowrap');
const Snoostorm = require('snoostorm');
const request = require('request')

const r = new Snoowrap({
    userAgent: 'reddit-bot-example-node',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    username: process.env.REDDIT_USER,
    password: process.env.REDDIT_PASSWORD
});

console.log(r)

const client = new Snoostorm(r);

const streamOpts = {
    subreddit: 'testingground4bots',
    results: 25
};

const comments = client.CommentStream(streamOpts);

comments.on('comment', comment => {
    const {body} = comment;
    console.log(body);
    if(~body.search(/w\.amazon\.com\/.+/g)) {
        var product;
        const url = body.split('/')
        url.forEach((e,i) => {
            if(~e.search('amazon') && !product) product = url[i + 1].replace(/\-/g,' ')
        })
        //request(`https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=${process.env.EBAY_APP_ID}&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=${product.replace(/\s/g,'%20')}&itemFilter(0).name=FreeShippingOnly&itemFilter(0).value=true`)
        const response = '**It looks like this user has linked to a product on Amazon** \n \n *Before you make a purchase consider, is this product...* \n \n * a different version of something that you already own, and could you be content with the version you already have? \n \n * something that you could make, or reasonable learn to make? \n \n * something that you would use regularly for an extended period of time? If not, is it something that you could borrow or rent? \n \n * going to bring more happiness into your life? \n \n &nbsp; &nbsp; \n \n If do decide you need to purchase this product, have you checked eBay and Craigslist?'
        comment.reply(response)

    } else {
        console.log(body)
    }
});
