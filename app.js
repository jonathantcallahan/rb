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

// console.log(r)

const client = new Snoostorm(r);

const streamOpts = {
    subreddit: 'all',
    results: 25
};

const comments = client.CommentStream(streamOpts);

let count = 0

const tinyText = sentence => sentence.split(' ').map(e => `^${e}`).join(' ')

comments.on('comment', comment => {
    const {body} = comment;

    if(body.indexOf('w.amazon.com/') > -1) {
        var product;
        const url = body.split('/')
        url.forEach((e,i) => {
            if(~e.search('amazon') && !product) product = url[i + 1].replace(/\-/g,' ')
        })

        const body1 = 'Before clicking consider: will this purchase bring you happiness? If so, have you considered buying locally or used from another person?'
        const body2 = 'Will this purchase bring you happiness? If so, have you considered buying locally or used from another person?'
        
        const isAffiliate = !!~url.join('').search('tag=')
        const affiliateMessage = isAffiliate ? 
            '`!THE LINK IS AN AFFILIATE LINK!` \n \n `THE USER WHO POSTED IT HAS A VESTED INTEREST IN YOU PURCHASING IT`  [what is an affiliate link](https://yourconsumerguide.co.uk/2018/01/07/spot-affiliate-marketing/)\n \n' : 
            '`The link is not an affiliate link` [[?]](https://yourconsumerguide.co.uk/2018/01/07/spot-affiliate-marketing/)\n \n'
        
            const response = '**^(It) ^(looks) ^(like) ^(this) ^(user) ^(has) ^(linked) ^(to) ^(a) ^(product) ^(on) ^(Amazon)** \n \n' + 
        affiliateMessage +
        tinyText(isAffiliate ? body2 : body1) +
        '&nbsp; &nbsp; \n \n \n \n^^^[<3](https://i.imgur.com/stC5T8C.jpg) ^^^I ^^^am ^^^a ^^^bot, ^^^if ^^^you ^^^have ^^^any ^^^feedback ^^^please ^^^send ^^^a ^^^message ^^^to ^^^[/u/f_amazon_bot](https://www.reddit.com/u/f_amazon_bot)'
        comment.reply(response)
        count++
        console.log('is affiliate', isAffiliate, count)

    } 
});
