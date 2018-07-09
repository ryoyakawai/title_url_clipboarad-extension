/**
 * Copyright 2018 Ryoya Kawai
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

import ChromeUtils from './chromeutils.js';

(async function(){

    const cutils = new ChromeUtils();
    const _STORAGE_NAME_ = 'bitly_access_token';
    const saveButton = document.querySelector('#save_token_button');
    const access_token = document.querySelector('#access_token');
    const saved_token = document.querySelector('#saved_token');
    const oAuthBitly = document.querySelector('#oauth_bitly');
    const _BITLY_ = {
        oauth_url: 'https://bitly.com/oauth/authorize?client_id=%%CLIENTID%%&redirect_uri=%%REDIRECTURI%%',
        token_url: 'https://api-ssl.bitly.com/oauth/access_token?client_id=%%CLIENTID%%&client_secret=%%CLIENTSECRET%%&code=%%CODE%%&redirect_uri=%%REDIRECTURI%%',
        client_id: 'eab11821ba2c7cceb93660d8caca2ce6077ae9da',
        client_secret: '0cc2881337f96b27b4611f2cce1b9d831f6792d3',
        redirect_uri: chrome.identity.getRedirectURL('src/callback.html')
    };

    let key = await getBitlyAccessToken();
    if(key !== null || key.length !== '') {
        //access_token.value = key;
        saved_token.innerHTML = key;
    }
    
    saveButton.addEventListener('mousedown', event => {
        handleReceivedAccessToken(access_token.value, saved_token);
    }, false);

    oAuthBitly.addEventListener('mousedown', async (event) => {
        let keys = await getBitlyAccessTokenOAuth();
        handleReceivedAccessToken(keys.access_token, saved_token);
    }, false);
    
    function handleReceivedAccessToken(access_token, elem) {
        saveBitlyAccessToken(access_token);
        elem.innerHTML = access_token;
    }

    async function getBitlyAccessToken() {
        let key = null;
        key = await cutils.storageGet(_STORAGE_NAME_);
        return key;
    }

    async function saveBitlyAccessToken(token) {
        await cutils.storageSet(_STORAGE_NAME_, token);
    }    
    
    async function getBitlyAccessTokenOAuth() {
        const code_url = _BITLY_.oauth_url
              .replace('%%CLIENTID%%', _BITLY_.client_id)
              .replace('%%REDIRECTURI%%', _BITLY_.redirect_uri);
        return new Promise( (resolve, reject) =>{
            chrome.identity.launchWebAuthFlow(
                { 'url': code_url, 'interactive': true },
                function(redirect_url) {
                    let params = {};
                    const a_params = (redirect_url.split('?').pop()).split('&');
                    for(let i in a_params) {
                        let sp_val = a_params[i].split('=');
                        params[sp_val[0]] = sp_val[1]; 
                    }
                    const token_url = _BITLY_.token_url
                          .replace('%%CLIENTID%%', _BITLY_.client_id)
                          .replace('%%CLIENTSECRET%%', _BITLY_.client_secret)
                          .replace('%%CODE%%', params.code)
                          .replace('%%REDIRECTURI%%', _BITLY_.redirect_uri);
                    const header = {method: 'POST', mode: 'cors'};
                    fetch(token_url, header).then( res => {
                        return  res.text();
                    }).then( data => {
                        let params = {};
                        const a_params = data.split('&');
                        for(let i in a_params) {
                            let sp_val = a_params[i].split('=');
                            params[sp_val[0]] = sp_val[1]; 
                        }
                        resolve(params);
                    });
                });
        });
    }
    
}());

