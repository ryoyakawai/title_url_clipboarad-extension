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
    
    let key = await getBitlyAccessToken();
    if(key !== null || key.length !== '') {
        //access_token.value = key;
        saved_token.innerHTML = key;
    }
    
    saveButton.addEventListener('mousedown', event => {
        saveBitlyAccessToken(access_token.value);
        saved_token.innerHTML = access_token.value;
    }, false);

    async function getBitlyAccessToken() {
        let key = null;
        key = await cutils.storageGet(_STORAGE_NAME_);
        return key;
    }

    async function saveBitlyAccessToken(token) {
        await cutils.storageSet(_STORAGE_NAME_, token);
    }    

}());

