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
    const _MAX_LENGTH_ = 30;
    const _STORAGE_NAME_ = 'bitly_access_token';
    const _ACCESS_TOKEN_ = await cutils.storageGet(_STORAGE_NAME_);
    const _BITLY_API_URL_ = 'https://api-ssl.bitly.com/v3/shorten?access_token=%%ACCESS_TOKEN%%&longUrl=%%LONGURL%%';
    
    main();
    
    async function main() {
        let info = await getTabTitleURL();
        let request_url = _BITLY_API_URL_.replace('%%ACCESS_TOKEN%%', _ACCESS_TOKEN_);
        request_url = request_url.replace('%%LONGURL%%', info.URL);
        info.short_url = await fetchData(request_url);
        info.short_url = JSON.parse(info.short_url);
        
        let clipped_div = document.querySelector('#clipped');
        let title_div = document.querySelector('#title');
        let url_div = document.querySelector('#url');
        let length = {
            title: Math.floor(6 * info.TITLE.length),
            url: Math.floor(6 * info.short_url.data.url.length),
            max: 350
        };

        function cutText(text, len, truncation) {
            if (truncation === undefined) { truncation = ''; }
            var text_array = text.split('');
            var count = 0;
            var str = '';
            for (let i = 0; i < text_array.length; i++) {
                var n = escape(text_array[i]);
                if (n.length < 4) count++;
                else count += 2;
                if (count > len) {
                    return str + truncation;
                }
                str += text.charAt(i);
            }
            return text;
        }
        
        title_div.innerHTML = '['+  cutText(info.TITLE, _MAX_LENGTH_, ' ...') + ']';
        url_div.innerHTML = cutText(info.short_url.data.url, _MAX_LENGTH_, ' ...');
                                    
        let copy_string = `[${info.TITLE}]\n${info.short_url.data.url}\n`;
        copyToClipboard(copy_string);
    }

    async function fetchData(url) {
        const header = {method: 'POST', mode: 'cors'};
        const data = await fetch(url, header);
        return data.text();
    }

    function copyToClipboard(str) {
        const el = document.createElement('textarea');
        el.value = str;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    };

    async function getTabTitleURL() {
        return new Promise( (resolve, reject) => {
            chrome.tabs.getSelected(null, tab => {
                resolve({URL: tab.url, TITLE: tab.title});
            });
        });
    }



}());

