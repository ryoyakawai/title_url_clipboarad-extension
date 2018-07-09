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


export default class ChromeUtils {
    constructor() {
    }

    async storageGet(name) {
        return new Promise( (resolve, reject) => {
            try {
                chrome.storage.sync.get(name, (data) => {
                    if(typeof data[name]=='undefined') {
                        data[name] = null;
                    }
                    resolve(data[name]);
                });
            } catch (e) {
                reject(new Error(e));
            }
        });
    }

    async storageSet(name, data) {
        return new Promise((resolve, reject) => {
            try {
                let setData = {};
                setData[name] = data;
                chrome.storage.sync.set(setData, () => {
                    resolve(true);
                });
            } catch(e) {
                reject(new Error(e));
            }
        });
    }

    async identity_launchWebAuthFlow(code_url, token_url) {
        return new Promise( (resolve, reject) =>{
            chrome.identity.launchWebAuthFlow(
                { 'url': code_url, 'interactive': true },
                function(redirect_url) {
                    const a_params = (redirect_url.split('?').pop()).split('&');
                    const params = convertArrayToObject(a_params);
                    const header = {method: 'POST', mode: 'cors'};
                    token_url = token_url.replace('%%CODE%%', params.code);
                    fetch(token_url, header).then( res => {
                        return  res.text();
                    }).then( data => {
                        const a_params = data.split('&');
                        const params = convertArrayToObject(a_params);
                        resolve(params);
                    });
                    function convertArrayToObject(a_params) {
                        let params = {};
                        for(let i in a_params) {
                            let sp_val = a_params[i].split('=');
                            params[sp_val[0]] = sp_val[1];
                        }
                        return params;
                    }
                });
        });
    }

    identity_removeCachedAuthToken(token) {
        const details = { token: token };
        return new Promise( (resolve, reject) => {
            chrome.identity.removeCachedAuthToken(details, () => {
                resolve();
            });
        });
    }
    
    identity_getRedirectURL(path) {
        return chrome.identity.getRedirectURL(path);
    }

    updateIcon(icon) {
        chrome.browserAction.setIcon({
            imageData : icon
        });
    }

    updateBadgeText(text) {
        chrome.browserAction.setBadgeText({text: text});
    }

    updateTitle(text) {
        chrome.browserAction.setTitle({title: text});
    }

    opentab(path) {
        chrome.tabs.create({ url: path });
    }

    setWakeupAction(callback) {
        chrome.idle.onStateChanged = callback;
    }
}
