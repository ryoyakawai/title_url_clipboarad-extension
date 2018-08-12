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
import config from './config.js';

(async function(){

  const cutils = new ChromeUtils();
  const useshorturl_checkbox = document.querySelector('#use-shorturl');
  const usecustomdelimiter_radio = document.getElementsByName('use-delimiter');
  const cd_text_01 = document.querySelector('#delimiter-text-01');
  //const usecustomdelimiter_text = document.querySelector('#use-custom-delimiter-text');
  const loginBitly_button = document.querySelector('#login_bitly');
  const logoutBitly_button = document.querySelector('#logout_bitly');
  const statusIcon = document.querySelector('#status-icon');
  const _BITLY_ = config.bitly;
  const _STORAGE_ = config.storagename;

  init();

  useshorturl_checkbox.addEventListener('change', async (event) => {
    await cutils.storageSet(_STORAGE_._USE_SHORTURL_, event.target.checked);
  });

  for(let i in usecustomdelimiter_radio) {
    if( typeof usecustomdelimiter_radio[i].addEventListener !== 'undefined') {
      usecustomdelimiter_radio[i].addEventListener('change', event => {
        let text = cd_text_01.value;
        updateDelimiterFormat( { type:event.target.value, elem_id:usecustomdelimiter_radio[i].id, text: text } );
      });
    }
  }

  cd_text_01.addEventListener('mousedown', event => {
    document.querySelector('#use-custom-delimiter-01').checked = true;
  });
  cd_text_01.addEventListener('change', async (event) => {
    let param = await cutils.storageGet(_STORAGE_._USE_CUSTOM_DELIMITER_);
    param.text = event.target.value;
    updateDelimiterFormat( param );
  });

  async function updateDelimiterFormat(param) {
    await cutils.storageSet(_STORAGE_._USE_CUSTOM_DELIMITER_, param);
  }

  loginBitly_button.addEventListener('mousedown', async (event) => {
    let keys = await getBitlyAccessTokenOAuth();
    await saveBitlyAccessToken(keys.access_token);
    ckechBitlyStatus();
  }, false);

  logoutBitly_button.addEventListener('mousedown', async (event) => {
    await removeAuthTokenStorage();
    ckechBitlyStatus();
  }, false);

  async function init() {
    await ckechBitlyStatus();
    await checkUseShorturlStatus();
    await checkDelimiterSetting();
  }

  async function checkDelimiterSetting() {
    let d_s = await cutils.storageGet(_STORAGE_._USE_CUSTOM_DELIMITER_);
    document.querySelector('#' + d_s.elem_id).checked = true;
    cd_text_01.value = d_s.text;
  }

  async function checkUseShorturlStatus() {
    let use_shorurl = await cutils.storageGet(_STORAGE_._USE_SHORTURL_);
    if(use_shorurl === true) {
      useshorturl_checkbox.setAttribute('checked', 'checked');
    }
  }

  async function ckechBitlyStatus() {
    loginBitly_button.style.display =
      logoutBitly_button.style.display = 'none';
    let key = await getBitlyAccessTokenStorage();
    if(key === null) {
      statusIcon.src = statusIcon.src.replace('_on', '_off');
      loginBitly_button.style.removeProperty('display');
    } else {
      statusIcon.src = statusIcon.src.replace('_off', '_on');
      logoutBitly_button.style.removeProperty('display');
    }
  }

  async function removeAuthTokenStorage() {
    let key = await getBitlyAccessTokenStorage();
    if(key !== null) {
      await cutils.identity_removeCachedAuthToken(key);
      removeBitlyAccessToken();
    }
  }

  async function getBitlyAccessTokenStorage() {
    let key = await cutils.storageGet(_STORAGE_._TOKEN_);
    return key;
  }

  async function saveBitlyAccessToken(access_token) {
    await cutils.storageSet(_STORAGE_._TOKEN_, access_token);
  }

  async function removeBitlyAccessToken() {
    await cutils.storageSet(_STORAGE_._TOKEN_, null);
  }

  async function getBitlyAccessTokenOAuth() {
    const n = 46;
    const code_url = _BITLY_.oauth_url
          .replace('%%CLIENTID%%', _BITLY_.client_id)
          .replace('%%REDIRECTURI%%', _BITLY_.redirect_uri);
    let token_url = _BITLY_.token_url
        .replace('%%CLIENTID%%', _BITLY_.client_id)
        .replace('%%CLIENTSECRET%%', cutils.d(_BITLY_.client_secret, n))
        .replace('%%REDIRECTURI%%', _BITLY_.redirect_uri);
    return cutils.identity_launchWebAuthFlow(code_url, token_url);
  }

}());

