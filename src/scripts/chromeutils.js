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
    const data = await chrome.storage.sync.get(name);
    return data[name] === undefined ? null : data[name];
  }

  async storageSet(name, data) {
    let setData = {};
    setData[name] = data;
    await chrome.storage.sync.set(setData);
    return true;
  }

  async identity_launchWebAuthFlow(code_url, token_url) {
    const redirect_url = chrome.identity.getRedirectURL()
    return new Promise( (resolve, reject) =>{
      chrome.identity.launchWebAuthFlow(
        { 'url': code_url, 'interactive': true },
        function(response_url) {
          if (chrome.runtime.lastError || !response_url) {
            reject(chrome.runtime.lastError);
            return;
          }
          const a_params = (response_url.split('?').pop()).split('&');
          const params = convertArrayToObject(a_params);
          const header = {method: 'POST', mode: 'cors'};
          let final_token_url = token_url.replace('%%CODE%%', params.code);
          fetch(final_token_url, header).then( res => {
            return  res.text();
          }).then( data => {
            const a_params = data.split('&');
            const params = convertArrayToObject(a_params);
            resolve(params);
          }).catch(reject);

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

  async identity_removeCachedAuthToken(token) {
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

  d(c,n){let a=c.split('s'), r=''; a.map(l=>{r+=String.fromCharCode(parseInt(l)-n);});return r;}

  updateIcon(icon) {
    chrome.action.setIcon({
      imageData : icon
    });
  }

  updateBadgeText(text) {
    chrome.action.setBadgeText({text: text});
  }

  updateTitle(text) {
    chrome.action.setTitle({title: text});
  }

  opentab(path) {
    chrome.tabs.create({ url: path });
  }

  setWakeupAction(callback) {
    chrome.idle.onStateChanged.addListener(callback);
  }
}
