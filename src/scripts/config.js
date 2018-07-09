'use strict';

import ChromeUtils from './chromeutils.js';

const cutils = new ChromeUtils();
const config = {
    storagename: {
        _TOKEN_: 'bitly_access_token',
        _USE_SHORTURL_: 'use_short_url'        
    },
    bitly: {
        shorten_url : 'https://api-ssl.bitly.com/v3/shorten?access_token=%%ACCESS_TOKEN%%&longUrl=%%LONGURL%%',
        oauth_url: 'https://bitly.com/oauth/authorize?client_id=%%CLIENTID%%&redirect_uri=%%REDIRECTURI%%',
        token_url: 'https://api-ssl.bitly.com/oauth/access_token?client_id=%%CLIENTID%%&client_secret=%%CLIENTSECRET%%&code=%%CODE%%&redirect_uri=%%REDIRECTURI%%',
        client_id: 'eab11821ba2c7cceb93660d8caca2ce6077ae9da',
        client_secret: '0cc2881337f96b27b4611f2cce1b9d831f6792d3',
        redirect_uri: cutils.identity_getRedirectURL('src/callback.html')
    },
    text: {
        max_length : 30,
        elem_max_length: 350
    }
};

export default config;

