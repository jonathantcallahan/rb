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
    subreddit: 'testingground4bots',
    results: 25
};

const comments = client.CommentStream(streamOpts);

let count = 0

const tinyText = () => {}

comments.on('comment', comment => {
    const {body} = comment;
    // console.log(body);
    if(body.indexOf('w.amazon.com/') > -1) {
        var product;
        const url = body.split('/')
        url.forEach((e,i) => {
            if(~e.search('amazon') && !product) product = url[i + 1].replace(/\-/g,' ')
        })


        const isAffiliate = !!~url.join('').search('tag=')
        const affiliateMessage = isAffiliate ? '`!THE LINK IS AN AFFILIATE LINK. THE USER WHO POSTED IT HAS A VESTED INTEREST IN YOU PURCHASING IT!`[what is an affiliate link](https://yourconsumerguide.co.uk/2018/01/07/spot-affiliate-marketing/)\n \n' : '`The link is not an affiliate link` [?](https://yourconsumerguide.co.uk/2018/01/07/spot-affiliate-marketing/)\n \n'
        //request(`https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=${process.env.EBAY_APP_ID}&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=${product.replace(/\s/g,'%20')}&itemFilter(0).name=FreeShippingOnly&itemFilter(0).value=true`)
        const response = '**^(It) ^(looks) ^(like) ^(this) ^(user) ^(has) ^(linked) ^(to) ^(a) ^(product) ^(on) ^(Amazon)** \n \n' + 
        affiliateMessage +
        '###**Before you make a purchase consider, is this product...** \n \n**1** a different version of something that you already own. If so, could you learn to be happy with the version you already have? \n \n**2** something that you could make, or reasonably learn to make? \n \n**3** something that you would use regularly for an extended period of time? If not, is it something that you could borrow from a friend or rent? \n \n**4** going to bring more happiness into your life? \n \n &nbsp; &nbsp; \n \n \n \nIf you have decided that you are going to purchase this product, have you checked eBay and Craigslist? \n \n &nbsp; &nbsp; \n \n \n \n^^^[<3](https://i.imgur.com/stC5T8C.jpg) ^^^I ^^^am ^^^a ^^^bot, ^^^if ^^^you ^^^have ^^^any ^^^feedback ^^^please ^^^send ^^^a ^^^message ^^^to ^^^[/u/f_amazon_bot](https://www.reddit.com/u/f_amazon_bot)'
        comment.reply(response)
        count++
        console.log('is affiliate', isAffiliate, count)

    } else {
        count++
        console.log('comment', count)
    }
});
